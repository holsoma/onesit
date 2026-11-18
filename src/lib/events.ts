import { isDate } from './dates';

export type CampusEvent = {
  id: string;
  title: string;
  summary: string;
  organiser: string;
  category: string;
  start: string;
  end: string;
  venue: string;
  url: string;
  sourceLabel: string;
  verifiedAt: string;
  registrationCloses?: string;
};
export function safeUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      ["https:", "http:"].includes(url.protocol) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}
export function validateEvents(value: unknown): string[] {
  if (!Array.isArray(value)) return ["The event file must contain a list."];
  const errors: string[] = [];
  const ids = new Set<string>();
  value.forEach((e, i) => {
    const name = `Event ${i + 1}`;
    if (!e || typeof e !== "object") {
      errors.push(`${name}: invalid entry.`);
      return;
    }
    for (const key of [
      "id",
      "title",
      "summary",
      "organiser",
      "category",
      "venue",
      "sourceLabel",
      "verifiedAt",
    ])
      if (typeof e[key] !== "string" || !e[key].trim())
        errors.push(`${name}: ${key} is required.`);
    if (ids.has(e.id)) errors.push(`${name}: duplicate ID.`);
    if (!isDate(e.verifiedAt)) errors.push(`${name}: invalid verification date.`);
    ids.add(e.id);
    if (!safeUrl(e.url || ""))
      errors.push(`${name}: use an http or https source URL.`);
    for (const key of ["start", "end"])
      if (
        typeof e[key] !== "string" ||
        !/(Z|[+-]\d\d:\d\d)$/.test(e[key]) ||
        Number.isNaN(Date.parse(e[key]))
      )
        errors.push(`${name}: ${key} needs a date, time and timezone.`);
    if (Date.parse(e.end) < Date.parse(e.start))
      errors.push(`${name}: end is before start.`);
    if (e.registrationCloses && Number.isNaN(Date.parse(e.registrationCloses)))
      errors.push(`${name}: invalid registration deadline.`);
  });
  return errors;
}
export function mergeEvents(existing: CampusEvent[], additions: CampusEvent[]) {
  const map = new Map(existing.map((e) => [e.id, e]));
  for (const event of additions) map.set(event.id, event);
  return [...map.values()].sort(
    (a, b) =>
      Date.parse(a.start) - Date.parse(b.start) || a.id.localeCompare(b.id),
  );
}
export function eventStatus(event: CampusEvent, now: Date) {
  if (Date.parse(event.end) < now.getTime()) return "past";
  if (
    event.registrationCloses &&
    Date.parse(event.registrationCloses) < now.getTime()
  )
    return "registration-closed";
  return Date.parse(event.start) <= now.getTime() ? "ongoing" : "upcoming";
}
