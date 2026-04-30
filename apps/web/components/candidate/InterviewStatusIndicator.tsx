import { InterviewPhase } from "@/lib/types";
import { Badge } from "@/components/shared/Badge";

export function InterviewStatusIndicator({ phase }: { phase: InterviewPhase }) {
  return (
    <Badge variant="brand">
      {phase.replaceAll("_", " ")}
    </Badge>
  );
}
