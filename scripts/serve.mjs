import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
const root = path.resolve("dist");
const port = Number(process.env.PORT || 4400);
const config = JSON.parse(await fs.readFile("vercel.json", "utf8"));
const sharedHeaders = Object.fromEntries(
  config.headers[0].headers.map((h) => [h.key, h.value]),
);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".xml": "application/xml",
  ".txt": "text/plain",
};
http
  .createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      const candidate = path.resolve(root, "." + pathname);
      if (!candidate.startsWith(root + path.sep) && candidate !== root) {
        res.writeHead(403);
        res.end();
        return;
      }
      let file = candidate,
        status = 200;
      let stat = await fs.stat(file).catch(() => null);
      if (stat?.isDirectory()) file = path.join(file, "index.html");
      else if (!stat && !path.extname(file))
        file = path.join(file, "index.html");
      stat = await fs.stat(file).catch(() => null);
      if (!stat?.isFile()) {
        file = path.join(root, "404.html");
        status = 404;
      }
      res.writeHead(status, {
        ...sharedHeaders,
        "Content-Type": types[path.extname(file)] || "application/octet-stream",
        "Cache-Control": pathname.startsWith("/assets/")
          ? "public, max-age=31536000, immutable"
          : "public, max-age=0, must-revalidate",
      });
      res.end(await fs.readFile(file));
    } catch {
      res.writeHead(500);
      res.end("Unable to serve the page.");
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(`OneSIT production preview: http://127.0.0.1:${port}`),
  );
