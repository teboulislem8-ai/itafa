import type { SkillDefinition } from "@/types/ai";

export const decisionMaking: SkillDefinition = {
  id: "decision-making",
  name: "Decision Making",
  description: "Evidence-based treatment recommendations and integrated management strategies",
  context: "Provide balanced, evidence-based recommendations weighing efficacy, cost, environmental impact, and regulatory compliance. Consider integrated approaches combining cultural, biological, and chemical controls.",
  keywords: [
    "treatment", "control", "management", "strategy", "recommendation",
    "threshold", "economic threshold", "action threshold", "eti",
    "integrated management", "ipm", "icm", "decision support",
    "cost benefit", "cost-benefit", "roi", "economic analysis",
    "risk assessment", "risk factor", "predisposing factor",
    "prevention", "prophylactic", "curative", "eradicant",
    "protectant", "systemic", "contact", "translaminar",
    "rotation strategy", "resistance management", "mode of action",
    "frag", "funga resistance", "insecticide resistance",
    "selectivity", "non-target", "beneficial", "pollinator safety",
    "pre harvest interval", "phi", "re-entry interval", "rei",
    "withholding period", "maximum residue limit",
    "organic option", "biological control", "biopesticide",
    "pheromone trap", "mass trapping", "mating disruption",
  ],
};
