const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const MODEL = "gemini-2.5-flash";

export interface ConfidenceResult {
  agreementScore: number;
  consistencyConfidence: number;
  contradictionDetected: boolean;
  passDiagnoses: string[];
  imagePresent: boolean;
  triggeredBy: string;
  skipReason?: string;
}

const AMBIGUITY_PATTERNS = [
  /peut-être|maybe|uncertain|incertain|pas sûr|not sure|difficile|difficult|ambigu|unclear/i,
  /plusieurs|several|multiple|possibilité|possibility/i,
  /confus|confusing|ressemble|looks like|similar|similaire/i,
];

const CONFIDENCE_REQUEST_PATTERNS = [
  /confiance|confianc|sûr|sure|certain|certainty|combien|how (sure|certain)/i,
  /fiabilité|reliab|trust|score|note|rate/i,
  /درجة|ثقة|موثوق|تأكيد/i,
];

export function shouldTriggerConfidence(
  message: string,
  hasImage: boolean
): { trigger: boolean; reason: string } {
  if (!hasImage) return { trigger: false, reason: "text_only" };

  const ambiguityDetected = AMBIGUITY_PATTERNS.some((p) => p.test(message));
  const confidenceRequested = CONFIDENCE_REQUEST_PATTERNS.some((p) => p.test(message));

  if (ambiguityDetected) return { trigger: true, reason: "ambiguity" };
  if (confidenceRequested) return { trigger: true, reason: "explicit_request" };

  return { trigger: false, reason: "no_trigger" };
}

const CONFIDENCE_SYSTEM_PROMPT = `You are an agronomic diagnostic consistency validator for Algerian agriculture.

You are given an image of a crop problem and a brief context. Generate a concise diagnostic conclusion (2-3 sentences maximum).

Focus on:
1. Most probable cause (nutritional, abiotic, or biotic)
2. Key symptoms that support your conclusion
3. One specific field check that would confirm or exclude your diagnosis

Be precise. Do not hedge excessively. Do not write a full report — just the diagnostic conclusion.`;

const DIAGNOSIS_EXTRACTION_PROMPT = `Extract the PRIMARY DIAGNOSTIC CONCLUSION from the text below.
Return exactly one line containing only the main diagnosis (maximum 20 words).
Do not include explanations, precautions, or formatting.

Text to analyze:
`;

function extractDiagnosis(text: string): string {
  const lines = text.split("\n").filter((l) => l.trim());
  for (const line of lines) {
    if (
      /diagnostic|DIAGNOSTIC|conclusion|probable|cause|most likely|hypothèse|HYPOTHÈSE/i.test(line)
    ) {
      return line.trim().slice(0, 120);
    }
  }
  return lines[0]?.trim().slice(0, 120) || "N/A";
}

function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function textSimilarity(a: string, b: string): number {
  const aNorm = a.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF\s]/g, "").trim();
  const bNorm = b.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF\s]/g, "").trim();
  if (!aNorm || !bNorm) return 0;

  const dist = levenshteinDistance(aNorm, bNorm);
  const maxLen = Math.max(aNorm.length, bNorm.length);
  return Math.max(0, 1 - dist / maxLen);
}

function findContradictions(diagnoses: string[]): boolean {
  const contradictionPairs = [
    [/carenc|deficient/i, /exces|toxic|brûlure|burn/i],
    [/fongique|fungal/i, /bactérien|bacterial/i],
    [/sécheresse|drought/i, /excès d.eau|overwater|hypoxi/i],
    [/virus|viral/i, /nutrit|nutrition/i],
    [/insecte|pest|ravageur/i, /abiotique|abiotic/i],
  ];

  for (let i = 0; i < diagnoses.length; i++) {
    for (let j = i + 1; j < diagnoses.length; j++) {
      for (const [patA, patB] of contradictionPairs) {
        const aHas = patA.test(diagnoses[i]) && patB.test(diagnoses[j]);
        const bHas = patB.test(diagnoses[i]) && patA.test(diagnoses[j]);
        if (aHas || bHas) return true;
      }
    }
  }
  return false;
}

async function callGeminiForDiagnosis(
  imageBase64: string,
  mimeType: string,
  context: string,
  temperature: number
): Promise<string> {
  const body = {
    contents: [
      {
        role: "user",
        parts: [
          { inline_data: { mime_type: mimeType, data: imageBase64 } },
          { text: `Context: ${context}\n\nProvide a concise diagnostic conclusion (2-3 sentences).` },
        ],
      },
    ],
    system_instruction: { parts: [{ text: CONFIDENCE_SYSTEM_PROMPT }] },
    generationConfig: {
      temperature,
      maxOutputTokens: 512,
    },
  };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error (temp=${temperature}): ${errText}`);
  }

  const json: any = await res.json();
  return json.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

export async function computeConfidence(
  imageUrl: string,
  diagnosisContext: string
): Promise<ConfidenceResult> {
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) {
    return {
      agreementScore: 0,
      consistencyConfidence: 0,
      contradictionDetected: false,
      passDiagnoses: [],
      imagePresent: true,
      triggeredBy: "error",
    };
  }

  const imgBuffer = await imgRes.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(imgBuffer)));
  const mimeType = imgRes.headers.get("content-type") || "image/jpeg";

  const temperatures = [0.2, 0.4, 0.6];
  const rawDiagnoses: string[] = [];

  for (const temp of temperatures) {
    try {
      const result = await callGeminiForDiagnosis(base64, mimeType, diagnosisContext, temp);
      rawDiagnoses.push(result);
    } catch {
      rawDiagnoses.push("");
    }
  }

  const validDiagnoses = rawDiagnoses.filter((d) => d.length > 10);
  const extracted = validDiagnoses.map(extractDiagnosis);

  if (validDiagnoses.length < 2) {
    return {
      agreementScore: 0,
      consistencyConfidence: 0,
      contradictionDetected: false,
      passDiagnoses: validDiagnoses,
      imagePresent: true,
      triggeredBy: "insufficient_passes",
    };
  }

  let totalSimilarity = 0;
  let comparisons = 0;
  for (let i = 0; i < extracted.length; i++) {
    for (let j = i + 1; j < extracted.length; j++) {
      totalSimilarity += textSimilarity(extracted[i], extracted[j]);
      comparisons++;
    }
  }

  const agreementScore = Math.round((totalSimilarity / comparisons) * 100);
  const contradictionDetected = findContradictions(validDiagnoses);

  const passCountBonus = validDiagnoses.length === 3 ? 10 : 0;
  let consistencyConfidence = Math.round(agreementScore * 0.7 + passCountBonus);

  if (contradictionDetected) consistencyConfidence = Math.max(0, consistencyConfidence - 25);
  if (consistencyConfidence > 95) consistencyConfidence = 95;
  if (consistencyConfidence < 5) consistencyConfidence = 5;

  return {
    agreementScore,
    consistencyConfidence,
    contradictionDetected,
    passDiagnoses: validDiagnoses,
    imagePresent: true,
    triggeredBy: "completed",
  };
}
