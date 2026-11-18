export const refreshInterval = 30_000;
export const staleAfter = 90_000;
export type BusArrival = { at: number; basis: "schedule" | "location" | "unknown" };
export type BusService = { number: string; arrivals: BusArrival[] };
export type BusSnapshot = { services: BusService[]; receivedAt: number };

function record(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" ? value as Record<string, unknown> : null;
}
function parseArrival(value: unknown): BusArrival | null {
  const item = record(value);
  if (!item || typeof item.time !== "string" || !/(Z|[+-]\d\d:\d\d)$/.test(item.time)) return null;
  const at = Date.parse(item.time);
  if (!Number.isFinite(at)) return null;
  return { at, basis: item.monitored === 0 ? "schedule" : item.monitored === 1 ? "location" : "unknown" };
}
export function parseBusServices(payload: unknown): BusService[] {
  const body = record(payload);
  if (!body || !Array.isArray(body.services)) throw new Error("Invalid bus response");
  const services: BusService[] = [];
  const seen = new Set<string>();
  for (const value of body.services) {
    const item = record(value);
    if (!item || typeof item.no !== "string" || !/^[\da-z]{1,10}$/i.test(item.no) || seen.has(item.no)) continue;
    seen.add(item.no);
    const arrivals = [item.next, item.next2 ?? item.subsequent, item.next3]
      .map(parseArrival).filter((arrival): arrival is BusArrival => arrival !== null);
    services.push({ number: item.no, arrivals });
  }
  if (body.services.length && !services.length) throw new Error("Invalid bus services");
  return services.sort((a, b) => a.number.localeCompare(b.number, "en", { numeric: true }));
}
export function upcomingBuses(service: BusService | undefined, now: number): BusArrival[] {
  return service?.arrivals.filter(arrival => arrival.at >= now && arrival.at - now <= 86_400_000).slice(0, 3) ?? [];
}
export function arrivalLabel(arrival: BusArrival, now: number): string {
  const minutes = Math.floor((arrival.at - now) / 60_000);
  return minutes < 0 ? "Passed" : minutes === 0 ? "Arriving" : `${minutes} min`;
}
export function isStale(snapshot: BusSnapshot, now: number): boolean {
  return now - snapshot.receivedAt > staleAfter || now < snapshot.receivedAt - 5000;
}
export function transportTime(time: number): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Singapore", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(time);
}
