import type { ChatMode, ClassifierResult, ConfidenceData } from "./database";

export interface ClassifierOutput {
  result: ClassifierResult;
  reasoning: string;
}

export type DetectedLang = "ar" | "fr" | "en";
export type PipelineComplexity = "simple" | "complex";

export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  context: string;
  keywords: string[];
}

export interface SkillSelectionInput {
  mode: ChatMode;
  content: string;
}

export interface SkillSelectionOutput {
  skills: SkillDefinition[];
}

export interface EnrichedContext {
  weather: WeatherData | null;
  climate: ClimateData | null;
  error?: string;
}

export interface WeatherData {
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  weather_code: number;
  temp_max: number;
  temp_min: number;
  precipitation: number;
  evapotranspiration: number;
}

export interface ClimateData {
  solar_irradiance: number;
  temperature_avg: number;
  precipitation: number;
}

export interface ProcessedAttachment {
  type: "text" | "image";
  mimeType: string;
  data: string;
}

export interface PipelineInput {
  chatId: string;
  messageId: string;
  content: string;
  mode: ChatMode;
  skills: SkillDefinition[];
  context: EnrichedContext;
  messageHistory: Array<{ role: "user" | "assistant"; content: string }>;
  attachments?: ProcessedAttachment[];
  language?: DetectedLang;
}

export interface NextStep {
  action: string;
  priority: "high" | "medium" | "low";
  detail?: string;
}

export interface PipelineOutput {
  response: string;
  confidence: ConfidenceData;
  classifierResult: ClassifierResult;
  skillsUsed: string[];
  nextSteps: NextStep[];
}

export type AttachmentsInput = Array<{
  mimeType: string;
  data: string;
}>;
