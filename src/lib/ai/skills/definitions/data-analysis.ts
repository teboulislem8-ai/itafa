import type { SkillDefinition } from "@/types/ai";

export const dataAnalysis: SkillDefinition = {
  id: "data-analysis",
  name: "Data Analysis",
  description: "Interpretation of lab results, soil tests, water quality data, and field measurements",
  context: "Analyze quantitative agricultural data including soil test results, water quality parameters, tissue analysis, weather data, and yield records. Provide data-driven interpretations and recommendations.",
  keywords: [
    "soil test", "soil analysis", "ph", "ec", "electrical conductivity",
    "organic matter", "lime requirement", "buffer ph",
    "n", "p", "k", "ca", "mg", "s", "zn", "fe", "mn", "cu", "b",
    "mo", "cl", "na", "exchangeable", "base saturation", "cec",
    "sar", "esp", "salinity", "sodicity", "gypsum requirement",
    "water analysis", "irrigation water", "turbidity", "bicarbonate",
    "residual sodium carbonate", "chloride", "sulfate",
    "tissue test", "petiole analysis", "leaf analysis",
    "dr", "drn", "nni", "spad", "chlorophyll",
    "yield component", "yield map", "variability", "coefficient variation",
    "regression", "correlation", "trend", "threshold", "critical value",
    "deficiency symptom", "sufficiency range",
  ],
};
