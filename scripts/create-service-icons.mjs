import { mkdir, writeFile, copyFile } from "node:fs/promises";
await mkdir("public/services", { recursive: true });
await mkdir("public/brand", { recursive: true });
await copyFile(
  "assets/brand/concepts/onesit-wordmark-only.svg",
  "public/brand/onesit.svg",
);
const icons = {
  in4sit: ["#f7e8eb", "#ba2639", "M8 9h8v16H8zM19 9h5l5 8v8h-5V17l-5-8z"],
  xsite: ["#e6f1f0", "#24766d", "m10 10 16 16m0-16L10 26"],
  rooms: ["#f1eafa", "#7553a0", "M9 29V8h18v21M15 8v21m4-10h1M6 29h24"],
  map: [
    "#e8eefb",
    "#3c65af",
    "m6 10 8-4 9 4 7-4v22l-7 4-9-4-8 4zm8-4v22m9-18v22",
  ],
  intranet: [
    "#e8f3f4",
    "#287882",
    "M6 8h24v20H6zM6 14h24M12 14v14m5-9h8m-8 5h8",
  ],
  calendar: [
    "#fcefe3",
    "#ad6a29",
    "M8 9h20v21H8zm5-3v6m10-6v6M8 16h20m-14 5h3m4 0h3m-10 5h3",
  ],
  career: [
    "#e9eeed",
    "#3f6e61",
    "M6 13h24v17H6zm7 0V8h10v5M6 21h24m-14-3h4v6h-4z",
  ],
  cates: [
    "#fff0df",
    "#d77a26",
    "M26 12a11 11 0 1 0 0 13M11 10v8m5-10v10m-5-4h5m-3 4v10",
  ],
  food: [
    "#f5ede1",
    "#9b763a",
    "M8 7v10m5-10v10M8 12h5m-3 5v13m15-23c-8 3-8 14 0 13V7m0 13v10",
  ],
  transport: [
    "#f1eaf7",
    "#82529f",
    "M10 6h16v20H10zm0 12h16m-13 5h1m8 0h1M13 26l-4 5m14-5 4 5M15 10h6",
  ],
  health: ["#eaf1f3", "#457c8d", "M14 7h8v7h7v8h-7v7h-8v-7H7v-8h7z"],
  facilities: [
    "#eceef3",
    "#61728b",
    "M8 30V14h20v16M12 14V7h12v7M15 30v-7h6v7M12 19h2m8 0h2",
  ],
  community: [
    "#f2e9ed",
    "#995e7b",
    "M14 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0m16 0a4 4 0 1 1-8 0 4 4 0 0 1 8 0M3 29v-4a7 7 0 0 1 14 0v4m2 0v-4a7 7 0 0 1 14 0v4",
  ],
};
for (const [name, [bg, ink, path]] of Object.entries(icons)) {
  await writeFile(
    `public/services/${name}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="10" fill="${bg}"/><g transform="translate(2 2)" fill="none" stroke="${ink}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${path}"/></g></svg>`,
  );
}
console.log(`Created ${Object.keys(icons).length} local service icons.`);
