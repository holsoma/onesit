import { describe, it, expect } from "vitest";
import data from "../src/data/events.json";
import {
  eventStatus,
  mergeEvents,
  safeUrl,
  validateEvents,
} from "../src/lib/events";
describe("public events", () => {
  it("validates every published entry", () =>
    expect(validateEvents(data)).toEqual([]));
  it("rejects executable links, missing timezones and duplicate IDs", () => {
    expect(safeUrl("javascript:alert(1)")).toBe(false);
    expect(safeUrl("https://user:pass@example.com")).toBe(false);
    expect(validateEvents([data[0], data[0]]).join()).toContain("duplicate");
    expect(
      validateEvents([{ ...data[0], start: "2026-11-21T07:30" }]).join(),
    ).toContain("timezone");
  });
  it("handles registration closing before an event starts", () =>
    expect(
      eventStatus(
        { ...data[0], registrationCloses: "2026-11-01T23:59:00+08:00" },
        new Date("2026-11-18T12:00:00+08:00"),
      ),
    ).toBe("registration-closed"));
  it("keeps multi-day events ongoing through their final day", () =>
    expect(eventStatus(data[1], new Date("2026-12-06T12:00:00+08:00"))).toBe(
      "ongoing",
    ));
  it("merges edits by ID without losing unrelated events", () => {
    const merged = mergeEvents(data, [{ ...data[0], title: "Updated title" }]);
    expect(merged).toHaveLength(2);
    expect(merged[0].title).toBe("Updated title");
  });
});
