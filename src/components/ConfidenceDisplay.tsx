import { Badge } from "@/components/ui";
import type { ConfidenceData } from "@/types/database";

interface ConfidenceDisplayProps {
  confidence: ConfidenceData;
}

function getLevel(score: number): "high" | "medium" | "low" {
  if (score >= 0.8) return "high";
  if (score >= 0.5) return "medium";
  return "low";
}

const LEVEL_COLORS: Record<string, "success" | "warning" | "danger"> = {
  high: "success",
  medium: "warning",
  low: "danger",
};

export function ConfidenceDisplay({ confidence }: ConfidenceDisplayProps) {
  const level = getLevel(confidence.score);
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500">Confidence</span>
      <Badge variant={LEVEL_COLORS[level] ?? "default"}>
        {level}
      </Badge>
      <span className="text-xs text-gray-400">
        (score: {confidence.score.toFixed(2)})
      </span>
    </div>
  );
}
