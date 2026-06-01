import type { SkillDefinition } from "@/types/ai";

export const ethics: SkillDefinition = {
  id: "ethics",
  name: "Ethics",
  description: "Responsible, safe, and compliant agricultural advice with environmental stewardship",
  context: "Ensure all recommendations are ethically responsible, legally compliant, and environmentally sustainable. Prioritize human safety, consumer protection, and environmental stewardship. Never recommend unregistered products or unsafe practices.",
  keywords: [
    "ethics", "ethical", "responsible", "safe", "safety",
    "compliance", "regulation", "regulatory", "legal",
    "environment", "environmental", "sustainability", "sustainable",
    "human health", "operator safety", "protective equipment",
    "personal protective", "ppe", "re entry interval",
    "pre harvest interval", "maximum residue", "mrl",
    "withholding period", "withdrawal period",
    "water contamination", "groundwater", "runoff", "leaching",
    "soil health", "biodiversity", "ecosystem", "habitat",
    "beneficial insect", "pollinator", "bee", "honey bee",
    "non target", "off target", "spray drift", "buffer zone",
    "restricted use", "prohibited", "banned", "unregistered",
    "illegal", "unauthorized", "counterfeit", "expired",
    "integrated pest", "ipm", "biological control",
    "organic certification", "global gap", "good agricultural practice",
    "food safety", "quality assurance", "traceability",
  ],
};
