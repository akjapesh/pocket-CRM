"use client";

import { useState } from "react";
import {
  ShieldAlert,
  Swords,
  IndianRupee,
  Heart,
  Network,
  ListChecks,
} from "lucide-react";
import type { Conversation } from "@/lib/types";
import { Badge, Card, SectionTitle } from "./ui";
import { CrmPushCard } from "./CrmPushCard";

const sentimentTone: Record<string, "success" | "warn" | "danger" | "neutral"> = {
  Positive: "success",
  Neutral: "neutral",
  Negative: "danger",
  Mixed: "warn",
};

export function ConversationView({ convo }: { convo: Conversation }) {
  const [active, setActive] = useState<string[] | null>(null);
  const ex = convo.extracted;

  const isHot = (key: string) => active?.includes(key);
  const fieldClass = (key: string) =>
    `rounded-xl border p-4 transition ${
      isHot(key)
        ? "border-[var(--accent)] bg-[var(--accent)]/10 shadow-[0_0_0_1px_var(--accent)]"
        : "border-[var(--border)] bg-[var(--bg-elev)]"
    }`;

  return (
    <div className="grid grid-cols-1 gap-6 p-8 lg:grid-cols-2">
      {/* Transcript */}
      <div className="space-y-4">
        <Card className="p-5">
          <SectionTitle hint="click a line to see what it extracted">
            Transcript · {convo.language}
          </SectionTitle>
          <div className="space-y-3">
            {convo.transcript.map((line, i) => {
              const selectable = !!line.drives?.length;
              return (
                <button
                  key={i}
                  onClick={() => setActive(selectable ? line.drives! : null)}
                  className={`flex w-full gap-3 rounded-lg p-2 text-left transition ${
                    selectable ? "cursor-pointer hover:bg-white/5" : "cursor-default"
                  } ${active && line.drives && line.drives.some((d) => active.includes(d)) ? "bg-[var(--accent)]/10" : ""}`}
                >
                  <span className="w-10 shrink-0 pt-0.5 font-mono text-[10px] text-[var(--text-faint)]">
                    {Math.floor(line.t / 60)}:{String(line.t % 60).padStart(2, "0")}
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                      line.side === "rep"
                        ? "bg-[var(--accent)]/20 text-[#b3aaff]"
                        : "bg-white/8 text-[var(--text-dim)]"
                    }`}
                  >
                    {line.speaker
                      .split(" ")[0]
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[11px] text-[var(--text-faint)]">
                      {line.speaker}
                      {selectable && (
                        <span className="ml-2 text-[var(--accent-2)]">● extracts data</span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--text)]">{line.text}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Extraction */}
      <div className="space-y-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <SectionTitle hint="VoiceLog extraction layer">Structured insights</SectionTitle>
            <div className="flex gap-2">
              <Badge tone="accent">{ex.stageSignal}</Badge>
              <Badge tone={sentimentTone[ex.sentiment]}>{ex.sentiment}</Badge>
            </div>
          </div>

          <div className="space-y-3">
            <div className={fieldClass("nextSteps")}>
              <FieldHead icon={<ListChecks size={14} />} title="Next steps" />
              <ul className="mt-1 space-y-1">
                {ex.nextSteps.map((s, i) => (
                  <li key={i} className="flex gap-2 text-sm text-[var(--text-dim)]">
                    <span className="text-[var(--accent-2)]">→</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className={fieldClass("objections")}>
                <FieldHead icon={<ShieldAlert size={14} />} title="Objections" />
                <Chips items={ex.objections} empty="None raised" />
              </div>
              <div className={fieldClass("competitors")}>
                <FieldHead icon={<Swords size={14} />} title="Competitors" />
                <Chips items={ex.competitors} empty="None mentioned" tone="danger" />
              </div>
            </div>

            <div className={fieldClass("pricingDiscussed")}>
              <FieldHead icon={<IndianRupee size={14} />} title="Pricing discussed" />
              <p className="mt-1 text-sm text-[var(--text-dim)]">{ex.pricingDiscussed}</p>
            </div>

            <div className={fieldClass("orgSignals")}>
              <FieldHead icon={<Network size={14} />} title="Org signals" />
              <ul className="mt-1 space-y-1">
                {ex.orgSignals.map((s, i) => (
                  <li key={i} className="text-sm text-[var(--text-dim)]">• {s}</li>
                ))}
              </ul>
            </div>

            <div className={fieldClass("relationshipSignals")}>
              <FieldHead
                icon={<Heart size={14} className="text-rose-400" />}
                title="Relationship signals"
              />
              <ul className="mt-1 space-y-1">
                {ex.relationshipSignals.map((s, i) => (
                  <li key={i} className="text-sm text-[var(--text-dim)]">• {s}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* BANT */}
        <Card className="p-5">
          <SectionTitle>BANT qualification</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            {(["budget", "authority", "need", "timeline"] as const).map((k) => (
              <div
                key={k}
                className={`rounded-lg border p-3 transition ${
                  isHot(`bant.${k}`)
                    ? "border-[var(--accent)] bg-[var(--accent)]/10"
                    : "border-[var(--border)] bg-[var(--bg-elev)]"
                }`}
              >
                <div className="text-[10px] uppercase tracking-widest text-[var(--text-faint)]">
                  {k}
                </div>
                <div className="mt-1 text-xs text-[var(--text-dim)]">{ex.bant[k]}</div>
              </div>
            ))}
          </div>
        </Card>

        <CrmPushCard target={convo.crmPush.target} payload={convo.crmPush.payload} />
      </div>
    </div>
  );
}

function FieldHead({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text)]">
      <span className="text-[var(--text-dim)]">{icon}</span>
      {title}
    </div>
  );
}

function Chips({
  items,
  empty,
  tone = "neutral",
}: {
  items: string[];
  empty: string;
  tone?: "neutral" | "danger";
}) {
  if (items.length === 0)
    return <p className="mt-1 text-xs text-[var(--text-faint)]">{empty}</p>;
  return (
    <div className="mt-1.5 flex flex-wrap gap-1.5">
      {items.map((it, i) => (
        <Badge key={i} tone={tone}>
          {it}
        </Badge>
      ))}
    </div>
  );
}
