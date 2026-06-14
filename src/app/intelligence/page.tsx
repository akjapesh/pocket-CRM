import {
  TrendingDown,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  Crown,
  Lightbulb,
} from "lucide-react";
import {
  conversionDrivers,
  objectionTrends,
  repPerformance,
  teamConversion,
  teamDiagnostics,
} from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";
import { Badge, Card, SectionTitle } from "@/components/ui";

export default function IntelligencePage() {
  const dipped = teamConversion.current < teamConversion.previous;
  const delta = teamConversion.current - teamConversion.previous;

  const ranked = [...repPerformance].sort((a, b) => b.winRate - a.winRate);
  const top = ranked[0];
  const bottom = ranked[ranked.length - 1];
  const maxWin = Math.max(...ranked.map((r) => r.winRate));

  return (
    <div>
      <PageHeader
        title="Sales Intelligence"
        subtitle="Your CRM tells you conversion dropped. VoiceLog tells you why — the behaviors inside the conversations that a CRM can never see."
      />

      <div className="space-y-6 p-8">
        {/* Hero: conversion + the why */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="flex flex-col justify-between p-5">
            <div className="flex items-center gap-2 text-xs text-[var(--text-dim)]">
              {dipped ? (
                <TrendingDown size={16} className="text-red-400" />
              ) : (
                <TrendingUp size={16} className="text-emerald-400" />
              )}
              Team win rate · this month
            </div>
            <div className="mt-2 flex items-end gap-3">
              <span className="text-4xl font-semibold tracking-tight">
                {teamConversion.current}%
              </span>
              <span
                className={`mb-1 flex items-center gap-0.5 text-sm font-medium ${
                  dipped ? "text-red-400" : "text-emerald-400"
                }`}
              >
                {dipped ? <ArrowDownRight size={15} /> : <ArrowUpRight size={15} />}
                {Math.abs(delta)}pp
              </span>
            </div>
            <div className="mt-1 text-xs text-[var(--text-faint)]">
              was {teamConversion.previous}% last month
            </div>
          </Card>

          <Card className="p-5 lg:col-span-2">
            <SectionTitle hint="extracted from conversations, not CRM fields">
              Why it moved
            </SectionTitle>
            <p className="text-sm text-[var(--text-dim)]">
              Conversion dipped <span className="text-red-300">{Math.abs(delta)}pp</span> because
              reps surfaced{" "}
              <span className="text-[var(--text)]">pricing later</span>, faced a{" "}
              <span className="text-[var(--text)]">spike in competitor objections</span>, and ran{" "}
              <span className="text-[var(--text)]">shallower discovery</span> — none of which the
              CRM recorded.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone="danger">Pricing discussed late</Badge>
              <Badge tone="danger">Competitor objections +27%</Badge>
              <Badge tone="warn">Discovery down 24%</Badge>
            </div>
          </Card>
        </div>

        {/* Diagnostics */}
        <Card className="p-5">
          <SectionTitle hint="behavioral drivers behind the number">
            Conversion diagnostics
          </SectionTitle>
          <div className="space-y-2.5">
            {teamDiagnostics.map((d) => (
              <div
                key={d.label}
                className="flex items-center gap-4 rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] p-3"
              >
                <div
                  className={`flex w-16 shrink-0 items-center justify-center gap-0.5 rounded-md py-1 text-xs font-semibold ${
                    d.impact === "negative"
                      ? "bg-red-500/12 text-red-300"
                      : "bg-emerald-500/12 text-emerald-300"
                  }`}
                >
                  {d.delta > 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {Math.abs(d.delta)}
                  {d.label.includes("%") || d.label.includes("objection") ? "%" : "pp"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium">{d.label}</span>
                    <span className="text-xs text-[var(--text-faint)]">{d.value}</span>
                  </div>
                  <div className="text-xs text-[var(--text-dim)]">{d.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Rep comparison */}
          <Card className="overflow-hidden lg:col-span-2">
            <div className="border-b border-[var(--border)] px-5 py-4">
              <SectionTitle hint="behaviors that separate top from bottom">
                Rep comparison
              </SectionTitle>
            </div>
            <div className="grid grid-cols-12 gap-2 border-b border-[var(--border)] px-5 py-2 text-[10px] uppercase tracking-wide text-[var(--text-faint)]">
              <div className="col-span-3">Rep</div>
              <div className="col-span-3">Win rate</div>
              <div className="col-span-2 text-center">Disc. Qs</div>
              <div className="col-span-2 text-center">Price early</div>
              <div className="col-span-1 text-center">Obj.</div>
              <div className="col-span-1 text-center">Next</div>
            </div>
            {ranked.map((r) => {
              const trend = r.winRate - r.prevWinRate;
              return (
                <div
                  key={r.name}
                  className="grid grid-cols-12 items-center gap-2 border-b border-[var(--border)]/60 px-5 py-3 text-sm last:border-0"
                >
                  <div className="col-span-3 min-w-0">
                    <div className="flex items-center gap-1.5 truncate font-medium">
                      {r.name === top.name && <Crown size={12} className="text-emerald-400" />}
                      {r.name}
                    </div>
                    <div className="truncate text-[11px] text-[var(--text-faint)]">
                      {r.region}
                    </div>
                  </div>
                  <div className="col-span-3 flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/8">
                      <div
                        className="h-full rounded-full bg-[var(--accent)]"
                        style={{ width: `${(r.winRate / maxWin) * 100}%` }}
                      />
                    </div>
                    <span>{r.winRate}%</span>
                    <span
                      className={`text-[11px] ${trend >= 0 ? "text-emerald-400" : "text-red-400"}`}
                    >
                      {trend >= 0 ? "▲" : "▼"}
                      {Math.abs(trend)}
                    </span>
                  </div>
                  <div className="col-span-2"><Metric value={r.behaviors.discoveryQs} good={r.behaviors.discoveryQs >= 5} /></div>
                  <div className="col-span-2"><Metric value={`${r.behaviors.pricingEarly}%`} good={r.behaviors.pricingEarly >= 60} /></div>
                  <div className="col-span-1"><Metric value={`${r.behaviors.objectionHandled}%`} good={r.behaviors.objectionHandled >= 70} /></div>
                  <div className="col-span-1"><Metric value={`${r.behaviors.nextStepCaptured}%`} good={r.behaviors.nextStepCaptured >= 75} /></div>
                </div>
              );
            })}
            <div className="flex items-start gap-2 border-t border-[var(--border)] bg-[var(--accent-2)]/8 px-5 py-3 text-xs text-[#7ff0d8]">
              <Lightbulb size={14} className="mt-0.5 shrink-0" />
              <span>
                {top.name} wins {top.winRate}% vs {bottom.name}&apos;s {bottom.winRate}% — driven by{" "}
                {top.behaviors.discoveryQs}x discovery questions and pricing surfaced early in{" "}
                {top.behaviors.pricingEarly}% of deals. Coach the team on early pricing → modeled
                uplift +2.8pp.
              </span>
            </div>
          </Card>

          {/* Conversion drivers + objection trends */}
          <div className="space-y-6">
            <Card className="p-5">
              <SectionTitle hint="correlation with closing">Conversion drivers</SectionTitle>
              <div className="space-y-2.5">
                {conversionDrivers.map((d) => (
                  <div key={d.behavior}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-dim)]">{d.behavior}</span>
                      <span className="font-mono text-[var(--accent-2)]">
                        +{d.correlation.toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/8">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]"
                        style={{ width: `${d.correlation * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <SectionTitle hint="aggregated · MoM trend">Top objections</SectionTitle>
              <div className="space-y-2">
                {objectionTrends.map((o) => (
                  <div key={o.label} className="flex items-center justify-between text-sm">
                    <span className="text-[var(--text-dim)]">{o.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--text)]">{o.count}</span>
                      <span
                        className={`flex items-center text-[11px] ${
                          o.delta > 0 ? "text-red-400" : "text-emerald-400"
                        }`}
                      >
                        {o.delta > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {Math.abs(o.delta)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ value, good }: { value: React.ReactNode; good: boolean }) {
  return (
    <div className={`text-center text-sm ${good ? "text-emerald-300" : "text-[var(--text-faint)]"}`}>
      {value}
    </div>
  );
}
