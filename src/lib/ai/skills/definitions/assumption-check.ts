import type { SkillDefinition } from "@/types/ai";

export const assumptionCheck: SkillDefinition = {
  id: "assumption-check",
  name: "Assumption Checking",
  description: "Guidance on verifying statistical assumptions: normality, homogeneity, sphericity",
  context: "Guide users through checking statistical assumptions before running tests. Normality: recommend Shapiro-Wilk test (best for n<50) or Kolmogorov-Smirnov (for larger samples). Also suggest visual checks: Q-Q plots, histograms. Homogeneity of variance: recommend Levene's test or Bartlett's test. If assumptions are violated, suggest transformations: log for right-skewed data, arcsine square root for percentages/proportions, square root for count data, reciprocal for rates. Alternatively, recommend non-parametric alternatives. For ANOVA with violations: note that ANOVA is robust with balanced designs and n>30. For sphericity in repeated measures: recommend Mauchly's test and Greenhouse-Geisser correction. For outliers: suggest Grubbs' test, IQR method, or visual inspection via box plots. Explain how to report assumption checks in publications.",
  keywords: [
    "normality", "shapiro wilk", "shapiro-wilk", "kolmogorov smirnov",
    "homogeneity", "levene", "bartlett", "variance",
    "sphericity", "mauchly",
    "qq plot", "q-q", "histogram", "residual",
    "transformation", "log", "arcsine", "square root", "reciprocal", "box cox",
    "outlier", "grubbs", "iqr", "box plot",
    "assumption", "robust", "violation",
    "balanced", "unbalanced", "unequal sample",
    "heteroscedasticity", "heteroskedasticity",
  ],
};
