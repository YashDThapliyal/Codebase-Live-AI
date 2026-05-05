"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createCandidate } from "@/lib/api";
import { CLAI_CANDIDATE_ID } from "@/lib/sessionStorageKeys";
import { Button } from "@/components/shared/Button";

export function CandidateLoginForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Software Engineer");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onContinue = async () => {
    setError(null);
    if (!fullName.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }
    setPending(true);
    try {
      const c = await createCandidate({
        full_name: fullName.trim(),
        email: email.trim(),
        role_applied: role.trim() || "Software Engineer"
      });
      localStorage.setItem(CLAI_CANDIDATE_ID, c.id);
      router.push("/candidate/lobby");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create profile");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-3">
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <input
        className="w-full rounded-lg border border-slate-300 p-2 text-sm"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full rounded-lg border border-slate-300 p-2 text-sm"
        placeholder="Full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <input
        className="w-full rounded-lg border border-slate-300 p-2 text-sm"
        placeholder="Role applied for"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <Button type="button" disabled={pending} onClick={() => void onContinue()}>
        {pending ? "Saving…" : "Continue"}
      </Button>
    </div>
  );
}
