"use client";

import { useState } from "react";
import { Check, UploadCloud } from "lucide-react";
import { Card, SectionTitle } from "./ui";

const targetColor: Record<string, string> = {
  HubSpot: "#ff7a59",
  Zoho: "#e42527",
  Salesforce: "#00a1e0",
  Pipedrive: "#017737",
};

export function CrmPushCard({
  target,
  payload,
}: {
  target: string;
  payload: Record<string, unknown>;
}) {
  const [synced, setSynced] = useState(false);

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
      <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] px-5 py-3">
        <span className="text-xs text-[var(--text-faint)]">
          Auto-creates / updates contact, logs activity, suggests next task.
        </span>
        <button
          onClick={() => setSynced(true)}
          disabled={synced}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
            synced
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-[var(--accent)] text-white hover:opacity-90"
          }`}
        >
          {synced ? (
            <>
              <Check size={15} /> Synced to {target}
            </>
          ) : (
            <>
              <UploadCloud size={15} /> Push to {target}
            </>
          )}
        </button>
      </div>
      {synced && (
        <div className="border-t border-[var(--border)] bg-emerald-500/8 px-5 py-2 text-xs text-emerald-300">
          ✓ Activity logged · contact updated · next task created
        </div>
      )}
    </Card>
  );
}

export { targetColor as _targetColor };
