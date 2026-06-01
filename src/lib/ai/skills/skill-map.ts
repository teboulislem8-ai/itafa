import "server-only";
import type { SkillDefinition, SkillSelectionInput } from "@/types/ai";
import { SKILL_REGISTRY } from "./registry";

const MODE_DEFAULTS: Record<string, string[]> = {
  plant: ["deep-agronomy", "plant-id", "field-observation", "decision-making"],
  pest: ["field-observation", "decision-making", "ethics", "data-analysis"],
  soil: ["deep-agronomy", "data-analysis", "decision-making", "local-knowledge"],
  analytics: ["stat-methods", "exp-design", "result-interp", "data-viz"],
};

const MAX_SKILLS = 4;

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-zA-Z\u0600-\u06FF]+/g)
    .filter(Boolean);
}

export function selectSkills(input: SkillSelectionInput): SkillDefinition[] {
  const defaults = MODE_DEFAULTS[input.mode] ?? MODE_DEFAULTS.plant;
  const tokens = tokenize(input.content);

  const scored = SKILL_REGISTRY.map((skill) => {
    const keywordMatchCount = skill.keywords.filter(
      (kw) => tokens.some((token) => token.includes(kw) || kw.includes(token)),
    ).length;

    const isDefault = defaults.includes(skill.id);

    return {
      skill,
      score: keywordMatchCount * 2 + (isDefault ? 3 : 0),
    };
  });

  scored.sort((a, b) => b.score - a.score);

  const selected = scored.slice(0, MAX_SKILLS).map((s) => s.skill);

  if (selected.length === 0) {
    return defaults.map((id) => SKILL_REGISTRY.find((s) => s.id === id)!);
  }

  return selected;
}
