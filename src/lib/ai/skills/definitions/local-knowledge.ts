import type { SkillDefinition } from "@/types/ai";

export const localKnowledge: SkillDefinition = {
  id: "local-knowledge",
  name: "Local Knowledge",
  description: "Algerian agricultural context, regional practices, and locally relevant solutions",
  context: "Apply knowledge specific to Algerian agriculture including local varieties, regional pest pressures, soil types common in each wilaya, traditional farming practices, and locally available inputs and treatments.",
  keywords: [
    "algeria", "algerian", "wilaya", "sahara", "tell", "atlas",
    "mediterranean", "steppe", "oasis", "high plains", "constantinois",
    "kabylie", "annaba", "oran", "algiers", "constantine", "biskra",
    "ouargla", "ghardaia", "el oued", "adrar", "tlemcen", "setif",
    "bled", "fellah", "agriculture algerienne", "maraichage",
    "arboriculture", "oleiculture", "cerealiculture", "phoeniciculture",
    "date palm", "deglet nour", "orange", "morange", "clementine",
    "olive", "chemlal", "sigoise", "hard wheat", "durum", "couscous",
    "barley", "chickpea", "lentil", "broad bean", "tomato", "potato",
    "watermelon", "melon", "prickly pear", "fig", "pomegranate",
    "grape", "citrus", "apple", "peach", "plum", "apricot",
    "local practice", "traditional method", "adaptive practice",
  ],
};
