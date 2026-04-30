import { Card } from "@/components/shared/Card";
import { Badge } from "@/components/shared/Badge";

export function MicTestCard() {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">Microphone Test</h3>
        <Badge>Placeholder</Badge>
      </div>
      <p className="mt-2 text-sm text-slate-600">
        Voice interview support is planned for a later phase. For now, complete the interview in text mode.
      </p>
    </Card>
  );
}
