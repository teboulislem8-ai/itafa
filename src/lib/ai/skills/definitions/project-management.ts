import type { SkillDefinition } from "@/types/ai";

export const projectManagement: SkillDefinition = {
  id: "project-management",
  name: "Project Management",
  description: "Planning, scheduling, and tracking agricultural operations and interventions",
  context: "Assist with crop planning, operation scheduling, task management, and resource allocation throughout the growing season. Provide structured timelines and checklists for agricultural activities.",
  keywords: [
    "plan", "planning", "schedule", "calendar", "timeline",
    "gantt", "milestone", "deadline", "task list", "checklist",
    "operational plan", "crop plan", "production plan",
    "seasonal planning", "pre planting", "post harvest",
    "rotation plan", "succession planting", "continuous production",
    "resource allocation", "input planning", "seed requirement",
    "fertilizer calculation", "chemical requirement", "labor plan",
    "equipment", "machinery", "tractor hour", "spray schedule",
    "irrigation rotation", "fertigation schedule",
    "monitoring schedule", "scouting frequency",
    "harvest planning", "storage plan", "marketing plan",
    "budget", "cost estimation", "profitability", "break even",
    "record keeping", "farm diary", "activity log",
  ],
};
