"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Radio,
  ArrowLeftRight,
  Plug,
  Mic,
  Sparkles,
} from "lucide-react";
import { accounts } from "@/lib/data";
import { AccountAvatar } from "./ui";

const nav = [
  { href: "/", label: "Deal Health", icon: LayoutDashboard },
  { href: "/intelligence", label: "Sales Intelligence", icon: BarChart3 },
  { href: "/capture", label: "Live Capture", icon: Radio },
  { href: "/handover/a4", label: "Handover", icon: ArrowLeftRight },
  { href: "/integrations", label: "Integrations", icon: Plug },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg-elev)]">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent)] to-[#4338ca]">
          <Mic size={18} className="text-white" />
        </div>
        <div>
          <div className="text-[15px] font-semibold leading-none">VoiceLog</div>
          <div className="mt-1 text-[10px] uppercase tracking-widest text-[var(--text-faint)]">
            Sales Memory
          </div>
        </div>
      </div>

      <nav className="px-3">
        {nav.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href.split("/").slice(0, 2).join("/"));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-[var(--accent)]/15 text-white"
                  : "text-[var(--text-dim)] hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-5 px-5 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-faint)]">
        Accounts
      </div>
      <div className="mt-2 flex-1 overflow-y-auto px-3 pb-4">
        {accounts.map((a) => {
          const active = pathname === `/accounts/${a.id}`;
          return (
            <Link
              key={a.id}
              href={`/accounts/${a.id}`}
              className={`mb-1 flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition ${
                active ? "bg-white/8 text-white" : "text-[var(--text-dim)] hover:bg-white/5"
              }`}
            >
              <AccountAvatar initials={a.initials} color={a.logoColor} size={28} />
              <div className="min-w-0">
                <div className="truncate text-[13px] text-[var(--text)]">{a.name}</div>
                <div className="truncate text-[10px] text-[var(--text-faint)]">
                  {a.region}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="border-t border-[var(--border)] px-4 py-3">
        <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs text-[var(--text-dim)]">
          <Sparkles size={14} className="text-[var(--accent-2)]" />
          Prototype · dummy data
        </div>
      </div>
    </aside>
  );
}
