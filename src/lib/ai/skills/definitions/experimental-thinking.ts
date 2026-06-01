import type { SkillDefinition } from "@/types/ai";

export const experimentalThinking: SkillDefinition = {
  id: "experimental-thinking",
  name: "Experimental Thinking",
  description: "On-farm trial design, observation-based learning, and evidence gathering methodology",
  context: "Guide agronomists in setting up on-farm trials, strip tests, and demonstration plots to evaluate new practices or products locally. Emphasize proper controls, replication, data collection, and interpretation of results.",
  keywords: [
    "trial", "experiment", "on farm trial", "strip trial",
    "demonstration plot", "demo plot", "test plot", "comparison",
    "control", "untreated check", "treatment comparison",
    "replication", "repeat", "block", "randomization",
    "statistical", "significance", "variability", "variance",
    "split field", "side by side", "a b test", "a/b test",
    "half field", "paired comparison", "observation",
    "observation based", "empirical", "local validation",
    "technology validation", "variety trial", "rate trial",
    "timing trial", "method comparison", "farmer practice",
    "standard practice", "innovative practice", "new technique",
    "data collection", "record keeping", "field notes",
    "photo documentation", "time series", "baseline",
    "before after", "with without", "pilot", "scaling",
  ],
};
