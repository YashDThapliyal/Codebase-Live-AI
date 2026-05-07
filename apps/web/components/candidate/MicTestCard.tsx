import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";

export function MicTestCard() {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Microphone Test</h3>
        <Badge>Quick Check</Badge>
      </div>
      <p className="mt-2 text-sm text-slate-600">
        Allow microphone access in your browser before starting voice interview.
      </p>
    </Card>
  );
}
