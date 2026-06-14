import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { conversations, getAccount, getConversation } from "@/lib/data";
import { formatDateTime } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import { ConversationView } from "@/components/ConversationView";
import { AccountAvatar, Badge, ChannelIcon } from "@/components/ui";

export function generateStaticParams() {
  return conversations.map((c) => ({ id: c.id }));
}

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const convo = getConversation(id);
  if (!convo) notFound();
  const account = getAccount(convo.accountId);

  return (
    <div>
      <PageHeader
        title={
          <span className="flex items-center gap-2.5">
            <span className="text-2xl">
              <ChannelIcon channel={convo.channel} />
            </span>
            {convo.title}
          </span>
        }
        subtitle={`${formatDateTime(convo.date)} · ${convo.durationMin} min · ${convo.rep}`}
        right={
          account && (
            <Link
              href={`/accounts/${account.id}`}
              className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-sm transition hover:bg-white/5"
            >
              <AccountAvatar initials={account.initials} color={account.logoColor} size={24} />
              {account.name}
            </Link>
          )
        }
      />
      <div className="px-8 pt-4">
        <Link
          href={account ? `/accounts/${account.id}` : "/"}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--text-faint)] transition hover:text-[var(--text)]"
        >
          <ArrowLeft size={13} /> Back to account
        </Link>
        <div className="mt-2 flex gap-2">
          <Badge tone="accent">{convo.channel}</Badge>
          <Badge>{convo.language}</Badge>
        </div>
      </div>
      <ConversationView convo={convo} />
    </div>
  );
}
