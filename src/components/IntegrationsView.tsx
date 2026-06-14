"use client";

import { useState } from "react";
import {
  Check,
  Loader2,
  Lock,
  Plug,
  ShieldCheck,
  X,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import {
  authScopes,
  connectors,
  fieldMappings,
  syncPrefs,
  type Connector,
} from "@/lib/connectors";
import { useConnections } from "@/lib/useConnections";
import { Badge, Card } from "./ui";

type Step = "authorize" | "mapping" | "sync" | "done";

function ConnectorTile({
  c,
  connected,
  onConnect,
  onDisconnect,
}: {
  c: Connector;
  connected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-lg text-lg font-bold text-white"
          style={{ background: c.color }}
        >
          {c.name[0]}
        </div>
        {connected ? (
          <Badge tone="success">
            <Check size={11} /> Connected
          </Badge>
        ) : (
          c.popular && <Badge tone="accent">Popular</Badge>
        )}
      </div>
      <div className="mt-3 text-sm font-medium">{c.name}</div>
      <div className="text-xs text-[var(--text-faint)]">{c.blurb}</div>
      <div className="mt-4">
        {connected ? (
          <button
            onClick={onDisconnect}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 text-xs text-[var(--text-dim)] transition hover:bg-white/5"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={onConnect}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--accent)] px-3 py-2 text-xs font-medium text-white transition hover:opacity-90"
          >
            <Plug size={13} /> Connect
          </button>
        )}
      </div>
    </Card>
  );
}

export function IntegrationsView() {
  const { ready, connect, disconnect, isConnected } = useConnections();
  const [active, setActive] = useState<Connector | null>(null);
  const [step, setStep] = useState<Step>("authorize");
  const [authorizing, setAuthorizing] = useState(false);
  const [maps, setMaps] = useState<Record<string, string>>({});
  const [prefs, setPrefs] = useState<Record<string, boolean>>(
    Object.fromEntries(syncPrefs.map((p) => [p.id, p.default])),
  );

  const open = (c: Connector) => {
    setActive(c);
    setStep("authorize");
    setAuthorizing(false);
    setMaps(Object.fromEntries(fieldMappings.map((f) => [f.voicelog, f.options[0]])));
  };
  const close = () => setActive(null);

  const authorize = () => {
    setAuthorizing(true);
    setTimeout(() => {
      setAuthorizing(false);
      setStep("mapping");
    }, 1400);
  };

  const finish = () => {
    if (active) connect(active.id);
    setStep("done");
  };

  const crmCount = connectors.filter((c) => c.category === "CRM").length;

  return (
    <>
      <div className="space-y-8 p-8">
        <Section title="CRM" hint={`${crmCount} connectors`}>
          <Grid>
            {connectors
              .filter((c) => c.category === "CRM")
              .map((c) => (
                <ConnectorTile
                  key={c.id}
                  c={c}
                  connected={ready && isConnected(c.id)}
                  onConnect={() => open(c)}
                  onDisconnect={() => disconnect(c.id)}
                />
              ))}
          </Grid>
        </Section>

        <Section title="No CRM yet?" hint="40% of teams still log deals in spreadsheets">
          <Grid>
            {connectors
              .filter((c) => c.category === "Lightweight")
              .map((c) => (
                <ConnectorTile
                  key={c.id}
                  c={c}
                  connected={ready && isConnected(c.id)}
                  onConnect={() => open(c)}
                  onDisconnect={() => disconnect(c.id)}
                />
              ))}
          </Grid>
        </Section>
      </div>

      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg font-bold text-white"
                  style={{ background: active.color }}
                >
                  {active.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold">Connect {active.name}</div>
                  <div className="text-xs text-[var(--text-faint)]">VoiceLog integration</div>
                </div>
              </div>
              <button onClick={close} className="text-[var(--text-faint)] hover:text-white">
                <X size={18} />
              </button>
            </div>

            {/* Stepper */}
            {step !== "done" && (
              <div className="flex items-center gap-2 px-5 py-3 text-[11px]">
                {(["authorize", "mapping", "sync"] as Step[]).map((s, i) => (
                  <div key={s} className="flex items-center gap-2">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                        step === s
                          ? "bg-[var(--accent)] text-white"
                          : (["authorize", "mapping", "sync"] as Step[]).indexOf(step) > i
                            ? "bg-emerald-500/20 text-emerald-300"
                            : "bg-white/8 text-[var(--text-faint)]"
                      }`}
                    >
                      {(["authorize", "mapping", "sync"] as Step[]).indexOf(step) > i ? (
                        <Check size={11} />
                      ) : (
                        i + 1
                      )}
                    </span>
                    <span className={step === s ? "text-[var(--text)]" : "text-[var(--text-faint)]"}>
                      {s === "authorize" ? "Authorize" : s === "mapping" ? "Map fields" : "Sync"}
                    </span>
                    {i < 2 && <span className="text-[var(--text-faint)]">›</span>}
                  </div>
                ))}
              </div>
            )}

            <div className="max-h-[55vh] overflow-y-auto px-5 pb-5">
              {/* Step 1: Authorize */}
              {step === "authorize" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 rounded-lg bg-white/5 p-3 text-xs text-[var(--text-dim)]">
                    <ShieldCheck size={16} className="text-[var(--accent-2)]" />
                    VoiceLog is requesting access to your {active.name} workspace.
                  </div>
                  <div>
                    <div className="mb-2 text-xs font-semibold text-[var(--text)]">
                      Permissions
                    </div>
                    <ul className="space-y-1.5">
                      {authScopes.map((s) => (
                        <li key={s} className="flex items-center gap-2 text-xs text-[var(--text-dim)]">
                          <Check size={13} className="text-emerald-400" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={authorize}
                    disabled={authorizing}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-70"
                  >
                    {authorizing ? (
                      <>
                        <Loader2 size={15} className="animate-spin" /> Authorizing with {active.name}…
                      </>
                    ) : (
                      <>
                        <Lock size={14} /> Authorize {active.name}
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-[var(--text-faint)]">
                    Simulated OAuth · no real account is connected in this prototype
                  </p>
                </div>
              )}

              {/* Step 2: Field mapping */}
              {step === "mapping" && (
                <div className="space-y-3">
                  <p className="text-xs text-[var(--text-dim)]">
                    Map VoiceLog&apos;s sales-specific schema to your {active.name} fields.
                  </p>
                  {fieldMappings.map((f) => (
                    <div key={f.voicelog} className="flex items-center gap-3">
                      <div className="flex-1 truncate text-xs text-[var(--text)]">{f.voicelog}</div>
                      <ArrowRight size={13} className="shrink-0 text-[var(--text-faint)]" />
                      <select
                        value={maps[f.voicelog] ?? f.options[0]}
                        onChange={(e) =>
                          setMaps((m) => ({ ...m, [f.voicelog]: e.target.value }))
                        }
                        className="w-44 shrink-0 rounded-md border border-[var(--border)] bg-[var(--bg-elev)] px-2 py-1.5 text-xs text-[var(--text-dim)] outline-none focus:border-[var(--accent)]"
                      >
                        {f.options.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2">
                    <BackBtn onClick={() => setStep("authorize")} />
                    <NextBtn onClick={() => setStep("sync")} label="Continue" />
                  </div>
                </div>
              )}

              {/* Step 3: Sync preferences */}
              {step === "sync" && (
                <div className="space-y-3">
                  {syncPrefs.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPrefs((s) => ({ ...s, [p.id]: !s[p.id] }))}
                      className="flex w-full items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] p-3 text-left"
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition ${
                          prefs[p.id] ? "bg-[var(--accent)]" : "bg-white/10"
                        }`}
                      >
                        <span
                          className={`h-4 w-4 rounded-full bg-white transition ${
                            prefs[p.id] ? "translate-x-4" : ""
                          }`}
                        />
                      </span>
                      <span>
                        <span className="text-xs font-medium text-[var(--text)]">{p.label}</span>
                        <span className="block text-[11px] text-[var(--text-faint)]">{p.desc}</span>
                      </span>
                    </button>
                  ))}
                  <div className="flex justify-between pt-2">
                    <BackBtn onClick={() => setStep("mapping")} />
                    <NextBtn onClick={finish} label={`Connect ${active.name}`} />
                  </div>
                </div>
              )}

              {/* Step 4: Done */}
              {step === "done" && (
                <div className="flex flex-col items-center py-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
                    <Check size={32} className="text-emerald-400" />
                  </div>
                  <div className="mt-4 text-sm font-semibold">{active.name} is connected</div>
                  <p className="mt-1 max-w-xs text-xs text-[var(--text-dim)]">
                    VoiceLog will now push structured deal, org & relationship data to {active.name} after every conversation.
                  </p>
                  <button
                    onClick={close}
                    className="mt-5 rounded-lg bg-[var(--accent)] px-5 py-2 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold tracking-wide">{title}</h2>
        <span className="text-xs text-[var(--text-faint)]">{hint}</span>
      </div>
      {children}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">{children}</div>;
}

function NextBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-4 py-2 text-xs font-medium text-white transition hover:opacity-90"
    >
      {label} <ArrowRight size={13} />
    </button>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-4 py-2 text-xs text-[var(--text-dim)] transition hover:bg-white/5"
    >
      <ArrowLeft size={13} /> Back
    </button>
  );
}
