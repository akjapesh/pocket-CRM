import type { Temperature } from "./types";

export function formatMoney(value: number, currency: "INR" | "USD") {
  if (currency === "INR") {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
    return `₹${value.toLocaleString("en-IN")}`;
  }
  return `$${value.toLocaleString("en-US")}`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export const tempStyles: Record<Temperature, { dot: string; text: string; bg: string }> = {
  Hot: { dot: "#ef4444", text: "#fca5a5", bg: "rgba(239,68,68,0.12)" },
  Warm: { dot: "#f59e0b", text: "#fcd34d", bg: "rgba(245,158,11,0.12)" },
  Cool: { dot: "#38bdf8", text: "#7dd3fc", bg: "rgba(56,189,248,0.12)" },
  Cold: { dot: "#64748b", text: "#94a3b8", bg: "rgba(100,116,139,0.14)" },
};

export function scoreColor(score: number) {
  if (score >= 75) return "#00d3a7";
  if (score >= 55) return "#f59e0b";
  if (score >= 35) return "#fb923c";
  return "#ef4444";
}
