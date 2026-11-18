import fs from "node:fs/promises";
import { gzipSync } from "node:zlib";
const origin = (
  process.env.VITE_SITE_URL || "https://onesit.vercel.app"
).replace(/\/$/, "");
const routes = ["/", "/services", "/transport", "/events", "/more", "/about", "/coming-soon"];
await fs.writeFile(
  "dist/robots.txt",
  `User-agent: *\nAllow: /\nDisallow: /tools/\nSitemap: ${origin}/sitemap.xml\n`,
);
await fs.writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((route) => `<url><loc>${origin}${route}</loc></url>`).join("")}</urlset>`,
);
if (await fs.stat("dist/404/index.html").catch(() => null))
  await fs.copyFile("dist/404/index.html", "dist/404.html");
const files = await fs.readdir("dist", { recursive: true });
const manifest = JSON.parse(
  await fs.readFile("dist/.vite/manifest.json", "utf8"),
);
const routeChunks = {
  "transport/index.html": "src/pages/Transport.tsx",
};
for (const file of files.filter((f) => f.endsWith(".html"))) {
  const path = `dist/${file}`;
  let html = await fs.readFile(path, "utf8");
  html = html
    .replaceAll("https://onesit.vercel.app/og.png", origin + "/og.png")
    .replace(/(<img\b[^>]*?\s)alt(?=[\s>])/g, '$1alt=""');
  const chunkKey = routeChunks[file.replaceAll("\\", "/")];
  if (chunkKey) {
    const chunk = manifest[chunkKey];
    if (!chunk) throw new Error(`Missing route chunk: ${chunkKey}`);
    const links = [
      ...(chunk.css || []).map(css => `<link rel="stylesheet" crossorigin href="/${css}">`),
      `<link rel="modulepreload" crossorigin href="/${chunk.file}">`,
    ];
    html = html.replace("</head>", links.join("") + "</head>");
  }
  await fs.writeFile(path, html);
}
const entry = Object.values(manifest).find((e) => e.isEntry);
const seen = new Set();
let js = 0,
  css = 0;
async function visit(e) {
  if (seen.has(e.file)) return;
  seen.add(e.file);
  const bytes = await fs.readFile("dist/" + e.file);
  if (e.file.endsWith(".js")) js += gzipSync(bytes).byteLength;
  for (const path of e.css || [])
    if (!seen.has(path)) {
      seen.add(path);
      css += gzipSync(await fs.readFile("dist/" + path)).byteLength;
    }
  for (const key of e.imports || []) await visit(manifest[key]);
}
await visit(entry);
const report = {
  initialJsGzip: js,
  initialCssGzip: css,
  jsBudget: 60 * 1024,
  cssBudget: 15 * 1024,
  assets: [...seen],
};
await fs.writeFile("dist/bundle-report.json", JSON.stringify(report, null, 2));
console.log(
  `Initial JS: ${(js / 1024).toFixed(1)} KiB gzip; CSS: ${(css / 1024).toFixed(1)} KiB gzip.`,
);
if (js > report.jsBudget || css > report.cssBudget)
  throw new Error("Initial bundle exceeds the agreed budget.");
