"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import {
  appendTranscriptMessage,
  createRealtimeSession,
  endInterview,
  pushRealtimeDebugLog
} from "@/lib/api";
import { CLAI_SESSION_ID } from "@/lib/sessionStorageKeys";
import { AIOrb, type OrbState } from "@/components/shared/AIOrb";
import { TextInterview } from "./TextInterview";

type VoiceState = "idle" | "connecting" | "live" | "error" | "ended";
type ActivityState = "Listening" | "AI Speaking" | "Thinking";

type EventItem = {
  id: string;
  role: "system" | "assistant" | "user" | "error";
  text: string;
  time: string;
};

type ConversationItem = {
  id: string;
  speaker: "ai" | "candidate";
  text: string;
  time: string;
};

const LANGUAGE_OPTIONS = ["English", "Spanish", "Hindi", "French", "German", "Portuguese", "Arabic", "Mandarin"];
const MAX_QUESTIONS = 3;

const statusColors: Record<VoiceState, string> = {
  idle: "bg-slate-100 text-slate-700 border-slate-200",
  connecting: "bg-amber-100 text-amber-800 border-amber-200",
  live: "bg-emerald-100 text-emerald-800 border-emerald-200",
  error: "bg-red-100 text-red-800 border-red-200",
  ended: "bg-slate-100 text-slate-700 border-slate-200"
};

const statusLabels: Record<VoiceState, string> = {
  idle: "Ready",
  connecting: "Connecting",
  live: "Live",
  error: "Error",
  ended: "Ended"
};

function toOrbState(voiceState: VoiceState, activityState: ActivityState): OrbState {
  if (voiceState === "connecting") return "connecting";
  if (voiceState === "ended" || voiceState === "error") return "ended";
  if (voiceState !== "live") return "idle";
  if (activityState === "AI Speaking") return "speaking";
  if (activityState === "Listening") return "listening";
  return "thinking";
}

function getEphemeralKey(session: unknown): string | null {
  if (!session || typeof session !== "object") return null;
  const obj = session as Record<string, unknown>;
  if (typeof obj.client_secret === "string") return obj.client_secret;
  if (obj.client_secret && typeof obj.client_secret === "object") {
    const cs = obj.client_secret as Record<string, unknown>;
    if (typeof cs.value === "string") return cs.value;
    if (typeof cs.secret === "string") return cs.secret;
  }
  if (obj.session && typeof obj.session === "object") {
    const s = obj.session as Record<string, unknown>;
    if (typeof s.client_secret === "string") return s.client_secret;
    if (s.client_secret && typeof s.client_secret === "object") {
      const cs = s.client_secret as Record<string, unknown>;
      if (typeof cs.value === "string") return cs.value;
      if (typeof cs.secret === "string") return cs.secret;
    }
  }
  if (obj.secret && typeof obj.secret === "object") {
    const sec = obj.secret as Record<string, unknown>;
    if (typeof sec.value === "string") return sec.value;
  }
  if (typeof obj.value === "string") return obj.value;
  return null;
}

function getRealtimeModel(session: unknown): string {
  if (!session || typeof session !== "object") return "gpt-4o-realtime-preview";
  const obj = session as Record<string, unknown>;
  if (typeof obj.model === "string") return obj.model;
  return "gpt-4o-realtime-preview";
}

