import { countdownNames, offsets, terms } from "../data/calendar";
import type { CountdownKind } from "../data/calendar";
export type DateOverrides = Partial<Record<CountdownKind | "start", string>>;
const DAY = 86400000;
export function singaporeDay(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}
export function isDate(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString().slice(0, 10) === value
  );
}
export const dayNumber = (day: string) =>
  Math.floor(Date.parse(day + "T00:00:00Z") / DAY);
export const addDays = (day: string, days: number) =>
  new Date((dayNumber(day) + days) * DAY).toISOString().slice(0, 10);
export function formatDay(
  day: string,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" },
) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Singapore",
    ...options,
  }).format(new Date(day.length === 10 ? day + "T12:00:00+08:00" : day));
}
export function academicState(day: string, overrides: DateOverrides = {}) {
  const term = terms.find((t) => day >= t.start && day <= t.end);
  const start = isDate(overrides.start) ? overrides.start : term?.start;
  const week = start
    ? Math.floor((dayNumber(day) - dayNumber(start)) / 7) + 1
    : null;
  const validWeek = week && week >= 1 && week <= 18 ? week : null;
  const period = !validWeek
    ? "Dates not available"
    : validWeek === 7
      ? "Recess week"
      : validWeek === 14
        ? "Final assessment"
        : validWeek >= 15
          ? "Trimester break"
          : "Study week";
  return { term, week: validWeek, period, custom: !!overrides.start };
}
export function countdowns(day: string, overrides: DateOverrides = {}) {
  return (Object.keys(countdownNames) as CountdownKind[]).map((kind) => {
    let target = overrides[kind];
    let end: string | undefined;
    const custom = isDate(target);
    if (!custom) {
      const current = academicState(day, overrides);
      const candidates = terms.map((term) => {
        const start =
          current.term?.id === term.id && isDate(overrides.start)
            ? overrides.start
            : term.start;
        const date = addDays(start, offsets[kind]);
        return { date, end: kind === "break" ? term.end : addDays(date, 6) };
      });
      const candidate = candidates.find((c) => c.end >= day);
      target = candidate?.date;
      end = candidate?.end;
    }
    const days = target ? dayNumber(target) - dayNumber(day) : null;
    const status =
      days === null
        ? "Dates pending"
        : days === 0
          ? "Today"
          : days < 0
            ? end && day <= end
              ? "Under way"
              : "Ended"
            : `${days} ${days === 1 ? "day" : "days"}`;
    return { kind, name: countdownNames[kind], target, days, status, custom };
  });
}
