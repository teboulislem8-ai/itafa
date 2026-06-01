import "server-only";
import { generateText } from "ai";
import type { ModelMessage } from "ai";
import { getDefaultModel, getHighTempModel } from "./models";
import { SYSTEM_PROMPT, buildLanguageBlock, buildSkillContext } from "./prompts";
import { classifyMessage } from "./classifier";
import { selectSkills } from "./skills/skill-map";
import { SKILL_REGISTRY } from "./skills/registry";
import {
  parseNextSteps,
} from "./next-steps";
import type {
  PipelineInput,
  PipelineOutput,
  EnrichedContext,
  WeatherData,
  ClimateData,
  NextStep,
  ProcessedAttachment,
} from "@/types/ai";

const OPEN_METEO_BASE = "https://api.open-meteo.com/v1/forecast";
const NASA_POWER_BASE = "https://power.larc.nasa.gov/api/temporal/daily/point";

async function fetchWeather(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation",
      daily: [
        "temperature_2m_max",
        "temperature_2m_min",
        "precipitation_sum",
        "et0_fao_evapotranspiration",
      ].join(","),
      timezone: "auto",
      forecast_days: "1",
    });

    const res = await fetch(`${OPEN_METEO_BASE}?${params}`);
    if (!res.ok) return null;

    const json = await res.json();
    if (json.error) return null;

    const daily = json.daily ?? {};
    const current = json.current ?? {};

    return {
      temperature: current.temperature_2m ?? 0,
      feels_like: current.apparent_temperature ?? 0,
      humidity: current.relative_humidity_2m ?? 0,
      wind_speed: current.wind_speed_10m ?? 0,
      weather_code: current.weather_code ?? 0,
      temp_max: daily.temperature_2m_max?.[0] ?? 0,
      temp_min: daily.temperature_2m_min?.[0] ?? 0,
      precipitation: daily.precipitation_sum?.[0] ?? 0,
      evapotranspiration: daily.et0_fao_evapotranspiration?.[0] ?? 0,
    };
  } catch {
    return null;
  }
}

async function fetchClimate(lat: number, lon: number): Promise<ClimateData | null> {
  try {
    const params = new URLSearchParams({
      parameters: "ALLSKY_SFC_SW_DWN,T2M_MAX,T2M_MIN,PRECTOTCORR",
      community: "AG",
      longitude: lon.toString(),
      latitude: lat.toString(),
      start: "20240101",
      end: "20241231",
      format: "JSON",
    });

    const res = await fetch(`${NASA_POWER_BASE}?${params}`);
    if (!res.ok) return null;

    const json = await res.json();
    const props = json.properties?.parameter ?? {};

    const avg = (arr: number[] | undefined): number | null => {
      if (!arr || arr.length === 0) return null;
      const valid = arr.filter((v) => v >= -999);
      if (valid.length === 0) return null;
      return Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 10) / 10;
    };

    return {
      solar_irradiance: avg(props.ALLSKY_SFC_SW_DWN) ?? 0,
      temperature_avg: avg(props.T2M_MAX) ?? 0,
      precipitation: avg(props.PRECTOTCORR) ?? 0,
    };
  } catch {
    return null;
  }
}

async function enrichContext(lat?: number, lon?: number): Promise<EnrichedContext> {
  if (lat === undefined || lon === undefined) {
    return { weather: null, climate: null };
  }

  const [weather, climate] = await Promise.all([
    fetchWeather(lat, lon),
    fetchClimate(lat, lon),
  ]);

  return { weather, climate };
}

function formatContext(ctx: EnrichedContext): string {
  const parts: string[] = [];

  if (ctx.weather) {
    parts.push(
      `WEATHER: Temp ${ctx.weather.temperature}°C (feels like ${ctx.weather.feels_like}°C, ${ctx.weather.temp_min}–${ctx.weather.temp_max}°C), Humidity ${ctx.weather.humidity}%, Wind ${ctx.weather.wind_speed} km/h, Precip ${ctx.weather.precipitation}mm, ET ${ctx.weather.evapotranspiration}mm.`,
    );
  }

  if (ctx.climate) {
    parts.push(
      `CLIMATE (annual avg): Solar ${ctx.climate.solar_irradiance} kWh/m²/day, Temp ${ctx.climate.temperature_avg}°C, Precip ${ctx.climate.precipitation}mm.`,
    );
  }

  return parts.join("\n\n");
}

