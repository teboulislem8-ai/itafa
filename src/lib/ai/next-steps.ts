import type { NextStep } from "@/types/ai";

const NEXT_STEPS_REGEX = /---NEXT_STEPS---\s*(\[[\s\S]*?\])\s*---END---/;

export function parseNextSteps(text: string): {
  nextSteps: NextStep[];
  cleaned: string;
} {
  const match = text.match(NEXT_STEPS_REGEX);
  if (!match) return { nextSteps: [], cleaned: text };

  try {
    const nextSteps: NextStep[] = JSON.parse(match[1]);
    const cleaned = text.replace(match[0], "").trim();
    return { nextSteps, cleaned };
  } catch {
    return { nextSteps: [], cleaned: text };
  }
}
