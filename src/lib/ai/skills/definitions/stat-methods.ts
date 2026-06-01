import type { SkillDefinition } from "@/types/ai";

export const statMethods: SkillDefinition = {
  id: "stat-methods",
  name: "Statistical Methods",
  description: "Recommendation of appropriate statistical tests for agronomic data",
  context: "Recommend appropriate statistical tests based on the user's experimental design, data type, and research question. For comparing two groups: t-test (parametric) or Mann-Whitney U (non-parametric). For two or more groups: one-way ANOVA or Kruskal-Wallis. For multi-factor: two-way or multi-factorial ANOVA. For repeated measures: repeated measures ANOVA or mixed models. For relationships: Pearson/Spearman correlation, linear/non-linear regression, multiple regression. For categorical outcomes: Chi-square, logistic regression, GLM. For threshold estimation: Probit/Logit analysis (LC50, EC50, GR50). For multivariate: PCA, Cluster Analysis, Factor Analysis. For spatial: Geostatistics, Kriging. Explain why each test is appropriate given their specific data structure.",
  keywords: [
    "anova", "manova", "ancova", "t test", "t-test", "student",
    "mann whitney", "kruskal wallis",
    "tukey", "hsd", "duncan", "dmrt", "lsd", "bonferroni",
    "post hoc", "post-hoc", "mean separation", "multiple comparison",
    "parametric", "non parametric", "non-parametric",
    "pearson", "spearman", "correlation",
    "regression", "linear", "non linear", "nonlinear", "logistic",
    "probit", "logit", "lc50", "ec50", "gr50", "lethal", "effective concentration",
    "pca", "principal component", "cluster", "dendrogram", "factor analysis",
    "geostatistics", "kriging", "spatial",
    "chi square", "chi-squared", "frequency", "categorical",
    "repeated measures", "longitudinal", "time series",
    "mixed model", "random effect", "glm", "generalized linear",
  ],
};
