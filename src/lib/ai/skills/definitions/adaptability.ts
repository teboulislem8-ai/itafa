import type { SkillDefinition } from "@/types/ai";

export const adaptability: SkillDefinition = {
  id: "adaptability",
  name: "Adaptability",
  description: "Tailoring recommendations to changing conditions, resource constraints, and farmer needs",
  context: "Adapt recommendations based on variable conditions including resource limitations, climate variability, market access, labor availability, and infrastructure constraints. Provide tiered options from minimal to optimal intervention levels.",
  keywords: [
    "adapt", "adaptation", "flexible", "tiered option", "alternative",
    "low input", "high input", "resource limited", "constraint",
    "budget", "cost saving", "affordable", "labor shortage",
    "mechanization", "manual option", "equipment available",
    "smallholder", "large scale", "intensive", "extensive",
    "subsistence", "commercial", "market oriented",
    "climate adaptation", "climate resilient", "heat stress",
    "drought", "excess rain", "early season", "late season",
    "delayed planting", "missed window", "catch crop",
    "emergency measure", "contingency plan", "backup option",
    "short term", "long term", "transition strategy",
    "no till", "conservation agriculture", "reduced tillage",
    "rainfed", "supplemental irrigation", "deficit irrigation",
  ],
};
