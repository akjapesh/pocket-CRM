import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Snowflake,
  Flame,
  ArrowLeftRight,
  Crown,
  Heart,
  AlertTriangle,
  MessageSquareQuote,
} from "lucide-react";
import { accounts, getAccount, getConversationsForAccount } from "@/lib/data";
import { formatMoney } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import {
  AccountAvatar,
  Badge,
  Card,
  ScoreRing,
  TempPill,
} from "@/components/ui";

export function generateStaticParams() {
  return accounts.filter((a) => a.handover).map((a) => ({ id: a.id }));
}

export default async function HandoverPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const account = getAccount(id);
  if (!account) notFound();
  const ho = account.handover;
  const convos = getConversationsForAccount(id);
  const lastConvo = convos[0];
  const dm = account.contacts.find((c) => c.role === "Decision Maker") ?? account.contacts[0];

  return (
    <div>
      <PageHeader
        title={
          <span className="flex items-center gap-2.5">
            <ArrowLeftRight size={20} className="text-[var(--accent)]" /> Account Handover
          </span>
        }
        subtitle="When a rep leaves, the relationship usually walks out the door. VoiceLog turns a cold handover into a warm one."
        right={
          <Link
            href={`/accounts/${account.id}`}
            className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm transition hover:bg-white/5"
          >
            <AccountAvatar initials={account.initials} color={account.logoColor} size={24} />
            {account.name}
          </Link>
        }
      />

      <div className="p-8">
        {ho && (
          <Card className="mb-6 flex flex-wrap items-center gap-4 p-5">
            <div className="flex items-center gap-3">
              <div className="text-sm">
                <div className="text-[var(--text-faint)]">Leaving</div>
                <div className="font-medium">{ho.fromRep}</div>
              </div>
              <ArrowLeftRight size={18} className="text-[var(--text-faint)]" />
              <div className="text-sm">
                <div className="text-[var(--text-faint)]">Taking over</div>
                <div className="font-medium">{ho.toRep}</div>
              </div>
            </div>
            <div className="h-8 w-px bg-[var(--border)]" />
            <div className="text-sm text-[var(--text-dim)]">{ho.reason}</div>
            <div className="ml-auto text-right">
              <div className="text-lg font-semibold">
                {formatMoney(account.dealValue, account.currency)}
              </div>
              <div className="text-xs text-[var(--text-faint)]">{account.dealStage}</div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Cold */}
          <Card className="overflow-hidden border-slate-600/40">
            <div className="flex items-center gap-2 border-b border-[var(--border)] bg-slate-500/5 px-5 py-4">
              <Snowflake size={18} className="text-slate-400" />
              <div>
                <div className="text-sm font-semibold text-slate-300">
                  Without VoiceLog
                </div>
                <div className="text-xs text-[var(--text-faint)]">
                  what the successor inherits today
                </div>
              </div>
            </div>
            <div className="space-y-3 p-5">
              <ColdRow label="Stage" value={account.dealStage} />
              <ColdRow label="Value" value={formatMoney(account.dealValue, account.currency)} />
              <ColdRow label="Decision maker" value="❓ unknown" dim />
              <ColdRow label="Relationship" value="❓ unknown" dim />
              <ColdRow label="What's blocking" value="❓ unknown" dim />
              <ColdRow label="Last conversation" value="❓ not logged" dim />
              <div className="mt-4 rounded-lg border border-slate-600/30 bg-slate-500/5 p-3 text-xs text-slate-400">
                The successor starts cold. The relationship history left with {ho?.fromRep ?? "the previous rep"}.
              </div>
            </div>
          </Card>

          {/* Warm */}
          <Card className="overflow-hidden border-[var(--accent)]/40">
            <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--accent)]/8 px-5 py-4">
              <Flame size={18} className="text-amber-400" />
              <div>
                <div className="text-sm font-semibold text-[#b3aaff]">With VoiceLog</div>
                <div className="text-xs text-[var(--text-faint)]">
                  institutional memory, preserved
                </div>
              </div>
              <div className="ml-auto">
                <ScoreRing score={account.relationshipScore} size={44} />
              </div>
            </div>
            <div className="space-y-4 p-5">
              <WarmBlock
                icon={<Crown size={15} className="text-emerald-400" />}
                title="Real decision maker"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{dm.name}</span>
                  <Badge tone="accent">{dm.role}</Badge>
                  <TempPill temp={dm.temperature} />
                </div>
                <p className="mt-1 text-xs text-[var(--text-dim)]">{dm.notes}</p>
              </WarmBlock>

              <WarmBlock
                icon={<Heart size={15} className="text-rose-400" />}
                title="Relationship temperature"
              >
                <div className="flex flex-wrap gap-1.5">
                  {account.contacts.map((c) => (
                    <span
                      key={c.id}
                      className="flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 text-xs"
                    >
                      {c.name} <TempPill temp={c.temperature} />
                    </span>
                  ))}
                </div>
              </WarmBlock>

              <WarmBlock
                icon={<AlertTriangle size={15} className="text-amber-400" />}
                title="What's blocking the deal"
              >
                <ul className="space-y-1.5">
                  {account.blockers.map((b) => (
                    <li key={b.id} className="text-xs text-[var(--text-dim)]">
                      <span className="font-medium text-[var(--text)]">{b.type}:</span>{" "}
                      {b.summary}
                    </li>
                  ))}
                </ul>
              </WarmBlock>

              {lastConvo && (
                <WarmBlock
                  icon={<MessageSquareQuote size={15} className="text-[var(--accent-2)]" />}
                  title="Suggested warm opener"
                >
                  <Link
                    href={`/conversations/${lastConvo.id}`}
                    className="block rounded-lg bg-[var(--accent-2)]/10 p-3 text-xs italic text-[#7ff0d8] transition hover:bg-[var(--accent-2)]/15"
                  >
                    &ldquo;{lastConvo.extracted.relationshipSignals[0]} — reference {lastConvo.extracted.nextSteps[0].toLowerCase()} to pick up exactly where {ho?.fromRep ?? "the last rep"} left off.&rdquo;
                  </Link>
                </WarmBlock>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ColdRow({ label, value, dim }: { label: string; value: string; dim?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--border)]/50 pb-2 text-sm last:border-0">
      <span className="text-[var(--text-faint)]">{label}</span>
      <span className={dim ? "text-slate-500" : "text-[var(--text)]"}>{value}</span>
    </div>
  );
}

function WarmBlock({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}
