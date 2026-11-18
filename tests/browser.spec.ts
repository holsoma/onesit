import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
for (const width of [320, 360, 430]) {
  test(`primary pages fit a ${width}px phone`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ['/', '/services', '/more', '/coming-soon']) {
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      await expect(page.getByRole('navigation')).toBeVisible();
    }
  });
}
test("mobile services retain icons, disabled state and favourites", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const requests: string[] = [];
  page.on("request", (r) => requests.push(r.url()));
  await page.goto("/services");
  await expect(
    page.getByRole("heading", { name: "Campus, connected." }),
  ).toBeVisible();
  const cates = page
    .locator(".service-soon")
    .filter({ has: page.getByRole("heading", { name: "Cates", exact: true }) });
  await expect(cates).toContainText("Coming soon");
  await cates.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      cates
        .locator("img")
        .evaluate(
          (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
        ),
    )
    .toBe(true);
  expect(
    await cates
      .locator("img")
      .evaluate((image) => getComputedStyle(image).filter),
  ).toBe("grayscale(1)");
  await expect(cates.getByRole("link")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Add ReadyTalent to favourites", exact: true })
    .click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Home", exact: true })
    .click();
  await expect(
    page.getByRole("link", { name: /ReadyTalent.*Opens in a new tab/ }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("link", { name: /ReadyTalent.*Opens in a new tab/ }),
  ).toBeVisible();
  expect(requests.some((url) => url.includes("newsletter.worker"))).toBe(false);
  expect(requests.some((url) => url.startsWith("https://"))).toBe(false);
});
test("dates are calculated in Singapore time and overrides persist", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-11-18T12:00:00+08:00") });
  await page.goto("/");
  await expect(page.locator(".week-number")).toContainText("12");
  await expect(
    page.locator(".countdown").filter({ hasText: "Final assessment" }),
  ).toContainText("12 days");
  await page.goto("/more");
  await page.getByLabel("Final assessment", { exact: true }).fill("2026-11-20");
  await page.getByRole("button", { name: "Save my dates" }).click();
  await page.goto("/");
  await expect(
    page.locator(".countdown").filter({ hasText: "Final assessment" }),
  ).toContainText("2 days");
});
test("newsletter uses inert text and exports only reviewed fields", async ({
  page,
}) => {
  await page.goto("/tools/newsletter");
  await page
    .getByLabel("Open .msg newsletter", { exact: true })
    .setInputFiles({
      name: "bad.msg",
      mimeType: "application/octet-stream",
      buffer: Buffer.from("not an email"),
    });
  await expect(page.getByRole("alert")).toContainText("not a supported");
  const input = [
    {
      id: "test",
      title: "Test event",
      summary: "Public summary",
      organiser: "Test organiser",
      category: "Campus",
      start: "2026-12-01T10:00:00+08:00",
      end: "2026-12-01T12:00:00+08:00",
      venue: "Campus",
      url: "https://example.com/event",
      sourceLabel: "Public source",
      verifiedAt: "2026-11-18",
      recipients: ["private@example.com"],
    },
  ];
  await page
    .getByLabel("Load existing event file", { exact: true })
    .setInputFiles({
      name: "events.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(input)),
    });
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export events" }).click();
  const file = await download;
  const exported = JSON.parse(await fs.readFile((await file.path())!, "utf8"));
  expect(exported[0].recipients).toBeUndefined();
  expect(exported[0].title).toBe("Test event");
});
test("supplied newsletter is read entirely locally", async ({ page }) => {
  const directory = process.env.ONESIT_PRIVATE_MSG_DIR;
  test.skip(
    !directory,
    "Private newsletter test runs only when explicitly configured locally.",
  );
  const names = await fs.readdir(directory!);
  const file = names.find(
    (n) => n.startsWith("[For Information]") && n.endsWith(".msg"),
  )!;
  const external: string[] = [];
  page.on("request", (request) => {
    if (
      !request.url().startsWith("http://127.0.0.1:4400") &&
      !request.url().startsWith("blob:")
    )
      external.push(request.url());
  });
  await page.goto("/tools/newsletter");
  await page
    .getByLabel("Open .msg newsletter", { exact: true })
    .setInputFiles(path.join(directory!, file));
  await expect(
    page.getByText("Newsletter opened on this device.", { exact: false }),
  ).toBeVisible({ timeout: 60000 });
  await expect(page.locator(".email-text")).toContainText(
    "SINGAPORE COMIC CON",
  );
  await expect(page.getByRole("alert")).toHaveCount(0);
  expect(external).toEqual([]);
});
