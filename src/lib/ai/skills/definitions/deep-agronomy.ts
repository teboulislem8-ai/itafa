import type { SkillDefinition } from "@/types/ai";

export const deepAgronomy: SkillDefinition = {
  id: "deep-agronomy",
  name: "Deep Agronomy",
  description: "Core agronomic science knowledge for crop physiology, soil science, and plant nutrition",
  context: "Provide detailed agronomic explanations including physiological mechanisms, nutrient cycles, soil-plant interactions, and crop growth stages relevant to Algerian growing conditions.",
  keywords: [
    "nutrient", "nitrogen", "phosphorus", "potassium", "fertilizer", "soil ph",
    "crop rotation", "physiology", "photosynthesis", "growth stage",
    "phenology", "growing degree days", "thermal time", "seed rate",
    "plant population", "irrigation scheduling", "water requirement",
    "evapotranspiration", "salinization", "soil texture", "organic matter",
    "cation exchange", "micro nutrient", "deficiency", "toxicity",
    "symbiosis", "mycorrhiza", "rhizobium", "legume", "cover crop",
    "intercropping", "companion planting", "biomass", "yield potential",
  ],
};
