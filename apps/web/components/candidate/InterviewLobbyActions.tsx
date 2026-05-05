"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { startInterview } from "@/lib/api";
import { CLAI_CANDIDATE_ID, CLAI_SESSION_ID } from "@/lib/sessionStorageKeys";
import { Button } from "@/components/shared/Button";

export function InterviewLobbyActions() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onStart = async () => {
    setError(null);
    const candidateId = typeof window !== "undefined" ? localStorage.getItem(CLAI_CANDIDATE_ID) : null;
    if (!candidateId) {
      setError("Create your profile on the login page first.");
      return;
    }
    setPending(true);
    try {
      const session = await startInterview({ candidate_id: candidateId });
      localStorage.setItem(CLAI_SESSION_ID, session.id);
      router.push("/candidate/interview");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start interview");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="mt-4 space-y-2">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="button" disabled={pending} onClick={() => void onStart()}>
        {pending ? "Starting…" : "Start Text Interview"}
      </Button>
    </div>
  );
}
