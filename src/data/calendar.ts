export const calendarSource =
  "https://www.singaporetech.edu.sg/admissions/undergraduate/academic-calendar-sit-and-joint-programmes";
export const calendarVerified = "2026-11-18";
export type Term = {
  id: string;
  year: string;
  number: number;
  start: string;
  end: string;
};
export const terms: Term[] = [
  {
    id: "2026-1",
    year: "2026/27",
    number: 1,
    start: "2026-08-31",
    end: "2027-01-03",
  },
  {
    id: "2026-2",
    year: "2026/27",
    number: 2,
    start: "2027-01-04",
    end: "2027-05-02",
  },
  {
    id: "2026-3",
    year: "2026/27",
    number: 3,
    start: "2027-05-03",
    end: "2027-08-29",
  },
];
export type CountdownKind = "recess" | "assessment" | "break";
export const countdownNames: Record<CountdownKind, string> = {
  recess: "Recess week",
  assessment: "Final assessment",
  break: "Trimester break",
};
export const offsets: Record<CountdownKind, number> = {
  recess: 42,
  assessment: 91,
  break: 98,
};
