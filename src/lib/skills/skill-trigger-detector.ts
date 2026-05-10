import type { SkillContext } from "./system-prompt-builder";

const PATTERNS: { context: SkillContext; patterns: RegExp[] }[] = [
  {
    context: "observation",
    patterns: [
      /symptom|feuill|leaf|leaves|jaun|yellow|tach|spot|maladie|disease|insect|ravageur|pest|photo|image|voir|see|look|observe|champignon|fungus|virus/i,
    ],
  },
  {
    context: "lab_data",
    patterns: [
      /pH|EC|SAR|analyse|lab|résultat|result|sol|soil|eau|water|test|rapport|report|mg|dS|mmhos|CEC|calcaire|carbonate|azote|phosphore|potassium/i,
    ],
  },
  {
    context: "constraint",
    patterns: [
      /pas de|n'ai pas|manque|broken|cassé|panne|urgent|vite|budget|argent|money|pas assez|limité|scarce|drought|sécheresse|pompe|pump|emergency|urgence/i,
    ],
  },
  {
    context: "decision",
    patterns: [
      /choisir|choose|option|ou bien|or|lequel|which|comparer|compare|meilleur|best|vaut mieux|should I|dois-je|décision/i,
    ],
  },
  {
    context: "planning",
    patterns: [
      /planifier|plan|saison|season|calendrier|calendar|organiser|organize|étapes|steps|programme|schedule|projet|project/i,
    ],
  },
  {
    context: "technology",
    patterns: [
      /drone|GPS|capteur|sensor|logiciel|software|application|app|satellite|NDVI|irrigation controller|automate|technologie|technology/i,
    ],
  },
  {
    context: "trial",
    patterns: [
      /essai|trial|expérience|experiment|traitement|treatment|témoin|control|répétition|replication|rendement|yield|résultat|statistique/i,
    ],
  },
];

export function detectSkillContext(message: string): SkillContext {
  for (const { context, patterns } of PATTERNS) {
    if (patterns.some((p) => p.test(message))) {
      return context;
    }
  }
  return "general";
}

export function detectLanguage(message: string): "ar" | "fr" {
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(message) ? "ar" : "fr";
}