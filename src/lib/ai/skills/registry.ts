import "server-only";
import type { SkillDefinition } from "@/types/ai";
import { deepAgronomy } from "./definitions/deep-agronomy";
import { localKnowledge } from "./definitions/local-knowledge";
import { plantId } from "./definitions/plant-id";
import { fieldObservation } from "./definitions/field-observation";
import { dataAnalysis } from "./definitions/data-analysis";
import { decisionMaking } from "./definitions/decision-making";
import { problemSolving } from "./definitions/problem-solving";
import { adaptability } from "./definitions/adaptability";
import { experimentalThinking } from "./definitions/experimental-thinking";
import { projectManagement } from "./definitions/project-management";
import { technologyUse } from "./definitions/technology-use";
import { communication } from "./definitions/communication";
import { ethics } from "./definitions/ethics";
import { continuousLearning } from "./definitions/continuous-learning";
import { expDesign } from "./definitions/exp-design";
import { statMethods } from "./definitions/stat-methods";
import { assumptionCheck } from "./definitions/assumption-check";
import { resultInterp } from "./definitions/result-interp";
import { dataViz } from "./definitions/data-viz";

export const SKILL_REGISTRY: SkillDefinition[] = [
  deepAgronomy,
  localKnowledge,
  plantId,
  fieldObservation,
  dataAnalysis,
  decisionMaking,
  problemSolving,
  adaptability,
  experimentalThinking,
  projectManagement,
  technologyUse,
  communication,
  ethics,
  continuousLearning,
  expDesign,
  statMethods,
  assumptionCheck,
  resultInterp,
  dataViz,
];

export function getSkillById(id: string): SkillDefinition | undefined {
  return SKILL_REGISTRY.find((s) => s.id === id);
}

export function getSkillsByIds(ids: string[]): SkillDefinition[] {
  return ids
    .map((id) => getSkillById(id))
    .filter((s): s is SkillDefinition => s !== undefined);
}
