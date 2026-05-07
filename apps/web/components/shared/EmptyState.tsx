import { Card } from "./Card";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
    </Card>
  );
}
