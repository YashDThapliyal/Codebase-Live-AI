"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { createRealtimeSession, pushRealtimeDebugLog } from "@/lib/api";
import { AIOrb, type OrbState } from "@/components/shared/AIOrb";
import { TextInterview } from "./TextInterview";

type VoiceState = "idle" | "connecting" | "live" | "error" | "ended";
type ActivityState = "Listening" | "AI Speaking" | "Thinking";

type EventItem = {
  id: string;
  role: "system" | "assistant" | "user" | "error";
  text: string;
  time: string;
  raw?: string;
};

type ConversationItem = {
  id: string;
  speaker: "ai" | "candidate";
  text: string;
  time: string;
};

function getEphemeralKey(session: unknown): string | null {
  if (!session || typeof session !== "object") return null;
  const s = session as Record<string, unknown>;
  const cs = s.client_secret;
  if (typeof cs === "string") return cs;
  if (cs && typeof cs === "object") {
    const cso = cs as Record<string, unknown>;
    if (typeof cso.value === "string") return cso.value;
  }
  if (typeof s.value === "string") return s.value;
  if (s.secret && typeof s.secret === "object") {
    const sec = s.secret as Record<string, unknown>;
    if (typeof sec.value === "string") return sec.value;
  }
  return null;
}

function getRealtimeModel(session: unknown): string {
  if (session && typeof session === "object") {
    const s = session as Record<string, unknown>;
    if (typeof s.model === "string") return s.model;
    if (s.session && typeof s.session === "object") {
      const ss = s.session as Record<string, unknown>;
      if (typeof ss.model === "string") return ss.model;
    }
  }
  return process.env.NEXT_PUBLIC_OPENAI_REALTIME_MODEL || "gpt-4o-realtime-preview";
}

function voiceStateToOrbState(vs: VoiceState, as_: ActivityState): OrbState {
  if (vs === "connecting") return "connecting";
  if (vs === "ended" || vs === "error") return "ended";
  if (vs === "live") {
    if (as_ === "Listening") return "listening";
    if (as_ === "AI Speaking") return "speaking";
    return "thinking";
  }
  return "idle";
}

const statusColors: Record<VoiceState, string> = {
  idle: "bg-white/10 text-white/50 border-white/10",
  connecting: "bg-amber-400/15 text-amber-300 border-amber-400/25",
  live: "bg-emerald-400/15 text-emerald-300 border-emerald-400/25",
  error: "bg-red-400/15 text-red-300 border-red-400/25",
  ended: "bg-white/10 text-white/40 border-white/10"
};

const LANGUAGE_OPTIONS = ["English", "Spanish", "Hindi", "French", "German", "Portuguese", "Arabic", "Mandarin"];

const statusLabels: Record<VoiceState, string> = {
  idle: "Ready",
  connecting: "Connecting...",
  live: "Live",
  error: "Error",
  ended: "Ended"
};

