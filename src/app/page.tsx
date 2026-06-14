import Link from "next/link";
import {
  AlertTriangle,
  TrendingUp,
  Users,
  MessageSquareText,
  ChevronRight,
} from "lucide-react";
import { accounts, conversations } from "@/lib/data";
import type { DealStage } from "@/lib/types";
import { formatMoney, relativeTime, scoreColor } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import {
  AccountAvatar,
  Badge,
  Card,
  ScoreRing,
  SectionTitle,
  TempPill,
} from "@/components/ui";

const STAGES: DealStage[] = [
  "Prospecting",
  "Qualified",
  "Demo",
  "Proposal",
  "Negotiation",
  "Closed Won",
];

function inr(value: number, currency: "INR" | "USD") {
  // normalise USD to INR for a single pipeline number (demo rate)
  return currency === "USD" ? value * 84 : value;
}

export default function Dashboard() {
  const totalPipeline = accounts.reduce(
    (sum, a) => sum + inr(a.dealValue, a.currency),
    0,
  );
  const avgRelationship = Math.round(
    accounts.reduce((s, a) => s + a.relationshipScore, 0) / accounts.length,
  );
  const openBlockers = accounts.flatMap((a) => a.blockers);
  const highRisk = openBlockers.filter((b) => b.severity === "High").length;

  const byStage = STAGES.map((stage) => ({
    stage,
    count: accounts.filter((a) => a.dealStage === stage).length,
    value: accounts
      .filter((a) => a.dealStage === stage)
      .reduce((s, a) => s + inr(a.dealValue, a.currency), 0),
  }));
  const maxStageValue = Math.max(...byStage.map((s) => s.value), 1);

  const atRisk = accounts
    .map((a) => ({
      account: a,
      high: a.blockers.filter((b) => b.severity === "High"),
    }))
    .filter((x) => x.high.length > 0 || x.account.relationshipScore < 55)
    .sort((a, b) => a.account.relationshipScore - b.account.relationshipScore);

  return (
    <div>
      <PageHeader
        title="Deal Health"
        subtitle="Your CRM records selling. VoiceLog reads how selling actually happens — on WhatsApp, on calls, across a chai-table — and turns it into deal, org & relationship intelligence."
      />

      <div className="space-y-6 p-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat
            icon={<TrendingUp size={18} />}
            label="Open pipeline"
            value={formatMoney(totalPipeline, "INR")}
            sub={`${accounts.length} active accounts`}
            tone="#6d5efc"
          />
          <Stat
            icon={<Users size={18} />}
            label="Avg relationship health"
            value={`${avgRelationship}`}
            sub="across all accounts"
            tone={scoreColor(avgRelationship)}
          />
          <Stat
            icon={<AlertTriangle size={18} />}
            label="High-severity blockers"
            value={`${highRisk}`}
            sub={`${openBlockers.length} blockers total`}
            tone="#ef4444"
          />
          <Stat
            icon={<MessageSquareText size={18} />}
            label="Conversations captured"
            value={`${conversations.length}`}
            sub="WhatsApp · calls · in-person"
            tone="#00d3a7"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="p-5 lg:col-span-2">
            <SectionTitle hint="value by stage (₹, USD@84)">Pipeline</SectionTitle>
            <div className="space-y-3">
              {byStage.map((s) => (
                <div key={s.stage} className="flex items-center gap-3">
                  <div className="w-24 shrink-0 text-xs text-[var(--text-dim)]">
                    {s.stage}
                  </div>
                  <div className="h-6 flex-1 overflow-hidden rounded-md bg-white/5">
                    <div
                      className="flex h-full items-center justify-end rounded-md bg-gradient-to-r from-[var(--accent)]/60 to-[var(--accent)] px-2 text-[10px] font-medium text-white"
                      style={{ width: `${Math.max((s.value / maxStageValue) * 100, s.count ? 8 : 0)}%` }}
                    >
                      {s.count > 0 && s.count}
                    </div>
                  </div>
                  <div className="w-20 shrink-0 text-right text-xs text-[var(--text-faint)]">
                    {s.value > 0 ? formatMoney(s.value, "INR") : "—"}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle hint="lowest health first">Needs attention</SectionTitle>
            <div className="space-y-3">
              {atRisk.slice(0, 4).map(({ account, high }) => (
                <Link
                  key={account.id}
                  href={`/accounts/${account.id}`}
                  className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-white/5"
                >
                  <ScoreRing score={account.relationshipScore} size={44} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{account.name}</div>
                    <div className="mt-0.5 flex flex-wrap gap-1">
                      {high.length > 0 ? (
                        <Badge tone="danger">{high.length} high blocker{high.length > 1 ? "s" : ""}</Badge>
                      ) : (
                        <Badge tone="warn">cold relationship</Badge>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-[var(--text-faint)]" />
                </Link>
              ))}
            </div>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <div className="border-b border-[var(--border)] px-5 py-4">
            <SectionTitle hint="click to open account intelligence">Accounts</SectionTitle>
          </div>
          <div className="grid grid-cols-12 gap-2 border-b border-[var(--border)] px-5 py-2.5 text-[11px] uppercase tracking-wide text-[var(--text-faint)]">
            <div className="col-span-4">Account</div>
            <div className="col-span-2">Stage</div>
            <div className="col-span-2">Value</div>
            <div className="col-span-2">Health</div>
            <div className="col-span-2">Last touch</div>
          </div>
          {accounts.map((a) => (
            <Link
              key={a.id}
              href={`/accounts/${a.id}`}
              className="grid grid-cols-12 items-center gap-2 border-b border-[var(--border)]/60 px-5 py-3 text-sm transition last:border-0 hover:bg-white/4"
            >
              <div className="col-span-4 flex items-center gap-3">
                <AccountAvatar initials={a.initials} color={a.logoColor} size={34} />
                <div className="min-w-0">
                  <div className="truncate font-medium">{a.name}</div>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-faint)]">
                    <Badge tone={a.segment === "B2B SaaS" ? "accent" : "neutral"}>
                      {a.segment}
                    </Badge>
                    <span>{a.industry}</span>
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <Badge>{a.dealStage}</Badge>
              </div>
              <div className="col-span-2 text-[var(--text-dim)]">
                {formatMoney(a.dealValue, a.currency)}
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <div
                  className="h-1.5 w-14 overflow-hidden rounded-full bg-white/8"
                  title={`${a.relationshipScore}/100`}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${a.relationshipScore}%`,
                      background: scoreColor(a.relationshipScore),
                    }}
                  />
                </div>
                <span className="text-xs" style={{ color: scoreColor(a.relationshipScore) }}>
                  {a.relationshipScore}
                </span>
              </div>
              <div className="col-span-2 flex items-center justify-between text-xs text-[var(--text-faint)]">
                {relativeTime(a.lastTouch)}
                {a.handover && <TempPill temp="Cool" />}
              </div>
            </Link>
          ))}
        </Card>
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  tone: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-[var(--text-dim)]">
        <span style={{ color: tone }}>{icon}</span>
        <span className="text-xs">{label}</span>
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-0.5 text-xs text-[var(--text-faint)]">{sub}</div>
    </Card>
  );
}
