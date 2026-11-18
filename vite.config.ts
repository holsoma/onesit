import preact from "@preact/preset-vite";
import { defineConfig } from "vite";
export default defineConfig({
  plugins: [
    preact({
      prerender: {
        enabled: true,
        renderTarget: "#app",
        additionalPrerenderRoutes: [
          "/services",
          "/transport",
          "/events",
          "/more",
          "/about",
          "/coming-soon",
          "/tools/newsletter",
          "/404",
        ],
        previewMiddlewareEnabled: true,
        previewMiddlewareFallback: "/404",
      },
    }),
  ],
  build: { manifest: true },
  server: { host: "127.0.0.1" },
  resolve: { alias: { string_decoder: "string_decoder/" } },
});
