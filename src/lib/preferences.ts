import { services, defaultFavourites } from "../data/services";
import { isDate } from "./dates";
import type { DateOverrides } from "./dates";
export const storageKey = "onesit.preferences.v1";
export type Preferences = {
  version: 1;
  favourites: string[];
  dates: DateOverrides;
};
export const initialPreferences = (): Preferences => ({
  version: 1,
  favourites: [...defaultFavourites],
  dates: {},
});
export function parsePreferences(raw: string | null): Preferences {
  if (!raw) return initialPreferences();
  try {
    const data = JSON.parse(raw);
    if (
      data.version !== 1 ||
      !Array.isArray(data.favourites) ||
      !data.dates ||
      typeof data.dates !== "object"
    )
      return initialPreferences();
    const validIds = new Set(
      services.filter((s) => s.status === "available").map((s) => s.id),
    );
    const favourites = [
      ...new Set<string>(
        data.favourites.filter(
          (id: unknown) => typeof id === "string" && validIds.has(id),
        ),
      ),
    ];
    const dates: DateOverrides = {};
    for (const key of ["start", "recess", "assessment", "break"] as const)
      if (isDate(data.dates[key])) dates[key] = data.dates[key];
    return { version: 1, favourites, dates };
  } catch {
    return initialPreferences();
  }
}
