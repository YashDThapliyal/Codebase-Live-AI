"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createCandidate, login, register } from "@/lib/api";
import { CLAI_CANDIDATE_ID } from "@/lib/sessionStorageKeys";
import { Button } from "@/components/shared/Button";

export function CandidateLoginForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onContinue = async () => {
    setError(null);
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError("Name, email, and password are required.");
      return;
    }
    setPending(true);
    try {
      if (mode === "register") {
        await register({ email: email.trim(), password: password.trim(), role: "candidate" });
      } else {
        await login({ email: email.trim(), password: password.trim() });
      }

      const c = await createCandidate({
        full_name: fullName.trim(),
        email: email.trim(),
        role_applied: "Applicant"
      });
      localStorage.setItem(CLAI_CANDIDATE_ID, c.id);
      router.push("/candidate/lobby");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not authenticate");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button type="button" onClick={() => setMode("login")} className={`rounded-md px-3 py-1 text-sm ${mode === "login" ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700"}`}>
          Login
        </button>
        <button type="button" onClick={() => setMode("register")} className={`rounded-md px-3 py-1 text-sm ${mode === "register" ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700"}`}>
          Register
        </button>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <input className="w-full rounded-md border border-slate-300 p-2 text-sm" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full rounded-md border border-slate-300 p-2 text-sm" placeholder="Password (min 8 chars)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input className="w-full rounded-md border border-slate-300 p-2 text-sm" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      <Button type="button" disabled={pending} onClick={() => void onContinue()}>
        {pending ? "Please wait..." : mode === "register" ? "Register and Continue" : "Login and Continue"}
      </Button>
    </div>
  );
}
