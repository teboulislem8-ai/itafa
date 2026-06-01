import type { SkillDefinition } from "@/types/ai";

export const expDesign: SkillDefinition = {
  id: "exp-design",
  name: "Experimental Design",
  description: "Consultation on agricultural experimental design: CRD, RCBD, Split-Plot, Factorial",
  context: "Guide the user in selecting appropriate experimental designs for agricultural trials. Cover Completely Randomized Design (CRD) for controlled environments, Randomized Complete Block Design (RCBD) for field trials with spatial gradients, Split-Plot when one factor needs larger plots (irrigation, tillage) and another uses sub-plots (varieties, fertilization), and Factorial designs for multi-factor interactions. Ask about number of treatments, replications, blocking factors, response variables, and environmental constraints. Explain the trade-offs between precision, cost, and practical feasibility. Mention pseudoreplication risks and how to avoid them.",
  keywords: [
    "crd", "rcbd", "split plot", "split-plot", "factorial", "block", "blocking",
    "replication", "replicate", "treatment", "experimental design", "design",
    "plot", "sub-plot", "main plot", "randomization", "layout",
    "field trial", "greenhouse", "growth chamber", "pot experiment",
    "pseudoreplication", "pseudo replication", "spatial variation",
    "gradient", "soil heterogeneity", "genotype", "gxe", "interaction",
    "random effect", "fixed effect", "nested design", "hierarchical",
  ],
};
