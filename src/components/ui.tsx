import type { Temperature } from "@/lib/types";
import { scoreColor, tempStyles } from "@/lib/format";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-[var(--border)] bg-[var(--bg-card)] ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  hint,
}: {
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-3 flex items-baseline justify-between">
      <h2 className="text-sm font-semibold tracking-wide text-[var(--text)]">
        {children}
      </h2>
      {hint && <span className="text-xs text-[var(--text-faint)]">{hint}</span>}
    </div>
  );
}

export function TempPill({ temp }: { temp: Temperature }) {
  const s = tempStyles[temp];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ background: s.bg, color: s.text }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} />
      {temp}
    </span>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "danger" | "warn" | "success";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-white/5 text-[var(--text-dim)] border-white/10",
    accent: "bg-[var(--accent)]/15 text-[#b3aaff] border-[var(--accent)]/30",
    danger: "bg-red-500/12 text-red-300 border-red-500/25",
    warn: "bg-amber-500/12 text-amber-300 border-amber-500/25",
    success: "bg-emerald-500/12 text-emerald-300 border-emerald-500/25",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function ScoreRing({
  score,
  size = 56,
  label,
}: {
  score: number;
  size?: number;
  label?: string;
}) {
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const color = scoreColor(score);
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-sm font-semibold" style={{ color }}>
          {score}
        </span>
        {label && <span className="text-[9px] text-[var(--text-faint)]">{label}</span>}
      </div>
    </div>
  );
}

export function AccountAvatar({
  initials,
  color,
  size = 40,
}: {
  initials: string;
  color: string;
  size?: number;
}) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-lg font-semibold text-white"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}, ${color}aa)`,
        fontSize: size * 0.34,
      }}
    >
      {initials}
    </div>
  );
}

export function ChannelIcon({ channel }: { channel: string }) {
  const map: Record<string, string> = {
    "WhatsApp Call": "📞",
    "WhatsApp Voice Note": "🎙️",
    "Phone Call": "☎️",
    "In-Person": "🤝",
    "Video Call": "🎥",
  };
  return <span>{map[channel] ?? "💬"}</span>;
}
