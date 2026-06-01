import type { SkillDefinition } from "@/types/ai";

export const dataViz: SkillDefinition = {
  id: "data-viz",
  name: "Data Visualization",
  description: "Suggestions for publication-ready agricultural data visualizations",
  context: "Suggest appropriate visualizations based on the user's data type and analysis. For treatment comparisons: bar chart with standard error bars and significance letters (Tukey grouping). For distributions: box plots or violin plots showing median, IQR, and outliers. For relationships: scatter plots with regression line and confidence band, correlation heatmaps. For multivariate: PCA biplot (samples as points, variables as vectors), cluster dendrogram, correlation circle. For spatial: heatmap or contour plot of field variability, kriging interpolation maps. For time series: line plots with error envelopes. For frequency data: stacked bar charts or mosaic plots. For G×E interaction: interaction plot (parallel lines = no interaction, crossing lines = strong interaction). Emphasize publication-ready formatting: appropriate resolution, readable fonts, colorblind-friendly palettes, clear axis labels, caption guidance.",
  keywords: [
    "visualization", "visualisation", "graph", "chart", "plot", "figure",
    "bar chart", "barplot", "bar plot",
    "box plot", "boxplot", "violin plot",
    "scatter plot", "scatterplot", "regression line",
    "heatmap", "heat map", "contour",
    "biplot", "pca plot", "correlation circle",
    "dendrogram", "cluster plot",
    "interaction plot", "simple effects",
    "line plot", "time series",
    "error bar", "standard error", "confidence band",
    "publication", "publication ready", "figure", "caption",
    "colorblind", "palette", "resolution", "dpi",
    "stacked bar", "mosaic", "frequency",
  ],
};
