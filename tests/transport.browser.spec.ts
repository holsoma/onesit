import { test, expect } from "@playwright/test";
const endpoint = "https://arrivelah2.busrouter.sg/?id=69009";
const epoch = Date.parse("2026-11-18T12:00:00+08:00");
const fixture = {
  services: [{ no: "34", next: { time: new Date(epoch + 45_000).toISOString(), monitored: 0 }, next2: { time: new Date(epoch + 270_000).toISOString(), monitored: 1 }, next3: { time: new Date(epoch + 601_000).toISOString(), monitored: 0 } }],
};
const headers = { "access-control-allow-origin": "*" };

test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date(epoch) });
  await page.route(endpoint, route => route.fulfill({ json: fixture, headers }));
});

test("transport fits phones, shows real estimate types and has keyboard-operable MRT tabs", async ({ page }) => {
  const html = await (await page.request.get("/transport")).text();
  expect(html).toMatch(/rel="stylesheet"[^>]+Transport-[^>]+\.css/);
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/transport");
    await expect(page.locator(".bus-times").first()).toContainText("Arriving");
    await expect(page.locator(".bus-times").first()).toContainText("4 min");
    await expect(page.locator(".bus-times").first()).toContainText("Scheduled");
    await expect(page.locator(".bus-times").first()).toContainText("Estimated");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole("tab", { name: "Bus arrivals" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { name: "MRT timings" })).toBeFocused();
    await expect(page.getByRole("tab", { name: "MRT timings" })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("table")).toContainText("05:39");
    await expect(page.getByRole("table")).toContainText("05:59");
    await expect(page.getByRole("table")).toContainText("23:25");
    await expect(page.getByRole("tabpanel", { name: "MRT timings" })).toContainText("Live MRT arrival countdowns are not available");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test("polling pauses on the MRT tab, when hidden and after navigating away", async ({ page }) => {
  let requests = 0;
  await page.route(endpoint, route => { requests++; return route.fulfill({ json: fixture, headers }); });
  await page.goto("/transport");
  await expect(page.locator(".bus-times")).toHaveCount(1);
  expect(requests).toBe(1);
  await page.clock.runFor(31_000);
  await expect.poll(() => requests).toBe(2);
  await page.getByRole("tab", { name: "MRT timings" }).click();
  await page.clock.runFor(65_000);
  expect(requests).toBe(2);
  await page.getByRole("tab", { name: "Bus arrivals" }).click();
  await expect.poll(() => requests).toBe(3);
  await expect(page.getByRole("button", { name: "Refresh bus arrivals" })).toBeEnabled();
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.clock.runFor(65_000);
  expect(requests).toBe(3);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: false });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect.poll(() => requests).toBe(4);
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Home", exact: true }).click();
  await page.clock.runFor(65_000);
  expect(requests).toBe(4);
});

test("unavailable and stale feeds do not invent departure times", async ({ page, context }) => {
  await page.goto("/transport");
  await expect(page.locator(".bus-times")).toHaveCount(1);
  await context.setOffline(true);
  await expect(page.locator(".transport-notice").first()).toContainText("offline");
  await page.clock.runFor(95_000);
  await expect(page.locator(".bus-times")).toHaveCount(0);
  await expect(page.locator(".bus-no-times").first()).toHaveText("Refresh for current times");
  await context.setOffline(false);
  await expect(page.locator(".transport-update")).toContainText("Updated");
  await page.route(endpoint, route => route.fulfill({ status: 503, body: "Unavailable", headers }));
  await page.getByRole("button", { name: "Refresh bus arrivals" }).click();
  await expect(page.locator(".transport-notice").first()).toContainText("could not be refreshed");
  await page.route(endpoint, route => route.fulfill({ json: { services: [] }, headers }));
  await page.getByRole("button", { name: "Refresh bus arrivals" }).click();
  await expect(page.locator(".bus-times")).toHaveCount(0);
  await expect(page.locator(".bus-no-times").first()).toHaveText("No estimates available");
});

test("transport can be favourited and opens inside OneSIT without background polling on Home", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", request => { if (request.url().includes("arrivelah2")) requests.push(request.url()); });
  await page.goto("/services");
  await expect(page.locator(".service-soon").filter({hasText:"Punggol transport"})).toHaveCount(0);
  await page.getByRole("button", { name: "Add Punggol transport to favourites", exact: true }).click();
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Home", exact: true }).click();
  const link = page.getByRole("link", { name: "Punggol transport", exact: true });
  await expect(link).not.toHaveAttribute("target", "_blank");
  expect(requests).toEqual([]);
  await link.click();
  await expect(page).toHaveURL(/\/transport$/);
  await expect(page.locator(".bus-times")).toHaveCount(1);
  expect(requests).toHaveLength(1);
});
