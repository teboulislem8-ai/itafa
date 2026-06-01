import type { SkillDefinition } from "@/types/ai";

export const fieldObservation: SkillDefinition = {
  id: "field-observation",
  name: "Field Observation",
  description: "Systematic field scouting, symptom recognition, and data collection methodology",
  context: "Guide systematic field observation including symptom pattern recognition, field scouting protocols, sampling strategies, damage assessment, and proper data collection methods for accurate diagnosis.",
  keywords: [
    "scouting", "field scouting", "field walk", "symptom", "lesion",
    "spot", "blight", "wilt", "dieback", "stunting", "chlorosis",
    "necrosis", "mosaic", "curling", "distortion", "galling",
    "canker", "rot", "damping off", "damping-off", "sign",
    "mycelium", "spore", "fruiting body", "pustule", "oozing",
    "gummosis", "exudate", "honeydew", "sooty mold",
    "distribution", "random pattern", "clustered", "edge effect",
    "row pattern", "wheel track", "irrigation pattern",
    "soil cracking", "waterlogging", "ponding", "compaction",
    "slope aspect", "wind direction", "shade pattern",
    "severity scale", "incidence", "prevalence",
  ],
};
