"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "@/components/MessageBubble";
import { Spinner } from "@/components/ui";
import type { ConfidenceData } from "@/types/database";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  confidence?: ConfidenceData | null;
}

interface ChatWindowProps {
  messages: Message[];
  loading: boolean;
}

export function ChatWindow({ messages, loading }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border bg-white px-6 py-20 text-center">
        <p className="text-gray-500">Start a new diagnostic session</p>
        <p className="text-sm text-gray-400">
          Describe the symptoms or select a mode to begin
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-gray-50 p-4">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          role={msg.role}
          content={msg.content}
          confidence={msg.confidence}
        />
      ))}
      {loading && (
        <div className="flex items-center justify-center py-4">
          <Spinner size="sm" />
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
