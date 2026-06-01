"use client";

import { useState, useCallback } from "react";
import type { ChatMode } from "@/types/database";
import type { ConfidenceData } from "@/types/database";
import type { ChatListItem } from "@/types/chat";
import type { WeatherData, NextStep } from "@/types/ai";
import { setNextSteps } from "@/lib/next-steps-store";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface UseChatReturn {
  messages: Message[];
  loading: boolean;
  error: string | null;
  weather: WeatherData | null;
  location: string | null;
  confidence: ConfidenceData | null;
  weatherLoading: boolean;
  sendMessage: (content: string, mode: ChatMode, chatId?: string) => Promise<string | null>;
  loadMessages: (chatId: string) => Promise<string | undefined>;
  loadWeather: () => Promise<void>;
  listChats: () => Promise<ChatListItem[]>;
  clearMessages: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<ConfidenceData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const sendMessage = useCallback(
    async (
      content: string,
      mode: ChatMode,
      chatId?: string,
    ): Promise<string | null> => {
      try {
        setLoading(true);
        setError(null);

        const userMessage: Message = {
          id: crypto.randomUUID(),
          role: "user",
          content,
        };
        setMessages((prev) => [...prev, userMessage]);

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chatId, mode, content }),
        });

        if (!res.ok) {
          const body = await res.json();
          throw new Error(body.error ?? "Failed to send message");
        }

        const data = await res.json();

        const assistantMessage: Message = {
          id: data.messageId,
          role: "assistant",
          content: data.content,
        };
        setMessages((prev) => [...prev, assistantMessage]);

        if (data.weather) setWeather(data.weather);
        if (data.location) setLocation(data.location);
        if (data.confidence) setConfidence(data.confidence);
        if (data.nextSteps) {
          console.log("sendMessage nextSteps:", data.nextSteps, "chatId:", data.chatId || chatId);
          setNextSteps(data.nextSteps, data.chatId || chatId || undefined);
        }

        return data.chatId;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send message");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const loadMessages = useCallback(async (chatId: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/chat?chatId=${chatId}`);
      if (!res.ok) throw new Error("Failed to load messages");

      const data = await res.json();
      setMessages(data.messages ?? []);
      if (data.weather) setWeather(data.weather);
      if (data.location) setLocation(data.location);
      if (data.confidence) setConfidence(data.confidence);
      if (data.nextSteps) {
        console.log("loadMessages nextSteps:", data.nextSteps, "chatId:", chatId);
        setNextSteps(data.nextSteps, chatId);
      }
      return data.chat?.mode as string | undefined;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, []);

  const listChats = useCallback(async (): Promise<ChatListItem[]> => {
    try {
      const res = await fetch("/api/chat?list=true");
      if (!res.ok) return [];
      const data = await res.json();
      return data.chats ?? [];
    } catch {
      return [];
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const loadWeather = useCallback(async () => {
    try {
      setWeatherLoading(true);
      const res = await fetch("/api/weather");
      if (!res.ok) return;
      const data = await res.json();
      if (data.weather) setWeather(data.weather);
      if (data.location) setLocation(data.location);
    } catch {
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  return {
    messages,
    loading,
    error,
    weather,
    location,
    confidence,
    weatherLoading,
    sendMessage,
    loadMessages,
    loadWeather,
    listChats,
    clearMessages,
  };
}
