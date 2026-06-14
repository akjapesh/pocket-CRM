"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Mic, Square, Loader2, Check, Sparkles, ArrowRight } from "lucide-react";
import { conversations } from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionTitle } from "@/components/ui";

const demo = conversations[0]; // Nexus Retail Cloud — WhatsApp pricing call

type Phase = "idle" | "recording" | "transcribing" | "extracting" | "done";

export default function CapturePage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [shownLines, setShownLines] = useState(0);
  const [shownFields, setShownFields] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const fields = [
    { label: "Deal stage", value: demo.extracted.stageSignal },
    { label: "Objection", value: demo.extracted.objections[0] ?? "—" },
    { label: "Competitor", value: demo.extracted.competitors[0] ?? "—" },
    { label: "Economic buyer", value: "Anjali (VP Sales)" },
    { label: "Next step", value: demo.extracted.nextSteps[0] },
    { label: "Relationship", value: "Warm · personal rapport" },
  ];

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  // recording timer
  useEffect(() => {
    if (phase !== "recording") return;
    const iv = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(iv);
  }, [phase]);

  const start = () => {
    setPhase("recording");
    setSeconds(0);
    setShownLines(0);
    setShownFields(0);
  };

  const stop = () => {
    setPhase("transcribing");
    // reveal transcript lines one by one
    demo.transcript.forEach((_, i) => {
      timers.current.push(
        setTimeout(() => setShownLines(i + 1), 350 * (i + 1)),
      );
    });
    const afterTranscript = 350 * demo.transcript.length + 400;
    timers.current.push(
      setTimeout(() => setPhase("extracting"), afterTranscript),
    );
    fields.forEach((_, i) => {
      timers.current.push(
        setTimeout(() => setShownFields(i + 1), afterTranscript + 300 * (i + 1)),
      );
    });
    timers.current.push(
      setTimeout(() => setPhase("done"), afterTranscript + 300 * fields.length + 400),
    );
  };

  const reset = () => {
    clearTimers();
    setPhase("idle");
    setShownLines(0);
    setShownFields(0);
    setSeconds(0);
  };

  return (
    <div>
      <PageHeader
        title="Live Capture"
        subtitle="Simulate a WhatsApp / phone / in-person sales call. VoiceLog records, transcribes Hinglish, and extracts CRM-ready structure in real time."
      />

      <div className="grid grid-cols-1 gap-6 p-8 lg:grid-cols-2">
        {/* Recorder */}
        <Card className="flex flex-col items-center justify-center p-10">
          <div className="text-center text-xs uppercase tracking-widest text-[var(--text-faint)]">
            {demo.channel} · {demo.language}
          </div>
          <div className="mt-1 text-sm text-[var(--text-dim)]">{demo.title}</div>

          <div className="relative my-8 flex h-40 w-40 items-center justify-center">
            {phase === "recording" && (
              <span className="absolute inset-0 rounded-full bg-[var(--accent)]/20 pulse-ring" />
            )}
            <button
              onClick={phase === "idle" ? start : phase === "recording" ? stop : undefined}
              disabled={phase === "transcribing" || phase === "extracting"}
              className={`flex h-32 w-32 items-center justify-center rounded-full transition ${
                phase === "recording"
                  ? "bg-red-500 text-white"
                  : phase === "idle"
                    ? "bg-[var(--accent)] text-white hover:scale-105"
                    : "bg-white/10 text-[var(--text-dim)]"
              }`}
            >
              {phase === "idle" && <Mic size={42} />}
              {phase === "recording" && <Square size={36} />}
              {(phase === "transcribing" || phase === "extracting") && (
                <Loader2 size={42} className="animate-spin" />
              )}
              {phase === "done" && <Check size={42} className="text-emerald-400" />}
            </button>
          </div>

          {phase === "recording" && (
            <div className="flex items-end gap-1">
              {Array.from({ length: 9 }).map((_, i) => (
                <span
                  key={i}
                  className="wave-bar w-1.5 rounded-full bg-[var(--accent)]"
                  style={{ height: 24, animationDelay: `${i * 0.08}s` }}
                />
              ))}
            </div>
          )}

          <div className="mt-5 font-mono text-2xl tabular-nums">
            {String(Math.floor(seconds / 60)).padStart(2, "0")}:
            {String(seconds % 60).padStart(2, "0")}
          </div>
          <div className="mt-2 text-sm text-[var(--text-faint)]">
            {phase === "idle" && "Tap to start recording"}
            {phase === "recording" && "Recording… tap to stop"}
            {phase === "transcribing" && "Transcribing audio…"}
            {phase === "extracting" && "Extracting CRM structure…"}
            {phase === "done" && "Done — ready to sync"}
          </div>

          {phase === "done" && (
            <button
              onClick={reset}
              className="mt-4 rounded-lg border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-dim)] transition hover:bg-white/5"
            >
              Record another
            </button>
          )}
        </Card>

        {/* Live output */}
        <div className="space-y-4">
          <Card className="p-5">
            <SectionTitle hint={phase === "idle" ? "waiting" : "live"}>
              Transcript
            </SectionTitle>
            {shownLines === 0 ? (
              <p className="py-6 text-center text-sm text-[var(--text-faint)]">
                Transcript will appear here as the call is processed.
              </p>
            ) : (
              <div className="space-y-2">
                {demo.transcript.slice(0, shownLines).map((l, i) => (
                  <div key={i} className="fade-up flex gap-2 text-sm">
                    <span className="shrink-0 text-[11px] text-[var(--accent-2)]">
                      {l.speaker.split(" ")[0]}:
                    </span>
                    <span className="text-[var(--text-dim)]">{l.text}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <SectionTitle hint="sales-specific schema">
              <span className="flex items-center gap-2">
                <Sparkles size={14} className="text-[var(--accent-2)]" /> Extracted fields
              </span>
            </SectionTitle>
            {shownFields === 0 ? (
              <p className="py-6 text-center text-sm text-[var(--text-faint)]">
                Structured insights appear after transcription.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {fields.slice(0, shownFields).map((f, i) => (
                  <div
                    key={i}
                    className="fade-up rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] p-3"
                  >
                    <div className="text-[10px] uppercase tracking-widest text-[var(--text-faint)]">
                      {f.label}
                    </div>
                    <div className="mt-1 text-xs text-[var(--text)]">{f.value}</div>
                  </div>
                ))}
              </div>
            )}
            {phase === "done" && (
              <Link
                href={`/conversations/${demo.id}`}
                className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
              >
                Open full conversation & CRM push <ArrowRight size={15} />
              </Link>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
