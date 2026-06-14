"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  UploadCloud,
  Plug,
  Loader2,
  Database,
  ListChecks,
  Building2,
  RotateCcw,
} from "lucide-react";
import type { Conversation } from "@/lib/types";
import { getAccount } from "@/lib/data";
import { formatMoney } from "@/lib/format";
import { targetToConnector } from "@/lib/connectors";
import { useConnections } from "@/lib/useConnections";
import { Badge, Card, SectionTitle, TempPill } from "./ui";

const targetColor: Record<string, string> = {
  HubSpot: "#ff7a59",
  Zoho: "#e42527",
  Salesforce: "#00a1e0",
  Pipedrive: "#1a8a3f",
};

const methodColor: Record<string, string> = {
  POST: "#34d399",
  PATCH: "#fbbf24",
  PUT: "#60a5fa",
  GET: "#94a3b8",
};

interface SyncStep {
  method: string;
  path: string;
  label: string;
  result: string;
}

export function CrmPushCard({ convo }: { convo: Conversation }) {
  const target = convo.crmPush.target;
  const payload = convo.crmPush.payload;
  const account = getAccount(convo.accountId);
  const ex = convo.extracted;

  const { ready, isConnected } = useConnections();
  const connectorId = targetToConnector[target] ?? target.toLowerCase();
  const connected = ready && isConnected(connectorId);

  const [status, setStatus] = useState<"idle" | "pushing" | "synced">("idle");
  const [done, setDone] = useState(0);

  const dealId = "88" + (convo.id.replace(/\D/g, "") || "0") + "31";

  const steps: SyncStep[] = [
    {
      method: "POST",
      path: "/crm/v3/objects/companies/batch/upsert",
      label: `Upsert company "${account?.name ?? payload.account}"`,
      result: "company #40128",
    },
    {
      method: "POST",
      path: "/crm/v3/objects/contacts/batch/upsert",
      label: `Upsert ${account?.contacts.length ?? 1} contact(s) + voicelog_role`,
      result: account?.contacts.map((c) => c.name).join(", ") ?? "1 contact",
    },
    {
      method: "PATCH",
      path: `/crm/v3/objects/deals/${dealId}`,
      label: `Set dealstage → ${ex.stageSignal} + custom properties`,
      result: `deal #${dealId}`,
    },
    ...(ex.nextSteps.length
      ? [
          {
            method: "POST",
            path: "/crm/v3/objects/tasks",
            label: `Create ${ex.nextSteps.length} task(s) from next steps`,
            result: ex.nextSteps[0],
          },
        ]
      : []),
    {
      method: "PUT",
      path: `/crm/v4/objects/deals/${dealId}/associations`,
      label: "Associate contacts & tasks ↔ deal",
      result: "linked",
    },
  ];

  const customProps: [string, string][] = [
    ["voicelog_relationship_score", String(account?.relationshipScore ?? "—")],
    ...(ex.competitors.length ? ([["voicelog_competitor", ex.competitors[0]]] as [string, string][]) : []),
    ...(ex.objections.length ? ([["voicelog_objection", ex.objections[0]]] as [string, string][]) : []),
    ["voicelog_sentiment", ex.sentiment],
  ];

  const push = () => {
    setStatus("pushing");
    setDone(0);
    steps.forEach((_, i) => {
      setTimeout(() => {
        setDone(i + 1);
        if (i === steps.length - 1) setTimeout(() => setStatus("synced"), 500);
      }, 650 * (i + 1));
    });
  };

  const reset = () => {
    setStatus("idle");
    setDone(0);
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
        <SectionTitle hint="structured output">CRM sync preview</SectionTitle>
        <span
          className="rounded-md px-2 py-1 text-xs font-semibold text-white"
          style={{ background: targetColor[target] ?? "#6d5efc" }}
        >
          {target}
        </span>
      </div>

      {/* Canonical payload */}
      {status === "idle" && (
        <pre className="max-h-60 overflow-auto bg-[#0c0e17] px-5 py-4 font-mono text-[11.5px] leading-relaxed text-[#c8d0e8]">
          {JSON.stringify(payload, null, 2)}
        </pre>
      )}

      {/* Sync console */}
      {status !== "idle" && (
        <div className="bg-[#0c0e17] px-5 py-4 font-mono text-[11.5px]">
          {steps.map((s, i) => {
            const state = i < done ? "done" : i === done ? "running" : "pending";
            return (
              <div
                key={i}
                className={`flex items-start gap-2 py-1 ${state === "pending" ? "opacity-35" : ""}`}
              >
                <span className="mt-0.5 w-4 shrink-0">
                  {state === "done" ? (
                    <Check size={13} className="text-emerald-400" />
                  ) : state === "running" ? (
                    <Loader2 size={13} className="animate-spin text-[var(--accent)]" />
                  ) : (
                    <span className="text-[var(--text-faint)]">·</span>
                  )}
                </span>
                <span
                  className="w-12 shrink-0 font-semibold"
                  style={{ color: methodColor[s.method] }}
                >
                  {s.method}
                </span>
                <span className="min-w-0">
                  <span className="text-[#8b93b0]">{s.path}</span>
                  <span className="block text-[#c8d0e8]">{s.label}</span>
                  {state === "done" && (
                    <span className="block text-[10px] text-emerald-400/80">→ {s.result}</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Resulting CRM record */}
      {status === "synced" && account && (
        <div className="border-t border-[var(--border)] p-5">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-[var(--text)]">
            <Database size={14} style={{ color: targetColor[target] ?? "#6d5efc" }} />
            Record in {target}
            <span className="text-[var(--text-faint)]">· deal #{dealId}</span>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 size={15} className="text-[var(--text-dim)]" />
                <span className="text-sm font-medium">{account.name}</span>
              </div>
              <span className="text-sm font-semibold">
                {formatMoney(account.dealValue, account.currency)}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[var(--text-faint)]">
              <Badge tone="accent">{ex.stageSignal}</Badge>
              <span>owner: {account.owner}</span>
            </div>

            <div className="mt-3">
              <div className="text-[10px] uppercase tracking-widest text-[var(--text-faint)]">
                Custom properties created
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5 font-mono text-[10.5px]">
                {customProps.map(([k, v]) => (
                  <span key={k} className="rounded-md bg-white/5 px-2 py-1 text-[var(--text-dim)]">
                    <span className="text-[var(--accent-2)]">{k}</span>
                    <span className="text-[var(--text-faint)]">=</span>
                    {v}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-[var(--text-faint)]">
                  Associated contacts
                </div>
                <div className="mt-1.5 space-y-1">
                  {account.contacts.map((c) => (
                    <div key={c.id} className="flex items-center gap-1.5 text-xs">
                      <span className="text-[var(--text)]">{c.name}</span>
                      <Badge>{c.role}</Badge>
                      <TempPill temp={c.temperature} />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-[var(--text-faint)]">
                  <ListChecks size={11} /> Tasks created
                </div>
                <div className="mt-1.5 space-y-1">
                  {ex.nextSteps.map((s, i) => (
                    <div key={i} className="flex gap-1.5 text-xs text-[var(--text-dim)]">
                      <span className="text-[var(--accent-2)]">▢</span> {s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer / actions */}
      {!connected ? (
        <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] bg-amber-500/8 px-5 py-3">
          <span className="text-xs text-amber-200/90">
            {target} isn&apos;t connected yet — connect it to enable auto-sync.
          </span>
          <Link
            href="/integrations"
            className="flex items-center gap-1.5 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm font-medium text-amber-200 transition hover:bg-amber-400/20"
          >
            <Plug size={14} /> Connect {target}
          </Link>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] px-5 py-3">
          <span className="text-xs text-[var(--text-faint)]">
            {status === "synced"
              ? "Activity logged · contacts upserted · tasks created"
              : "Maps VoiceLog's schema to your CRM objects & properties."}
          </span>
          {status === "synced" ? (
            <button
              onClick={reset}
              className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--text-dim)] transition hover:bg-white/5"
            >
              <RotateCcw size={14} /> Replay sync
            </button>
          ) : (
            <button
              onClick={push}
              disabled={status === "pushing"}
              className="flex items-center gap-2 rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-70"
            >
              {status === "pushing" ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Syncing to {target}…
                </>
              ) : (
                <>
                  <UploadCloud size={15} /> Push to {target}
                </>
              )}
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
