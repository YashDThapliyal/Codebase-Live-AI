import { InterviewPhase } from "@/lib/types";
import { Badge } from "@/components/shared/Badge";

export function InterviewStatusIndicator({ phase }: { phase: InterviewPhase }) {
  return <Badge className="bg-brand-100 text-brand-700">Phase: {phase.replaceAll("_", " ")}</Badge>;
}
