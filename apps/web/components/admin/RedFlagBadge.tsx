import { Badge } from "@/components/shared/Badge";
import { RedFlag } from "@/lib/types";

const severityMap: Record<RedFlag["severity"], string> = {
  low: "bg-amber-100 text-amber-700",
  medium: "bg-orange-100 text-orange-700",
  high: "bg-red-100 text-red-700"
};

export function RedFlagBadge({ redFlag }: { redFlag: RedFlag }) {
  return <Badge className={severityMap[redFlag.severity]}>{redFlag.label}</Badge>;
}
