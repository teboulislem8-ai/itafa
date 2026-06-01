import type { SkillDefinition } from "@/types/ai";

export const problemSolving: SkillDefinition = {
  id: "problem-solving",
  name: "Problem Solving",
  description: "Diagnostic reasoning, root cause analysis, and troubleshooting complex agricultural problems",
  context: "Apply systematic diagnostic reasoning to complex or ambiguous agricultural problems. Use differential diagnosis, root cause analysis, and iterative troubleshooting to identify issues when the presentation is unclear or multiple factors interact.",
  keywords: [
    "problem", "issue", "troubleshoot", "diagnosis", "unknown cause",
    "differential", "differential diagnosis", "rule out", "eliminate",
    "unusual symptom", "atypical", "complex case", "multiple factors",
    "interaction", "synergistic", "additive", "confounding",
    "root cause", "predispose", "trigger", "contributing factor",
    "abiotic", "biotic", "complex", "syndrome", "decline",
    "sudden death", "rapid decline", "progressive", "chronic",
    "recurring problem", "seasonal pattern", "historical issue",
    "site history", "previous crop", "chemical history",
    "herbicide carryover", "residual effect",
  ],
};
