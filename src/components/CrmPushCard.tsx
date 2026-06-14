"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, UploadCloud, Plug, Loader2 } from "lucide-react";
import { targetToConnector } from "@/lib/connectors";
import { useConnections } from "@/lib/useConnections";
import { Card, SectionTitle } from "./ui";

const targetColor: Record<string, string> = {
  HubSpot: "#ff7a59",
  Zoho: "#e42527",
  Salesforce: "#00a1e0",
  Pipedrive: "#1a8a3f",
};

export function CrmPushCard({
  target,
  payload,
}: {
  target: string;
  payload: Record<string, unknown>;
}) {
  const { ready, isConnected } = useConnections();
  const connectorId = targetToConnector[target] ?? target.toLowerCase();
  const connected = ready && isConnected(connectorId);

  const [status, setStatus] = useState<"idle" | "pushing" | "synced">("idle");

  const push = () => {
    setStatus("pushing");
    setTimeout(() => setStatus("synced"), 1100);
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
      <pre className="max-h-72 overflow-auto bg-[#0c0e17] px-5 py-4 font-mono text-[11.5px] leading-relaxed text-[#c8d0e8]">
        {JSON.stringify(payload, null, 2)}
      </pre>

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
        <>
          <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] px-5 py-3">
            <span className="text-xs text-[var(--text-faint)]">
              Auto-creates / updates contact, logs activity, suggests next task.
            </span>
            <button
              onClick={push}
              disabled={status !== "idle"}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                status === "synced"
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-[var(--accent)] text-white hover:opacity-90"
              }`}
            >
              {status === "synced" ? (
                <>
                  <Check size={15} /> Synced to {target}
                </>
              ) : status === "pushing" ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Pushing…
                </>
              ) : (
                <>
                  <UploadCloud size={15} /> Push to {target}
                </>
              )}
            </button>
          </div>
          {status === "synced" && (
            <div className="border-t border-[var(--border)] bg-emerald-500/8 px-5 py-2 text-xs text-emerald-300">
              ✓ Activity logged · contact updated · next task created
            </div>
          )}
        </>
      )}
    </Card>
  );
}
