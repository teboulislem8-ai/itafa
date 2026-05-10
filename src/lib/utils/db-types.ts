export interface Profile {
  id: string;
  full_name: string;
  wilaya: string;
  specializations: string[];
  language_pref: "ar" | "fr" | "auto";
  created_at: string;
}

export interface Session {
  id: string;
  agent_id: string;
  title: string;
  crop: string;
  wilaya: string;
  status: "open" | "closed" | "report_generated";
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  skill_triggered: string;
  language: string;
  created_at: string;
}

export interface Observation {
  id: string;
  session_id: string;
  crop: string;
  growth_stage: string;
  symptoms: Record<string, unknown>;
  soil_notes: string;
  irrigation_notes: string;
  photos: string[];
  ai_analysis: string;
  created_at: string;
}

export interface LabReport {
  id: string;
  session_id: string;
  report_type: "soil" | "water";
  raw_values: Record<string, number>;
  ai_interpretation: string;
  flags: Record<string, string>;
  created_at: string;
}

export interface FieldReport {
  id: string;
  session_id: string;
  language: "ar" | "fr";
  content: string;
  format: "markdown" | "pdf_ready";
  created_at: string;
}