async function verifyConfidence(
  diagnosis: string,
  context: string,
): Promise<{ score: number; reasoning: string; passes: number }> {
  const { instance, onSuccess, onError } = getDefaultModel();

  const prompt = `You are a diagnostic quality checker for Algerian agriculture. Given a diagnosis and context, return ONLY raw JSON:

{"agrees":true|false,"confidence":0-100,"gap":"what is missing"}

- agrees: does the evidence support the diagnosis?
- confidence: 0-100 how certain are you?
- gap: what critical information is missing, if nothing then ""

DIAGNOSIS:\n${diagnosis}\n\nCONTEXT:\n${context}`;

  try {
    const { text } = await generateText({
      model: instance,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
    });

    onSuccess();

    const cleaned = text.replace(/```(?:json)?\s*/gi, "").replace(/```\s*$/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      score: parsed.confidence ?? 50,
      reasoning: parsed.gap ?? "",
      passes: 2,
    };
  } catch {
    onError();
    return { score: 50, reasoning: "Verification failed", passes: 1 };
  }
}

function buildFileBlock(attachments: ProcessedAttachment[]): string {
  const textAttachments = attachments.filter((a) => a.type === "text");
  if (textAttachments.length === 0) return "";

  const parts = textAttachments.map(
    (a) => `--- ${a.mimeType} ---\n${a.data}`,
  );
  return `\n\nUSER FILES:\n${parts.join("\n\n")}`;
}

