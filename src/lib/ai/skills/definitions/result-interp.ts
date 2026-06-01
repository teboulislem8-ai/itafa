import type { SkillDefinition } from "@/types/ai";

export const resultInterp: SkillDefinition = {
  id: "result-interp",
  name: "Result Interpretation",
  description: "Interpretation of statistical output in agronomic context",
  context: "Help users interpret statistical results in meaningful agronomic terms. Explain p-values in context: a significant F-test (p<0.05) tells us at least one treatment differs, but post-hoc tests reveal which. Explain interaction effects (G×E): when significant, analyze simple effects rather than main effects. Guide on effect size: partial eta-squared, Cohen's d, or R-squared for regression. Explain biological vs statistical significance: a result can be statistically significant but biologically trivial. For PCA: explain eigenvalue >1 rule, scree plot interpretation, loading values, and how to name principal components based on traits that load highly. For cluster analysis: explain how to interpret dendrograms, choose cut-off height, and characterize clusters by their trait profiles. For regression: explain R-squared, significance of predictors, and how to check for multicollinearity (VIF).",
  keywords: [
    "interpret", "interpretation", "significant", "p value", "p-value",
    "f test", "f-test", "f value",
    "effect size", "eta squared", "cohen", "r squared", "r-squared",
    "interaction", "gxe", "genotype environment", "simple effect", "main effect",
    "biological significance", "practical significance",
    "eigenvalue", "scree plot", "loading", "biplot",
    "dendrogram", "cluster", "cut off", "centroid", "distance",
    "multicollinearity", "vif", "variance inflation",
    "post hoc", "post-hoc", "letter", "grouping", "homogeneous subset",
    "standard error", "se", "standard deviation", "sd", "confidence interval", "ci",
  ],
};
