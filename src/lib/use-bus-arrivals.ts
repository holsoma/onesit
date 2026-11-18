import { useEffect, useRef, useState } from "preact/hooks";
import { arrivalEndpoint } from "../data/transport";
import { parseBusServices, refreshInterval } from "./transport";
import type { BusSnapshot } from "./transport";

let cached: BusSnapshot | null = null;

export function useBusArrivals() {
  const [snapshot, setSnapshot] = useState<BusSnapshot | null>(null);
  const [now, setNow] = useState(0);
  const [busy, setBusy] = useState(true);
  const [issue, setIssue] = useState<"offline" | "unavailable" | null>(null);
  const refreshRef = useRef<() => void>(() => {});

  useEffect(() => {
    let disposed = false;
    let generation = 0;
    let request: AbortController | null = null;
    let poll: ReturnType<typeof setTimeout> | undefined;
    setNow(Date.now());
    if (cached) setSnapshot(cached);

    const cancel = () => {
      generation++;
      clearTimeout(poll);
      request?.abort();
      request = null;
    };
    const load = async () => {
      if (disposed || document.hidden || request) return;
      clearTimeout(poll);
      setNow(Date.now());
      if (!navigator.onLine) {
        setIssue("offline");
        setBusy(false);
        return;
      }
      const current = ++generation;
      const controller = new AbortController();
      request = controller;
      setBusy(true);
      const timeout = setTimeout(() => controller.abort(), 8000);
      try {
        const response = await fetch(arrivalEndpoint, {
          signal: controller.signal,
          credentials: "omit",
          referrerPolicy: "no-referrer",
        });
        if (!response.ok) throw new Error("Bus feed unavailable");
        const services = parseBusServices(await response.json());
        if (disposed || current !== generation || controller.signal.aborted) return;
        cached = { services, receivedAt: Date.now() };
        setSnapshot(cached);
        setNow(cached.receivedAt);
        setIssue(null);
      } catch {
        if (!disposed && current === generation) setIssue(navigator.onLine ? "unavailable" : "offline");
      } finally {
        clearTimeout(timeout);
        if (!disposed && current === generation) {
          request = null;
          setBusy(false);
          if (!document.hidden) poll = setTimeout(() => void load(), refreshInterval);
        }
      }
    };
    const visibility = () => {
      if (document.hidden) {
        cancel();
        setBusy(false);
      } else void load();
    };
    const offline = () => {
      cancel();
      setNow(Date.now());
      setBusy(false);
      setIssue("offline");
    };
    const online = () => void load();
    refreshRef.current = () => void load();
    void load();
    const clock = setInterval(() => { if (!document.hidden) setNow(Date.now()); }, 5000);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("offline", offline);
    window.addEventListener("online", online);
    return () => {
      disposed = true;
      cancel();
      clearInterval(clock);
      refreshRef.current = () => {};
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("offline", offline);
      window.removeEventListener("online", online);
    };
  }, []);
  return { snapshot, now, busy, issue, refresh: () => refreshRef.current() };
}
