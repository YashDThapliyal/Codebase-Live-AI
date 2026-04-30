import Link from "next/link";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/shared/Button";

export function InterviewLobby() {
  return (
    <Card>
      <h3 className="text-base font-semibold">Interview Lobby</h3>
      <p className="mt-2 text-sm text-slate-600">
        You will complete a guided AI interview. Keep answers clear and concrete with project examples where possible.
      </p>
      <div className="mt-4">
        <Link href="/candidate/interview">
          <Button>Start Text Interview</Button>
        </Link>
      </div>
    </Card>
  );
}
