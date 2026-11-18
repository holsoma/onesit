import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
for (const width of [320, 360, 430]) {
  test(`primary pages fit a ${width}px phone`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ["/", "/services", "/more", "/coming-soon"]) {
      await page.goto(route);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
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
    .getByRole("navigation", { name: "Main navigation" })
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
  await expect(page.locator(".dock-week")).toContainText("Week 12");
  await expect(page.locator(".dock-countdown-value")).toContainText("12 days");
  await page.goto("/more");
  await expect(page.locator("#date-assessment-hint")).toHaveText(
    "In use: 30 Nov 2026 (SIT)",
  );
  await page.getByLabel("Final assessment", { exact: true }).fill("2026-11-20");
  await page.getByRole("button", { name: "Save my dates" }).click();
  await expect(page.locator("#date-assessment-hint")).toHaveText(
    "In use: 20 Nov 2026 (your dates)",
  );
  await page.goto("/");
  await expect(page.locator(".dock-countdown-value")).toContainText("2 days");
});
test("Campus Dock shows one selectable countdown and remembers the choice", async ({
  page,
}) => {
  await page.clock.install({ time: new Date("2026-11-18T12:00:00+08:00") });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Your shortcuts",
  );
  await expect(
    page.getByRole("heading", { name: "What’s Happening", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".dock-countdown")).toHaveCount(1);
  await expect(page.locator(".dock-countdown-value")).toHaveText("In 12 days");
  await expect(
    page.getByRole("link", { name: "RBS Opens in a new tab", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: "Campus Map Opens in a new tab",
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByLabel("Choose countdown", { exact: true })
    .selectOption("break");
  await expect(page.locator(".dock-countdown-value")).toHaveText("In 19 days");
  await page.reload();
  await expect(
    page.getByLabel("Choose countdown", { exact: true }),
  ).toHaveValue("break");
  await expect(page.locator(".dock-countdown-value")).toHaveText("In 19 days");
  await page
    .getByLabel("Choose countdown", { exact: true })
    .selectOption("recess");
  await expect(page.locator(".dock-countdown-value")).toHaveText("In 89 days");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("Campus Dock handles extra favourites and an empty dock", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/services");
  for (const name of ["Student intranet", "Academic calendar", "ReadyTalent"]) {
    await page
      .getByRole("button", { name: `Add ${name} to favourites`, exact: true })
      .click();
  }
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Home", exact: true })
    .click();
  await expect(page.locator(".dock-shortcut")).toHaveCount(7);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto("/services");
  for (const name of [
    "IN4SIT",
    "xSiTe",
    "RBS",
    "Campus Map",
    "Student intranet",
    "Academic calendar",
    "ReadyTalent",
  ]) {
    await page
      .getByRole("button", {
        name: `Remove ${name} from favourites`,
        exact: true,
      })
      .click();
  }
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Choose your shortcuts" }),
  ).toBeVisible();
  await expect(page.locator(".dock-shortcut")).toHaveCount(0);
  await expect(page.locator(".dock-countdown")).toHaveCount(1);
});
test("newsletter catalogue keeps its sections and opens original posters", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const originals: string[] = [];
  page.on("request", request => {
    if (request.url().includes("-original.")) originals.push(request.url());
  });
  for (const route of ["/", "/events"]) {
    await page.goto(route);
    await expect(page.locator(".catalogue-entry")).toHaveCount(19);
    for (const [section, count] of [["internal", 10], ["sitequests", 1], ["external", 7], ["announcements", 1]] as const) {
      await expect(page.locator(`#catalogue-${section} article`)).toHaveCount(count);
    }
    await page.getByRole("navigation", { name: "Newsletter sections" }).getByRole("link", { name: "External events", exact: true }).click();
    await expect(page).toHaveURL(/#catalogue-external$/);
    await expect(page.getByRole("heading", { name: "External events", exact: true })).toBeInViewport();
  }
  expect(originals).toEqual([]);
  const poster = page.locator(".catalogue-poster").first();
  await poster.scrollIntoViewIfNeeded();
  await poster.focus();
  const popupPromise = page.waitForEvent("popup");
  await poster.press("Enter");
  const popup = await popupPromise;
  await popup.waitForLoadState();
  await expect(popup).toHaveURL(/01-original\.png$/);
  expect(await popup.locator("img").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await popup.close();
});

test("catalogue actions retain source URLs and open separately", async ({ page, context }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/events");
  await expect(page.locator(".catalogue-action")).toHaveCount(20);
  const entries = await page.locator(".catalogue-entry").evaluateAll(items =>
    items.map(item => [...item.querySelectorAll<HTMLAnchorElement>(".catalogue-action")].map(link => ({
      url: link.href,
      height: link.getBoundingClientRect().height,
      target: link.target,
      rel: link.rel,
    }))),
  );
  expect(entries.every(actions => actions.length > 0)).toBe(true);
  expect(entries.flat().every(action =>
    action.url.startsWith("https://") && action.height >= 44 &&
    action.target === "_blank" && action.rel.includes("noopener"),
  )).toBe(true);
  await expect(page.getByRole("link", { name: /^Expired survey link:/ })).toHaveCount(1);
  const link = page.getByRole("link", { name: /^Registration form: Deepfakes/ });
  const url = (await link.getAttribute("href"))!;
  expect(url).toMatch(/\/viewform$/);
  const methods: string[] = [];
  await context.route(url, route => {
    methods.push(route.request().method());
    return route.fulfill({ contentType: "text/html", body: "<h1>Registration destination</h1>" });
  });
  await link.focus();
  const popupPromise = page.waitForEvent("popup");
  await link.press("Enter");
  const popup = await popupPromise;
  await expect(popup).toHaveURL(url);
  await expect(popup.getByRole("heading")).toHaveText("Registration destination");
  expect(await popup.evaluate(() => window.opener === null)).toBe(true);
  expect(methods).toEqual(["GET"]);
  await popup.close();
});

test("newsletter uses inert text and exports only reviewed fields", async ({
  page,
}) => {
  await page.goto("/tools/newsletter");
  await expect(page.getByLabel("Event title", { exact: true })).toBeHidden();
  await page
    .locator(".export-list")
    .getByRole("button", { name: "Edit", exact: true })
    .first()
    .click();
  await expect(page.getByLabel("Event title", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Cancel edit" }).click();
  await page.getByLabel("Open .msg newsletter", { exact: true }).setInputFiles({
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
test("supplied newsletter is read entirely locally", async ({ page, baseURL }) => {
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
      !request.url().startsWith(new URL(baseURL!).origin) &&
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
