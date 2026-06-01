import { renderText } from "@/lib/render-text";
import { ConfidenceDisplay } from "@/components/ConfidenceDisplay";
import type { ConfidenceData } from "@/types/database";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  confidence?: ConfidenceData | null;
}

export function MessageBubble({ role, content, confidence }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUser
            ? "bg-green-700 text-white"
            : "border bg-white text-gray-900"
        }`}
      >
        <p className="whitespace-pre-wrap text-sm">{renderText(content)}</p>
        {confidence && !isUser && (
          <div className="mt-2 border-t pt-2">
            <ConfidenceDisplay confidence={confidence} />
          </div>
        )}
      </div>
    </div>
  );
}
