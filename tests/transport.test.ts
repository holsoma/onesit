import { describe, expect, it } from "vitest";
import { arrivalLabel, isStale, parseBusServices, transportTime, upcomingBuses } from "../src/lib/transport";
const now = Date.parse("2026-11-18T12:00:00+08:00");
const arrival = (offset: number, monitored = 0) => ({ time: new Date(now + offset).toISOString(), monitored });

describe("bus arrival data", () => {
  it("rejects malformed feeds without treating them as an empty service list", () => {
    for (const payload of [null, {}, { services: {} }, { services: [null] }]) expect(() => parseBusServices(payload)).toThrow();
    expect(parseBusServices({ services: [] })).toEqual([]);
  });
  it("keeps the distinct three arrival slots and timetable basis", () => {
    const services = parseBusServices({ services: [{ no: "34", next: arrival(45_000), subsequent: arrival(240_000), next2: arrival(240_000, 1), next3: arrival(601_000) }] });
    expect(services[0].arrivals).toEqual([
      { at: now + 45_000, basis: "schedule" },
      { at: now + 240_000, basis: "location" },
      { at: now + 601_000, basis: "schedule" },
    ]);
  });
  it("accepts empty estimates, rejects dates without timezones, sorts service numbers and removes duplicate entries", () => {
    const services = parseBusServices({ services: [
      { no: "104", next: { time: "" } },
      { no: "34", next: { time: "2026-11-18T12:00:00" }, next2: { time: "bad" } },
      { no: "34", next: arrival(1000) },
      { no: "117M", next: { ...arrival(2000), monitored: undefined } },
    ] });
    expect(services.map(service => service.number)).toEqual(["34", "104", "117M"]);
    expect(services[0].arrivals).toEqual([]);
    expect(services[2].arrivals[0].basis).toBe("unknown");
  });
  it("rounds down to minutes and never keeps passed buses as arriving", () => {
    expect(arrivalLabel({ at: now + 119_000, basis: "schedule" }, now)).toBe("1 min");
    expect(arrivalLabel({ at: now + 59_000, basis: "schedule" }, now)).toBe("Arriving");
    expect(arrivalLabel({ at: now - 1, basis: "schedule" }, now)).toBe("Passed");
    const service = parseBusServices({ services: [{ no: "34", next: arrival(-1000), next2: arrival(120_000), next3: arrival(172_800_000) }] })[0];
    expect(upcomingBuses(service, now).map(bus => bus.at)).toEqual([now + 120_000]);
  });
  it("expires old snapshots and handles a device clock moving backwards", () => {
    const snapshot = { receivedAt: now, services: [] };
    expect(isStale(snapshot, now + 90_000)).toBe(false);
    expect(isStale(snapshot, now + 90_001)).toBe(true);
    expect(isStale(snapshot, now - 60_000)).toBe(true);
    expect(transportTime(Date.parse("2026-11-17T16:01:02Z"))).toBe("00:01:02");
  });
});
