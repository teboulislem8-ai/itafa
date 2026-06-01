import "server-only";
import { generateText } from "ai";
import { getDefaultModel } from "./models";
import { CLASSIFIER_PROMPT } from "./prompts";
import type { ClassifierOutput } from "@/types/ai";

export async function classifyMessage(content: string): Promise<ClassifierOutput> {
  const { instance, onSuccess, onError } = getDefaultModel();

  try {
    const { text } = await generateText({
      model: instance,
      system: CLASSIFIER_PROMPT,
      messages: [
        { role: "user", content },
      ],
    });

    onSuccess();

    const parsed = JSON.parse(cleanJson(text)) as ClassifierOutput;

    if (parsed.result !== "diagnostic" && parsed.result !== "general") {
      return { result: "general", reasoning: "Failed to classify, defaulting to general" };
    }

    return parsed;
  } catch {
    onError();
    return { result: "general", reasoning: "Classification failed, defaulting to general" };
  }
}

function cleanJson(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) return match[1].trim();
  }
  return trimmed;
}
