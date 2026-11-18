import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests",
  testMatch: "**/browser.spec.ts",
  use: {
    baseURL: "http://127.0.0.1:4400",
    browserName: "chromium",
    headless: true,
  },
  workers: 1,
  timeout: 90000,
  reporter: "list",
});
