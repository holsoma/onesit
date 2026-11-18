import type { SVGAttributes } from "preact";
const paths: Record<string, string> = {
  refresh: "M20 7v5h-5m5 0a8 8 0 1 0-2 6M20 12l-3-4",
  bus: "M5 17h14V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v12zm0-7h14M8 14h1m6 0h1M7 17v3m10-3v3",
  mrt: "M6 16h12V5a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v11zm0-7h12M9 13h.01M15 13h.01M8 16l-3 6m11-6 3 6M7 20h10",
  home: "m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  calendar:
    "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2m3 10h2m4 0h2m-8 4h2",
  more: "M5 5h14M5 12h14M5 19h14",
  arrow: "M5 12h14m-5-5 5 5-5 5",
  external:
    "M14 3h7v7m0-7L10 14M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5",
  star: "m12 3 2.78 5.63 6.22.91-4.5 4.39 1.06 6.2L12 17.2l-5.56 2.93 1.06-6.2L3 9.54l6.22-.91z",
  search: "m21 21-5-5m2-6a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  clock: "M12 8v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  settings: "M4 7h16M4 17h16M8 4v6m8 4v6",
  chevron: "m9 5 7 7-7 7",
  back: "m15 5-7 7 7 7",
  check: "m5 12 4 4L19 6",
  upload: "M12 16V3m-5 5 5-5 5 5M4 15v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5",
  download: "M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4",
  plus: "M12 5v14M5 12h14",
  close: "m6 6 12 12M6 18 18 6",
  code: "m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18",
  book: "M3 3h6a3 3 0 0 1 3 3v16a3 3 0 0 0-3-3H3zM21 3h-6a3 3 0 0 0-3 3v16a3 3 0 0 1 3-3h6z",
  flag: "M4 22V3m0 0c5-5 11 5 16 0v11c-5 5-11-5-16 0",
  heart:
    "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z",
};
export function Icon({
  name,
  ...props
}: { name: string } & SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.7"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name] || paths.grid} />
    </svg>
  );
}
