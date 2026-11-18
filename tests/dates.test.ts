import { describe, it, expect } from "vitest";
import {
  academicState,
  countdowns,
  singaporeDay,
  isDate,
} from "../src/lib/dates";
import { parsePreferences } from "../src/lib/preferences";
describe("SIT dates", () => {
  it("changes day at Singapore midnight", () => {
    expect(singaporeDay(new Date("2026-11-17T15:59:59Z"))).toBe("2026-11-17");
    expect(singaporeDay(new Date("2026-11-17T16:00:00Z"))).toBe("2026-11-18");
  });
  it("uses official week numbers including recess", () => {
    expect(academicState("2026-08-31").week).toBe(1);
    expect(academicState("2026-10-12").period).toBe("Recess week");
    expect(academicState("2026-10-19").week).toBe(8);
    expect(academicState("2026-11-18").week).toBe(12);
    expect(academicState("2026-11-30").period).toBe("Final assessment");
    expect(academicState("2026-12-07").period).toBe("Trimester break");
  });
  it("handles term boundaries and unavailable schedules", () => {
    expect(academicState("2027-01-03").period).toBe("Trimester break");
    expect(academicState("2027-01-04").week).toBe(1);
    expect(academicState("2028-01-01").week).toBe(null);
  });
  it("handles today, ongoing periods and upcoming recess", () => {
    expect(
      countdowns("2026-11-18").find((c) => c.kind === "assessment")?.days,
    ).toBe(12);
    expect(
      countdowns("2026-11-30").find((c) => c.kind === "assessment")?.status,
    ).toBe("Today");
    expect(
      countdowns("2026-12-01").find((c) => c.kind === "assessment")?.status,
    ).toBe("Under way");
    expect(
      countdowns("2026-11-18").find((c) => c.kind === "recess")?.target,
    ).toBe("2027-02-15");
  });
  it("applies personal dates and never shows negative countdowns", () => {
    expect(academicState("2026-11-18", { start: "2026-11-16" }).week).toBe(1);
    expect(
      countdowns("2026-11-18", { assessment: "2026-11-17" }).find(
        (c) => c.kind === "assessment",
      )?.status,
    ).toBe("Ended");
  });
  it("rejects impossible dates", () => {
    expect(isDate("2026-02-30")).toBe(false);
    expect(isDate("2028-02-29")).toBe(true);
    expect(isDate("junk")).toBe(false);
  });
});
describe("local preferences", () => {
  it("recovers from broken or future-version data", () => {
    expect(parsePreferences("{bad").favourites).toContain("in4sit");
    expect(parsePreferences('{"version":2}').version).toBe(1);
  });
  it("preserves an intentional empty list and validates saved values", () => {
    expect(
      parsePreferences('{"version":1,"favourites":[],"dates":{}}').favourites,
    ).toEqual([]);
    const p = parsePreferences(
      '{"version":1,"favourites":["in4sit","in4sit","cates","missing"],"dates":{"start":"2026-02-30"}}',
    );
    expect(p.favourites).toEqual(["in4sit"]);
    expect(p.dates).toEqual({});
  });
});
