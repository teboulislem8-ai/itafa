export interface WilayaRow {
  code: number;
  name_ar: string;
  name_fr: string;
  name_en: string;
  latitude: number;
  longitude: number;
}

export interface ProfileRow {
  id: string;
  nickname: string;
  wilaya_code: number;
  specialization: string;
  language: "ar" | "fr" | "en";
  created_at: string;
  updated_at: string;
}

export interface ProfileInsert {
  id: string;
  nickname: string;
  wilaya_code: number;
  specialization?: string;
  language?: "ar" | "fr" | "en";
}

export interface ProfileUpdate {
  nickname?: string;
  wilaya_code?: number;
  specialization?: string;
  language?: "ar" | "fr" | "en";
}

export type ChatMode = "plant" | "pest" | "soil" | "analytics";

export interface ChatRow {
  id: string;
  user_id: string;
  mode: ChatMode;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatInsert {
  user_id: string;
  mode: ChatMode;
  title?: string;
}

export interface ChatUpdate {
  mode?: ChatMode;
  title?: string;
}

export type MessageRole = "user" | "assistant";
export type ClassifierResult = "diagnostic" | "general";

export interface MessageRow {
  id: string;
  chat_id: string;
  role: MessageRole;
  content: string;
  skills_used: string[];
  confidence: ConfidenceData | null;
  classifier_result: ClassifierResult | null;
  created_at: string;
}

export interface MessageInsert {
  chat_id: string;
  role: MessageRole;
  content: string;
  skills_used?: string[];
  confidence?: ConfidenceData | null;
  classifier_result?: ClassifierResult | null;
}

export interface ConfidenceData {
  score: number;
  reasoning: string;
  passes: number;
}

export interface UploadedFileRow {
  id: string;
  user_id: string;
  chat_id: string | null;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  storage_path: string;
  expires_at: string;
  created_at: string;
}

export interface UploadedFileInsert {
  user_id: string;
  chat_id?: string | null;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  storage_path: string;
  expires_at: string;
}

export type DocumentType = "session_report" | "prescription" | "observation_sheet";

export interface GeneratedDocumentRow {
  id: string;
  user_id: string;
  chat_id: string;
  type: DocumentType;
  storage_path: string;
  created_at: string;
}

export interface GeneratedDocumentInsert {
  user_id: string;
  chat_id: string;
  type: DocumentType;
  storage_path: string;
}