export async function runPipeline(input: PipelineInput): Promise<PipelineOutput> {
  const { content, mode, context, messageHistory, chatId, messageId, attachments, language } = input;

  const classifierResult = await classifyMessage(content);
  const isComplex = classifierResult.result === "diagnostic";

  const skills = selectSkills({ mode, content });

  const modeBlocks: Record<string, string> = {
    plant: `[CURRENT MODE] Plant / Végétal — crop health, diseases, growth, nutrition

DIAGNOSTIC FOCUS: When the user asks a diagnostic question, scope it to plant health (diseases, growth disorders, nutritional deficiencies, varietal issues). Greetings and general conversation are always welcome regardless of mode.

OUT-OF-SCOPE DIAGNOSTICS: If the user asks a specific diagnostic question about pest identification/control or soil analysis/amendments, refuse politely:

"I can help you with that in another conversation. This conversation is set up for PLANT diagnostics to give you the most accurate results."

Redirect them to start a new chat with the correct mode. Do not attempt to answer cross-mode diagnostic questions — this protects accuracy.`,
    pest: `[CURRENT MODE] Pest / Ravageur — insect, mite, nematode, vertebrate pests

DIAGNOSTIC FOCUS: When the user asks a diagnostic question, scope it to pest diagnostics (insects, mites, nematodes, rodents, birds — identification, lifecycle, control strategies). Greetings and general conversation are always welcome regardless of mode.

OUT-OF-SCOPE DIAGNOSTICS: If the user asks a specific diagnostic question about plant diseases/nutrition or soil analysis/amendments, refuse politely:

"I can help you with that in another conversation. This conversation is set up for PEST diagnostics to give you the most accurate results."

Redirect them to start a new chat with the correct mode. Do not attempt to answer cross-mode diagnostic questions — this protects accuracy.`,
    soil: `[CURRENT MODE] Soil / Sol — fertility, structure, salinity, moisture, amendments

DIAGNOSTIC FOCUS: When the user asks a diagnostic question, scope it to soil diagnostics (fertility, structure, salinity, moisture management, organic matter, amendments). Greetings and general conversation are always welcome regardless of mode.

OUT-OF-SCOPE DIAGNOSTICS: If the user asks a specific diagnostic question about plant diseases/growth disorders or pest identification/control, refuse politely:

"I can help you with that in another conversation. This conversation is set up for SOIL diagnostics to give you the most accurate results."

Redirect them to start a new chat with the correct mode. Do not attempt to answer cross-mode diagnostic questions — this protects accuracy.`,
    analytics: `[CURRENT MODE] Analytics / Statistiques — agricultural biostatistics, experimental design, data interpretation

DIAGNOSTIC FOCUS: When the user asks a statistical or data analysis question, scope it to agricultural analytics (experimental design consultation, statistical test recommendation, assumption checking guidance, result interpretation, data visualization suggestions for agronomic data). Greetings and general conversation are always welcome regardless of mode.

You are a consultative statistical advisor — you recommend and explain, but do NOT execute code or run computations yourself.

When a user presents data (in messages or uploaded files), follow this workflow:
1. Ask clarifying questions about experimental design: "Is this a CRD or RCBD? How many treatments? How many replications? What is the response variable (continuous, percentage, count)?"
2. Check assumptions verbally: "For these data, we should check normality and homogeneity of variance. If violated, consider transformations (log, arcsine for percentages) or non-parametric alternatives."
3. Recommend the appropriate statistical method with reasoning: "Given your 2 factors and blocking structure, a two-way ANOVA with Tukey's HSD for mean separation would be appropriate."
4. Help interpret: "If the interaction term is significant (p < 0.05), focus on simple effects rather than main effects."
5. Suggest visualizations: "A grouped bar chart with error bars and significance letters would communicate this clearly."

Statistical methods to cover:
- Experimental design: CRD, RCBD, Split-Plot, Factorial, Nested
- Hypothesis tests: t-test, ANOVA (one/two/multi-way), Mann-Whitney U, Kruskal-Wallis
- Post-hoc: Tukey HSD, Duncan's MRT, LSD, Bonferroni
- Correlation: Pearson, Spearman
- Regression: Linear, Non-linear, Multiple, Logistic
- Multivariate: PCA, Cluster Analysis, Factor Analysis
- Special: Probit/Logit (LC50, EC50), Geostatistics (Kriging), Time series
- Assumptions: Normality (Shapiro-Wilk), Homogeneity (Levene's), Sphericity

OUT-OF-SCOPE: If the user asks for actual computation, code generation (R/Python), or running statistical tests, explain that you provide consultative guidance only and they should use appropriate software (R, Python, SPSS, SAS) to execute. If the user asks about plant disease diagnosis, pest identification, or soil amendment recommendations, refuse politely and redirect them to start a new chat with the correct mode.`,
  };

  const modeBlock = modeBlocks[mode] ?? `[CURRENT MODE] General agriculture`;
  const contextBlock = formatContext(context);
  const skillBlock = buildSkillContext(skills);
  const fileBlock = attachments ? buildFileBlock(attachments) : "";
  const languageBlock = language ? buildLanguageBlock(language) : "";

  const fullSystem = [SYSTEM_PROMPT, languageBlock, modeBlock, skillBlock, contextBlock, fileBlock]
    .filter(Boolean)
    .join("\n\n---\n\n");

  const model = isComplex ? getDefaultModel() : getHighTempModel();

  const imageAttachments = attachments?.filter((a) => a.type === "image") ?? [];

  const messages: ModelMessage[] = messageHistory.map((m) => {
    if (m.role === "assistant") {
      return { role: "assistant" as const, content: m.content };
    }
    return { role: "user" as const, content: m.content };
  });

  if (imageAttachments.length > 0) {
    messages.push({
      role: "user",
      content: [
        { type: "text", text: content },
        ...imageAttachments.map((img) => ({
          type: "image" as const,
          image: img.data,
        })),
      ],
    });
  } else {
    messages.push({ role: "user", content });
  }

  try {
    const { text } = await generateText({
      model: model.instance,
      system: fullSystem,
      messages,
      temperature: isComplex ? 0.3 : 0.7,
    });

    model.onSuccess();

    const { nextSteps } = parseNextSteps(text);

    let confidence = { score: 50, reasoning: "Simple query", passes: 1 };

    if (isComplex) {
      confidence = await verifyConfidence(text, contextBlock || "No additional context");
    }

    return {
      response: text,
      confidence: { ...confidence, passes: isComplex ? 2 : 1 },
      classifierResult: classifierResult.result,
      skillsUsed: skills.map((s) => s.id),
      nextSteps,
    };
  } catch {
    model.onError();
    return {
      response: "An error occurred while processing your request.",
      confidence: { score: 0, reasoning: "Pipeline error", passes: 1 },
      classifierResult: "general",
      skillsUsed: [],
      nextSteps: [],
    };
  }
}

export { enrichContext, formatContext };
