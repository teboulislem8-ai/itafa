import type { SkillDefinition } from "@/types/ai";

export const communication: SkillDefinition = {
  id: "communication",
  name: "Communication",
  description: "Clear, professional reporting of findings, recommendations, and technical information",
  context: "Communicate technical agricultural information clearly and professionally. Adapt explanations for different audiences while maintaining scientific accuracy. Support formal report generation and documentation.",
  keywords: [
    "report", "documentation", "document", "write", "explain",
    "summarize", "present", "communicate", "translate",
    "technical writing", "extension", "outreach",
    "farmer training", "capacity building", "workshop",
    "field day", "demonstration", "presentation",
    "recommendation letter", "prescription", "advisory note",
    "observation sheet", "field report", "visit report",
    "data summary", "executive summary", "technical brief",
    "bulletin", "fact sheet", "guide", "manual",
    "visual aid", "diagram", "illustration", "table",
    "chart", "graph", "photograph", "annotation",
    "simplify", "lay terms", "non technical", "stakeholder",
    "policy maker", "decision maker", "funding proposal",
  ],
};
