"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "voicelog.connections";
const DEFAULTS = ["zoho"];

function read(): string[] {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

function write(ids: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

export function useConnections() {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setIds(read());
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setIds(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const connect = useCallback((id: string) => {
    setIds((prev) => {
      const next = prev.includes(id) ? prev : [...prev, id];
      write(next);
      return next;
    });
  }, []);

  const disconnect = useCallback((id: string) => {
    setIds((prev) => {
      const next = prev.filter((x) => x !== id);
      write(next);
      return next;
    });
  }, []);

  const isConnected = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, ready, connect, disconnect, isConnected };
}
