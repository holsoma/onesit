import { describe, expect, it } from "vitest";
import data from "../src/data/catalogue.json";
import { currentCatalogue } from "../src/lib/catalogue";
import type { CatalogueEntry, CatalogueSection } from "../src/lib/catalogue";
import { isDate, singaporeDay } from "../src/lib/dates";
import { safeUrl } from "../src/lib/events";

const entry = (id: string, overrides: Partial<CatalogueEntry> = {}): CatalogueEntry => ({
  id, title: id, organiser: "Test organiser", summary: "Test entry", when: "", where: "",
  poster: "/test.png", preview: "/test.webp", width: 100, height: 100,
  addedOn: "2026-11-19", actions: [{ label: "Register", url: "https://example.com" }], ...overrides,
});
const section = (entries: CatalogueEntry[], id = "internal"): CatalogueSection[] => [{ id, title: id, entries }];

describe("newsletter catalogue", () => {
  it("keeps registration open through its stated Singapore date, then removes it before the event", () => {
    const items = section([entry("future-event", { registrationCloses: "2026-11-21", endDate: "2026-12-05" })]);
    expect(currentCatalogue(items, singaporeDay(new Date("2026-11-21T15:59:59Z")))[0].entries).toHaveLength(1);
    expect(currentCatalogue(items, singaporeDay(new Date("2026-11-21T16:00:00Z")))).toEqual([]);
  });

  it("removes passed events without inventing a closing date for undated forms", () => {
    const result = currentCatalogue(section([entry("past", { endDate: "2026-11-18" }), entry("undated")]), "2026-11-19");
    expect(result[0].entries.map(item => item.id)).toEqual(["undated"]);
  });

  it("expires one action without losing a still-open feedback form", () => {
    const items = section([entry("combined", { actions: [
      {label: "Feedback", url: "https://example.com/feedback"},
      {label: "Pre-order before 30 November", url: "https://example.com/order", closesOn: "2026-11-29"},
    ]})]);
    expect(currentCatalogue(items, "2026-11-29")[0].entries[0].actions).toHaveLength(2);
    expect(currentCatalogue(items, "2026-11-30")[0].entries[0].actions.map(action => action.label)).toEqual(["Feedback"]);
    expect(currentCatalogue(section([entry("closed", {actions: [{label: "Register",url:"https://example.com",closesOn:"2026-11-18"}]})]), "2026-11-19")).toEqual([]);
  });

  it("keeps the three newest announcements, including promotions without forms", () => {
    const items = section([
      entry("oldest", {addedOn:"2026-10-01"}), entry("second", {addedOn:"2026-11-18"}),
      entry("new-a", {actions:[]}), entry("new-b", {actions:[]}),
      entry("expired", {addedOn:"2026-11-20",endDate:"2026-11-18"}),
    ], "announcements");
    expect(currentCatalogue(items, "2026-11-19")[0].entries.map(item => item.id)).toEqual(["new-a", "new-b", "second"]);
    expect(items[0].entries[0].id).toBe("oldest");
  });

  it("validates publication dates and links, with unique IDs and matching current sections", () => {
    const entries = data.flatMap(group => group.entries) as CatalogueEntry[];
    expect(new Set(entries.map(item => item.id)).size).toBe(entries.length);
    for (const item of entries) {
      expect(isDate(item.addedOn)).toBe(true);
      for (const date of [item.registrationCloses, item.endDate, ...item.actions.map(action=>action.closesOn)].filter(Boolean)) expect(isDate(date)).toBe(true);
      for (const action of item.actions) expect(safeUrl(action.url)).toBe(true);
    }
    expect(currentCatalogue(data, "2026-11-19").map(group=>[group.id,group.entries.length])).toEqual([["internal",2],["external",2],["announcements",3]]);
  });
});