export function VoiceInterview({ hideEmbeddedTextFallback = false }: { hideEmbeddedTextFallback?: boolean }) {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [activityState, setActivityState] = useState<ActivityState>("Thinking");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [conversation, setConversation] = useState<ConversationItem[]>([]);
  const [showTextFallback, setShowTextFallback] = useState(false);
  const [fallbackMessage, setFallbackMessage] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState("English");
  const [questionCount, setQuestionCount] = useState(0);
  const [liveCandidateText, setLiveCandidateText] = useState("");

  const sessionIdRef = useRef<string | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const finishingRef = useRef(false);

  const canStart = useMemo(() => voiceState === "idle" || voiceState === "error" || voiceState === "ended", [voiceState]);
  const orbState = useMemo(() => toOrbState(voiceState, activityState), [voiceState, activityState]);

  const pushEvent = (role: EventItem["role"], text: string) => {
    setEvents((prev) => [
      ...prev,
      {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        role,
        text,
        time: new Date().toLocaleTimeString()
      }
    ]);
  };

  const pushConversation = (speaker: "ai" | "candidate", text: string) => {
    const cleaned = text.trim();
    if (!cleaned) return;
    setConversation((prev) => [
      ...prev,
      {
        id: `${speaker}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        speaker,
        text: cleaned,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  };

  const teardown = () => {
    dcRef.current?.close();
    dcRef.current = null;
    if (pcRef.current) {
      pcRef.current.getSenders().forEach((sender) => sender.track?.stop());
      pcRef.current.close();
      pcRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.srcObject = null;
    }
  };

  const persistTranscript = async (sender: "ai" | "candidate", content: string) => {
    if (!sessionIdRef.current) return;
    try {
      await appendTranscriptMessage(sessionIdRef.current, { sender, content });
    } catch (error) {
      await pushRealtimeDebugLog({
        source: "voice-interview-ui",
        message: `persist transcript failed (${sender})`,
        detail: error instanceof Error ? error.message : String(error),
        ts: new Date().toISOString()
      });
    }
  };

  const finalizeInterview = async (reason: string) => {
    if (finishingRef.current) return;
    finishingRef.current = true;

    if (sessionIdRef.current) {
      try {
        await endInterview(sessionIdRef.current);
      } catch {
        // keep UI flow deterministic even if backend end fails
      }
    }

    teardown();
    setVoiceState("ended");
    setActivityState("Thinking");
    pushEvent("system", reason);
    finishingRef.current = false;
  };

  const handleVoiceFailure = async (message: string, detail?: string) => {
    teardown();
    setVoiceState("error");
    setActivityState("Thinking");
    setShowTextFallback(true);
    setFallbackMessage("Voice interview is unavailable. You can continue with text interview fallback.");
    pushEvent("error", message);
    await pushRealtimeDebugLog({
      source: "voice-interview-ui",
      message,
      detail,
      ts: new Date().toISOString()
    });
  };

  const startInterview = async () => {
    setVoiceState("connecting");
    setActivityState("Thinking");
    setFallbackMessage("");
    setQuestionCount(0);
    finishingRef.current = false;

    sessionIdRef.current = typeof window !== "undefined" ? localStorage.getItem(CLAI_SESSION_ID) : null;
    if (!sessionIdRef.current) {
      await handleVoiceFailure("Voice start failed: No interview session found. Start from the lobby first.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        video: false
      });
      streamRef.current = stream;

      pushEvent("system", `Requested interview language: ${preferredLanguage}`);
      const session = await createRealtimeSession(preferredLanguage);
      if (session && typeof session === "object") {
        const rootKeys = Object.keys(session as Record<string, unknown>);
        pushEvent("system", `realtime.session keys: ${rootKeys.join(", ")}`);
      }
      const ephemeralKey = getEphemeralKey(session);
      if (!ephemeralKey) throw new Error("Realtime session did not include a client secret");

      const model = getRealtimeModel(session);
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      const remoteAudio = new Audio();
      remoteAudio.autoplay = true;
      audioRef.current = remoteAudio;

      pc.ontrack = (event) => {
        remoteAudio.srcObject = event.streams[0];
        setActivityState("AI Speaking");
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "connected") {
          setVoiceState("live");
          setActivityState("Listening");
          pushEvent("system", `Connected (${model}). Waiting for audio.`);
        }
        if (["failed", "disconnected"].includes(pc.connectionState)) {
          void handleVoiceFailure("Voice connection dropped.");
        }
      };

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;

      dc.onopen = () => {
        pushEvent("system", "Realtime event channel opened.");
        dc.send(JSON.stringify({
          type: "response.create",
          response: {
            instructions:
              `Respond only in ${preferredLanguage}. Greet briefly, then ask exactly one interview question at a time. ` +
              `Stop after ${MAX_QUESTIONS} total questions. Do not ask more than ${MAX_QUESTIONS} questions.`
          }
        }));
      };

      dc.onmessage = async (event) => {
        try {
          const payload = JSON.parse(event.data as string) as Record<string, unknown>;
          const type = String(payload.type || "event");
          const transcript = typeof payload.transcript === "string" ? payload.transcript : "";
          const text = typeof payload.text === "string" ? payload.text : "";
          const delta = typeof payload.delta === "string" ? payload.delta : "";

          if (type.includes("speech_started")) setActivityState("Listening");
          if (type.includes("response.output_audio") || type.includes("response.audio")) setActivityState("AI Speaking");
          if (type.includes("response.created")) setActivityState("Thinking");

          if (type === "error") {
            const err = payload.error as Record<string, unknown> | undefined;
            await handleVoiceFailure(`Realtime error: ${String(err?.message || "Unknown realtime error")}`, JSON.stringify(payload));
            return;
          }

          if (type === "conversation.item.input_audio_transcription.completed" && transcript) {
            pushConversation("candidate", transcript);
            await persistTranscript("candidate", transcript);
            setLiveCandidateText("");
          }

          if (type === "conversation.item.input_audio_transcription.delta" && transcript) {
            setLiveCandidateText((prev) => `${prev}${transcript}`);
          }

          if (type === "conversation.item.input_audio_transcription.failed") {
            setLiveCandidateText("");
            pushEvent("error", "Candidate speech transcription failed for this turn.");
          }

          const isAssistantDone =
            type === "response.output_audio_transcript.done" ||
            type === "response.audio_transcript.done" ||
            type === "response.text.done" ||
            type === "response.output_text.done";

          if (isAssistantDone) {
            const aiText = transcript || text;
            if (aiText) {
              pushConversation("ai", aiText);
              await persistTranscript("ai", aiText);

              if (aiText.includes("?")) {
                setQuestionCount((prev) => {
                  const next = prev + 1;
                  if (next >= MAX_QUESTIONS && !finishingRef.current) {
                    setTimeout(() => {
                      void finalizeInterview(`Interview complete: ${MAX_QUESTIONS} questions asked.`);
                    }, 250);
                  }
                  return next;
                });
              }
            }
          }

          const short = transcript || text || delta || JSON.stringify(payload).slice(0, 180);
          const role: EventItem["role"] = type.includes("input") ? "user" : type.includes("response") ? "assistant" : "system";
          pushEvent(role, `${type}: ${short}`);
        } catch {
          pushEvent("system", `event: ${String(event.data).slice(0, 180)}`);
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      let sdpResponse: Response;
      try {
        sdpResponse = await fetch("https://api.openai.com/v1/realtime/calls", {
          method: "POST",
          body: offer.sdp,
          headers: {
            Authorization: `Bearer ${ephemeralKey}`,
            "Content-Type": "application/sdp"
          }
        });
      } catch {
        sdpResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/realtime/call`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sdp: offer.sdp, model })
        });
      }

      if (!sdpResponse.ok) {
        const detail = await sdpResponse.text().catch(() => "");
        throw new Error(`SDP exchange failed: ${sdpResponse.status} ${detail}`);
      }

      const answerSdp = await sdpResponse.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });
      pushEvent("system", "Voice connection is live.");
    } catch (error) {
      await handleVoiceFailure(
        `Voice start failed: ${error instanceof Error ? error.message : "unknown error"}`,
        error instanceof Error ? error.stack : undefined
      );
    }
  };

  useEffect(() => () => teardown(), []);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold", statusColors[voiceState])}>
            {statusLabels[voiceState]}
          </span>
          {voiceState === "live" ? <span className="text-xs text-slate-600">{activityState}</span> : null}
          <span className="text-xs text-slate-600">Questions: {questionCount}/{MAX_QUESTIONS}</span>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white px-6 py-5">
        <p className="text-sm font-medium text-slate-900">AI Interview Room</p>
        <p className="mt-1 text-xs text-slate-600">Start voice interview and answer each question clearly.</p>
        <div className="mt-5 flex justify-center">
          <AIOrb state={orbState} size="md" />
        </div>

        <div className="mt-4 w-full max-w-sm">
          <label className="mb-2 block text-xs font-medium text-slate-700">Preferred Interview Language</label>
          <select
            value={preferredLanguage}
            onChange={(e) => setPreferredLanguage(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand-500"
          >
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {canStart ? (
            <button
              onClick={() => void startInterview()}
              className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
            >
              Start Voice Interview
            </button>
          ) : null}

          {voiceState === "live" ? (
            <button
              onClick={() => void finalizeInterview("Voice interview ended by candidate.")}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
            >
              End Interview
            </button>
          ) : null}

          <button
            onClick={() => setShowTextFallback((v) => !v)}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            {showTextFallback ? "Hide Text Fallback" : "I prefer text"}
          </button>
        </div>

        {fallbackMessage ? <p className="mt-3 text-sm text-amber-700">{fallbackMessage}</p> : null}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="mb-3 text-xs text-slate-600">Realtime Timeline</p>
        <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
          {events.length === 0 ? (
            <p className="text-xs text-slate-500">No events yet.</p>
          ) : (
            events.map((event) => (
              <div key={event.id} className="rounded-md bg-slate-50 px-3 py-2">
                <p className="text-[10px] text-slate-500">[{event.time}] {event.role}</p>
                <p className="text-xs text-slate-700">{event.text}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="mb-3 text-xs text-slate-600">Conversation</p>
        {liveCandidateText ? (
          <div className="mb-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-800">
            Listening: {liveCandidateText}
          </div>
        ) : null}
        <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
          {conversation.length === 0 ? (
            <p className="text-xs text-slate-500">Start voice to see transcript messages here.</p>
          ) : (
            conversation.map((item) => (
              <div key={item.id} className={cn("flex", item.speaker === "candidate" ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[80%] rounded-lg px-4 py-2 text-sm",
                  item.speaker === "ai" ? "bg-slate-100 text-slate-900" : "bg-brand-600 text-white"
                )}>
                  <p>{item.text}</p>
                  <p className={cn("mt-1 text-[10px]", item.speaker === "ai" ? "text-slate-500" : "text-white/70")}>{item.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showTextFallback && !hideEmbeddedTextFallback ? (
        <div className="animate-fade-in-up">
          <TextInterview compact />
        </div>
      ) : null}
      {showTextFallback && hideEmbeddedTextFallback ? (
        <p className="text-center text-sm text-slate-700">
          Use the text interview panel above this page.
        </p>
      ) : null}
    </div>
  );
}
