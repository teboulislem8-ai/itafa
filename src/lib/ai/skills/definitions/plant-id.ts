import type { SkillDefinition } from "@/types/ai";

export const plantId: SkillDefinition = {
  id: "plant-id",
  name: "Plant Identification",
  description: "Visual and descriptive identification of plants, weeds, and crops from images and descriptions",
  context: "Assist in identifying plant species, crop varieties, and weeds using morphological descriptions, growth habits, leaf shapes, flower structures, seed characteristics, and visual patterns described or shown by the user.",
  keywords: [
    "identify", "identification", "what plant", "what crop", "what weed",
    "species", "variety", "cultivar", "morphology", "leaf shape",
    "leaf margin", "leaf arrangement", "venation", "inflorescence",
    "flower color", "flower structure", "fruit type", "seed head",
    "growth habit", "determinate", "indeterminate", "bush", "vine",
    "grass", "sedge", "broadleaf", "monocot", "dicot", "annual",
    "perennial", "biennial", "weed id", "crop id", "variety id",
    "diagnostic key", "botanical key", "dichotomous key",
    "leaf blade", "petiole", "stipule", "node", "internode",
    "root system", "taproot", "fibrous", "tuber", "bulb", "rhizome",
  ],
};
