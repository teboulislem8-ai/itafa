import type { ChatMode, ChatRow, MessageRow, ConfidenceData } from "./database";
import type { NextStep, WeatherData } from "./ai";

export interface ChatWithMessages extends ChatRow {
  messages: MessageRow[];
}

export interface ChatListItem {
  id: string;
  mode: ChatMode;
  title: string;
  lastMessage: string;
  messageCount: number;
  createdAt: string;
}

export interface SendMessageRequest {
  chatId?: string;
  mode: ChatMode;
  content: string;
  attachments?: Array<{
    id: string;
    mimeType: string;
    storagePath: string;
  }>;
}

export interface SendMessageResponse {
  chatId: string;
  messageId: string;
  content: string;
  confidence: ConfidenceData;
  skillsUsed: string[];
  nextSteps: NextStep[];
  weather?: WeatherData | null;
  location?: string | null;
}

export interface StreamChunk {
  type: "text" | "confidence" | "skills" | "done" | "error";
  data: unknown;
}

export interface CreateChatRequest {
  mode: ChatMode;
  title?: string;
}

export interface CreateChatResponse {
  id: string;
}