export function VoiceInterview() {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [activityState, setActivityState] = useState<ActivityState>("Thinking");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [conversation, setConversation] = useState<ConversationItem[]>([]);
  const [fallbackMessage, setFallbackMessage] = useState<string>("");
  const [showTextFallback, setShowTextFallback] = useState(false);
  const [activeTab, setActiveTab] = useState<"conversation" | "debug">("conversation");
  const [preferredLanguage, setPreferredLanguage] = useState("English");
  const conversationEndRef = useRef<HTMLDivElement | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);

  const canStart = useMemo(
    () => voiceState === "idle" || voiceState === "error" || voiceState === "ended",
    [voiceState]
  );

  const orbState = voiceStateToOrbState(voiceState, activityState);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const pushEvent = (role: EventItem["role"], text: string, raw?: string) => {
    setEvents((prev) => [
      ...prev,
      {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        role,
        text,
        raw,
        time: new Date().toLocaleTimeString()
      }
    ]);
  };

  const pushConversation = (speaker: "ai" | "candidate", text: string) => {
    if (!text || text.trim().length < 3) return;
    setConversation((prev) => [
      ...prev,
      {
        id: `conv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        speaker,
        text: text.trim(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  };

  const teardown = () => {
    dcRef.current?.close();
    dcRef.current = null;
    if (pcRef.current) {
      pcRef.current.getSenders().forEach((s) => s.track?.stop());
      pcRef.current.close();
      pcRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
  };

  const endInterview = () => {
    teardown();
    setVoiceState("ended");
    setActivityState("Thinking");
    pushEvent("system", "Voice interview ended.");
  };

  const pushAndShipDebug = async (text: string, raw?: string) => {
    pushEvent("error", text, raw);
    await pushRealtimeDebugLog({
      source: "voice-interview-ui",
      message: text,
      raw,
      voiceState,
      activityState,
      ts: new Date().toISOString()
    });
  };

  const startInterview = async () => {
    setFallbackMessage("");
    setVoiceState("connecting");
    setActivityState("Thinking");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        video: false
      });
      localStreamRef.current = stream;

      pushEvent("system", `Requested interview language: ${preferredLanguage}`);
      const session = await createRealtimeSession(preferredLanguage);
      const ephemeralKey = getEphemeralKey(session);
      if (!ephemeralKey) throw new Error("Realtime session did not include a client secret");

      const model = getRealtimeModel(session);
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      const remoteAudio = new Audio();
      remoteAudio.autoplay = true;
      remoteAudioRef.current = remoteAudio;

      pc.ontrack = (event) => {
        remoteAudio.srcObject = event.streams[0];
        setActivityState("AI Speaking");
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "connected") {
          setVoiceState("live");
          setActivityState("Listening");
          pushEvent("system", "Voice connection is live.");
        }
        if (["failed", "disconnected", "closed"].includes(pc.connectionState)) {
          if (pc.connectionState !== "closed") {
            setVoiceState("error");
            setFallbackMessage("Voice interview is unavailable. Use text fallback below.");
            setShowTextFallback(true);
          }
        }
      };

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;

      dc.onopen = () => {
        pushEvent("system", "Realtime event channel opened.");
        try {
          dc.send(JSON.stringify({
            type: "response.create",
            response: { instructions: `Respond only in ${preferredLanguage}. Greet the candidate briefly and ask the first interview question in one sentence.` }
          }));
          setActivityState("Thinking");
        } catch {
          pushEvent("system", "Could not request initial greeting. Speak to begin.");
        }
      };

      dc.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data as string) as Record<string, unknown>;
          const eventType = (data?.type as string) || "event";

          if (eventType.includes("speech_started")) setActivityState("Listening");
          if (eventType.includes("response.audio") || eventType.includes("response.output_audio"))
            setActivityState("AI Speaking");
          if (eventType.includes("response.created") || eventType.includes("response.output_text"))
            setActivityState("Thinking");

          if (eventType === "error") {
            const errMsg = (data?.error as Record<string, string>)?.message || "Unknown realtime error";
            await pushAndShipDebug(`Realtime error: ${errMsg}`, JSON.stringify(data));
            return;
          }

          // Extract clean conversation text for the readable transcript
          const transcript = data?.transcript as string;
          const delta = data?.delta as string;
          const text = (data?.text as string) || "";

          if (eventType === "conversation.item.input_audio_transcription.completed" && transcript) {
            pushConversation("candidate", transcript);
          } else if (
            (eventType === "response.audio_transcript.done" || eventType === "response.text.done") &&
            transcript
          ) {
            pushConversation("ai", transcript);
          } else if (eventType === "response.output_text.done" && text) {
            pushConversation("ai", text);
          }

          // Always log to debug
          const debugText = transcript || delta || text || JSON.stringify(data).slice(0, 180);
          const role: EventItem["role"] = eventType.includes("input")
            ? "user"
            : eventType.includes("response")
            ? "assistant"
            : "system";
          pushEvent(role, `${eventType}: ${debugText}`);
        } catch {
          pushEvent("system", `event: ${String(event.data).slice(0, 180)}`);
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      let sdpRes: Response;
      try {
        sdpRes = await fetch("https://api.openai.com/v1/realtime/calls", {
          method: "POST",
          body: offer.sdp,
          headers: { Authorization: `Bearer ${ephemeralKey}`, "Content-Type": "application/sdp" }
        });
      } catch (directError) {
        await pushAndShipDebug("Direct fetch failed. Using backend relay.", String(directError));
        sdpRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/realtime/call`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sdp: offer.sdp, model })
        });
      }

      if (!sdpRes.ok) {
        const detail = await sdpRes.text().catch(() => "");
        const message = `SDP exchange failed: ${sdpRes.status} ${detail}`;
        await pushAndShipDebug(message, detail);
        throw new Error(message);
      }

      const answerSdp = await sdpRes.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });
      pushEvent("system", `Connected (${model}). Waiting for audio.`);
    } catch (error) {
      teardown();
      setVoiceState("error");
      setActivityState("Thinking");
      setFallbackMessage("Voice interview is unavailable. Use text fallback below.");
      setShowTextFallback(true);
      void pushAndShipDebug(`Voice start failed: ${error instanceof Error ? error.message : "unknown error"}`);
    }
  };

  const copyDebugReport = async () => {
    const report = events
      .map((e) => `[${e.time}] ${e.role.toUpperCase()} ${e.text}${e.raw ? `\nRAW: ${e.raw}` : ""}`)
      .join("\n\n");
    await navigator.clipboard.writeText(report || "No events captured.");
  };

  useEffect(() => { return () => teardown(); }, []);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">

      {/* Status bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
            statusColors[voiceState]
          )}>
            {voiceState === "live" && (
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
            {statusLabels[voiceState]}
          </span>
          {voiceState === "live" && (
            <span className="text-xs text-white/35">{activityState}</span>
          )}
        </div>
        <Link
          href="/candidate/complete"
          className="text-xs font-medium text-white/30 transition hover:text-white/60"
        >
          End session →
        </Link>
      </div>

      {/* Orb panel — full width, centered, tall */}
      <div className="flex flex-col items-center rounded-3xl border border-white/[0.07] bg-white/[0.03] px-8 py-14">
        <AIOrb state={orbState} size="lg" />

        {voiceState === "idle" && (
          <p className="mt-6 text-center text-sm text-white/30">
            Click below to start your voice interview
          </p>
        )}
        {voiceState === "live" && (
          <p className="mt-4 text-center text-xs text-white/25">
            Speak naturally — pause briefly after finishing a thought
          </p>
        )}
        {voiceState === "ended" && (
          <p className="mt-4 text-center text-sm text-white/40">
            Interview complete. You can review the conversation below.
          </p>
        )}

        {fallbackMessage && (
          <div className="mt-5 w-full max-w-xs rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-center">
            <p className="text-sm text-amber-300">{fallbackMessage}</p>
          </div>
        )}

        <div className="mt-6 flex w-full max-w-sm flex-col gap-2">
          <label className="text-xs font-medium text-white/45">Preferred Interview Language</label>
          <select
            value={preferredLanguage}
            onChange={(e) => setPreferredLanguage(e.target.value)}
            className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/80 outline-none focus:border-brand-500"
          >
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang} value={lang} className="bg-slate-900 text-white">
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Controls */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          {canStart && (
            <button
              onClick={startInterview}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 active:scale-[0.98]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              Start Voice Interview
            </button>
          )}
          {voiceState === "live" && (
            <button
              onClick={endInterview}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/10 active:scale-[0.98]"
            >
              End Interview
            </button>
          )}
          <button
            onClick={() => setShowTextFallback((v) => !v)}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-white/40 transition hover:bg-white/5 hover:text-white/60"
          >
            {showTextFallback ? "Hide Text Fallback" : "Use Text Fallback"}
          </button>
        </div>
      </div>

      {/* Transcript panel */}
      <div className="rounded-3xl border border-white/[0.07] bg-white/[0.03] overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center gap-0 border-b border-white/[0.07] px-1 pt-1">
          <button
            onClick={() => setActiveTab("conversation")}
            className={cn(
              "px-4 py-2.5 text-xs font-semibold transition rounded-t-lg",
              activeTab === "conversation"
                ? "bg-white/[0.06] text-white/80"
                : "text-white/30 hover:text-white/60"
            )}
          >
            Conversation
            {conversation.length > 0 && (
              <span className="ml-2 rounded-full bg-brand-600/60 px-1.5 py-0.5 text-[10px] text-white/70">
                {conversation.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("debug")}
            className={cn(
              "px-4 py-2.5 text-xs font-semibold transition rounded-t-lg",
              activeTab === "debug"
                ? "bg-white/[0.06] text-white/80"
                : "text-white/30 hover:text-white/60"
            )}
          >
            Debug log
            {events.length > 0 && (
              <span className="ml-2 rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] text-white/40">
                {events.length}
              </span>
            )}
          </button>
          <div className="ml-auto pr-3">
            <button
              onClick={copyDebugReport}
              className="text-[11px] text-white/20 transition hover:text-white/50"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Conversation tab */}
        {activeTab === "conversation" && (
          <div className="max-h-72 overflow-y-auto p-5">
            {conversation.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <svg className="h-8 w-8 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-xs text-white/25">
                  {voiceState === "idle"
                    ? "Start the interview — your conversation will appear here"
                    : voiceState === "connecting"
                    ? "Connecting..."
                    : "Speak to begin — transcribed speech will appear here"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {conversation.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex gap-3",
                      item.speaker === "candidate" && "flex-row-reverse"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold mt-0.5",
                        item.speaker === "ai"
                          ? "bg-brand-600/50 text-brand-200"
                          : "bg-white/15 text-white/60"
                      )}
                    >
                      {item.speaker === "ai" ? "AI" : "U"}
                    </div>
                    <div className={cn("max-w-[80%]", item.speaker === "candidate" && "items-end flex flex-col")}>
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                          item.speaker === "ai"
                            ? "bg-white/[0.07] text-white/80 rounded-tl-sm"
                            : "bg-brand-600/25 text-white/75 rounded-tr-sm"
                        )}
                      >
                        {item.text}
                      </div>
                      <p className="mt-1 text-[10px] text-white/20 px-1">{item.time}</p>
                    </div>
                  </div>
                ))}
                <div ref={conversationEndRef} />
              </div>
            )}
          </div>
        )}

        {/* Debug tab */}
        {activeTab === "debug" && (
          <div className="max-h-72 overflow-y-auto p-4">
            {events.length === 0 ? (
              <p className="py-6 text-center text-xs text-white/25">No events yet.</p>
            ) : (
              <div className="space-y-1.5">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "rounded-lg px-3 py-1.5",
                      event.role === "error" ? "bg-red-400/10" : "bg-white/[0.03]"
                    )}
                  >
                    <span className={cn(
                      "text-[10px] font-mono",
                      event.role === "error" ? "text-red-400/70" :
                      event.role === "assistant" ? "text-brand-400/60" :
                      event.role === "user" ? "text-cyan-400/60" :
                      "text-white/20"
                    )}>
                      [{event.time}] {event.role}
                    </span>
                    <p className="mt-0.5 font-mono text-[11px] leading-relaxed text-white/40 break-all">
                      {event.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Text fallback */}
      {showTextFallback && (
        <div className="animate-fade-in-up">
          <TextInterview compact />
        </div>
      )}
    </div>
  );
}
