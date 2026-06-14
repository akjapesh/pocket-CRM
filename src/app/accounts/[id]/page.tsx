import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeftRight,
  Crown,
  Network,
  Lightbulb,
  ChevronRight,
} from "lucide-react";
import { accounts, getAccount, getConversationsForAccount } from "@/lib/data";
import type { Contact } from "@/lib/types";
import {
  formatDateTime,
  formatMoney,
  relativeTime,
  tempStyles,
} from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import {
  AccountAvatar,
  Badge,
  Card,
  ChannelIcon,
  ScoreRing,
  SectionTitle,
  TempPill,
} from "@/components/ui";

export function generateStaticParams() {
  return accounts.map((a) => ({ id: a.id }));
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const account = getAccount(id);
  if (!account) notFound();
  const convos = getConversationsForAccount(id);

  const roleTone = (role: Contact["role"]) =>
    role === "Champion"
      ? "success"
      : role === "Decision Maker"
        ? "accent"
        : role === "Blocker"
          ? "danger"
          : "neutral";

  return (
    <div>
      <PageHeader
        title={
          <span className="flex items-center gap-3">
            <AccountAvatar initials={account.initials} color={account.logoColor} size={36} />
            {account.name}
          </span>
        }
        subtitle={`${account.industry} · ${account.region} · owned by ${account.owner}`}
        right={
          <div className="flex items-center gap-3">
            {account.handover && (
              <Link
                href={`/handover/${account.id}`}
                className="flex items-center gap-2 rounded-lg border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-3 py-2 text-sm text-[#b3aaff] transition hover:bg-[var(--accent)]/25"
              >
                <ArrowLeftRight size={15} />
                View handover
              </Link>
            )}
            <div className="text-right">
              <div className="text-lg font-semibold">
                {formatMoney(account.dealValue, account.currency)}
              </div>
              <div className="text-xs text-[var(--text-faint)]">
                {account.dealStage} · {account.probability}%
              </div>
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 p-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Org / relationship map */}
          <Card className="p-5">
            <SectionTitle hint="auto-built from conversation signals">
              <span className="flex items-center gap-2">
                <Network size={15} /> Org & relationship map
              </span>
            </SectionTitle>
            <div className="space-y-3">
              {account.contacts.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-4"
                  style={{ marginLeft: c.reportsTo ? 24 : 0 }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold"
                        style={{
                          background: tempStyles[c.temperature].bg,
                          color: tempStyles[c.temperature].text,
                        }}
                      >
                        {c.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm font-medium">
                          {c.name}
                          {c.role === "Champion" && (
                            <Crown size={13} className="text-emerald-400" />
                          )}
                        </div>
                        <div className="text-xs text-[var(--text-faint)]">{c.title}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <Badge tone={roleTone(c.role)}>{c.role}</Badge>
                      <TempPill temp={c.temperature} />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/8">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${c.rapport}%`,
                          background: tempStyles[c.temperature].dot,
                        }}
                      />
                    </div>
                    <span className="text-[11px] text-[var(--text-faint)]">
                      rapport {c.rapport}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[var(--text-dim)]">{c.notes}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {c.signals.map((s, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] text-[var(--text-dim)]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Conversations */}
          <Card className="overflow-hidden">
            <div className="border-b border-[var(--border)] px-5 py-4">
              <SectionTitle hint={`${convos.length} captured`}>Conversations</SectionTitle>
            </div>
            {convos.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-[var(--text-faint)]">
                No conversations captured yet.
              </div>
            )}
            {convos.map((c) => (
              <Link
                key={c.id}
                href={`/conversations/${c.id}`}
                className="flex items-center gap-4 border-b border-[var(--border)]/60 px-5 py-3.5 transition last:border-0 hover:bg-white/4"
              >
                <span className="text-lg">
                  <ChannelIcon channel={c.channel} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{c.title}</div>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-faint)]">
                    <Badge>{c.channel}</Badge>
                    <span>{c.language}</span>
                    <span>· {c.durationMin} min</span>
                  </div>
                </div>
                <div className="text-right text-xs text-[var(--text-faint)]">
                  {relativeTime(c.date)}
                  <div>{c.rep}</div>
                </div>
                <ChevronRight size={16} className="text-[var(--text-faint)]" />
              </Link>
            ))}
          </Card>
        </div>

        {/* Right rail */}
        <div className="space-y-6">
          <Card className="flex flex-col items-center p-5">
            <ScoreRing score={account.relationshipScore} size={96} label="health" />
            <div className="mt-3 text-center text-sm text-[var(--text-dim)]">
              Account relationship health
            </div>
            <div className="mt-4 grid w-full grid-cols-2 gap-3 text-center">
              <div className="rounded-lg bg-white/5 p-3">
                <div className="text-lg font-semibold">{account.contacts.length}</div>
                <div className="text-[11px] text-[var(--text-faint)]">contacts mapped</div>
              </div>
              <div className="rounded-lg bg-white/5 p-3">
                <div className="text-lg font-semibold">{account.probability}%</div>
                <div className="text-[11px] text-[var(--text-faint)]">win probability</div>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle>
              <span className="flex items-center gap-2">
                <AlertTriangle size={15} className="text-amber-400" /> Blockers
              </span>
            </SectionTitle>
            <div className="space-y-3">
              {account.blockers.map((b) => (
                <div
                  key={b.id}
                  className="rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{b.type}</span>
                    <Badge
                      tone={
                        b.severity === "High"
                          ? "danger"
                          : b.severity === "Medium"
                            ? "warn"
                            : "neutral"
                      }
                    >
                      {b.severity}
                    </Badge>
                  </div>
                  <p className="mt-1.5 text-xs text-[var(--text-dim)]">{b.summary}</p>
                  <div className="mt-2 flex items-start gap-1.5 rounded-md bg-[var(--accent-2)]/10 p-2 text-[11px] text-[#7ff0d8]">
                    <Lightbulb size={13} className="mt-0.5 shrink-0" />
                    {b.suggestedAction}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 text-xs text-[var(--text-faint)]">
            Last touch {formatDateTime(account.lastTouch)}
          </Card>
        </div>
      </div>
    </div>
  );
}
