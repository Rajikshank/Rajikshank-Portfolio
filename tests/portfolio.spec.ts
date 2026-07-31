import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/work/",
  "/work/opengraph-creator/",
  "/work/gizume/",
  "/work/hive-hub/",
  "/notes/",
  "/notes/durable-agent-studio-workflows/",
  "/about/",
];

test.describe("portfolio routes", () => {
  for (const route of routes) {
    test(`${route} renders useful static content without runtime errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      page.on("pageerror", (error) => errors.push(error.message));

      const response = await page.goto(route);
      expect(response?.ok()).toBeTruthy();
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("h1")).toBeVisible();
      expect(await page.locator("h1").innerText()).not.toHaveLength(0);
      expect(errors).toEqual([]);
    });
  }
});

test("home matches the approved information architecture", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Krishnakumar Rajikshan", level: 1 }),
  ).toBeVisible();
  await expect(page.locator(".project-row")).toHaveCount(3);
  await expect(page.locator(".project-image img")).toHaveCount(3);
  await expect(page.locator(".github-card")).toBeVisible();
  await expect(page.locator(".activity-rhythm span")).toHaveCount(84);
  await expect(page.locator(".note-row")).toHaveCount(3);
  await expect(page.getByRole("heading", { name: "Projects", level: 2 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "GitHub", level: 2 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Blog", level: 2 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "About", level: 2 })).toBeVisible();
  await expect(page.getByText("Selected work", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Field notes", { exact: true })).toHaveCount(0);
  await expect(page.getByText("NOW", { exact: true })).toHaveCount(0);
  await expect(page.getByText("RSS", { exact: true })).toHaveCount(0);
  await expect(page.locator(".intro-links svg")).toHaveCount(4);
  await expect(page.locator(".section-icon svg")).toHaveCount(4);
  await expect(page.locator(".maker-glyph")).toHaveCount(1);
  await expect(page.locator(".intro-link-icon")).toHaveCount(4);
  await expect(page.locator(".project-browser")).toHaveCount(3);
  await expect(page.locator(".activity-total")).toContainText("contributions");

  const unloadedImages = await page.locator("img").evaluateAll((images) =>
    images.filter(
      (image) =>
        !(image as HTMLImageElement).complete ||
        (image as HTMLImageElement).naturalWidth === 0,
    ).length,
  );
  expect(unloadedImages).toBe(0);
});

test("approved typography and compact project proportions are preserved", async ({ page }) => {
  await page.goto("/");
  const geometry = await page.evaluate(() => {
    const heading = document.querySelector<HTMLElement>(".intro h1");
    const thumbnail = document.querySelector<HTMLElement>(".project-image");
    const headingStyle = heading ? getComputedStyle(heading) : null;
    const thumbnailBox = thumbnail?.getBoundingClientRect();
    return {
      viewport: window.innerWidth,
      headingSize: headingStyle ? Number.parseFloat(headingStyle.fontSize) : 0,
      headingFont: headingStyle?.fontFamily ?? "",
      thumbnailWidth: thumbnailBox?.width ?? 0,
      thumbnailHeight: thumbnailBox?.height ?? 0,
    };
  });

  expect(geometry.headingFont).toContain("Fraunces");
  expect(geometry.headingSize).toBeLessThanOrEqual(
    geometry.viewport <= 580 ? 50 : 65,
  );
  if (geometry.viewport > 760) {
    expect(geometry.thumbnailWidth).toBeLessThanOrEqual(320);
    expect(geometry.thumbnailHeight).toBeLessThanOrEqual(220);
  }
});

test("hero name animation keeps a stable accessible name and final text", async ({ page }) => {
  await page.addInitScript(() => sessionStorage.removeItem("portfolio-intro-played"));
  await page.goto("/");
  const heading = page.getByRole("heading", {
    name: "Krishnakumar Rajikshan",
    level: 1,
  });
  await expect(heading).toBeVisible();
  await expect(page.locator('[data-scramble=""]')).toHaveCount(2);
  await expect(page.locator('[data-final="Krishnakumar"]')).toHaveText("Krishnakumar", {
    timeout: 3000,
  });
  await expect(page.locator('[data-final="Rajikshan"]')).toHaveText("Rajikshan", {
    timeout: 3000,
  });
  await expect(page.locator("html")).toHaveAttribute("data-hero-ready", "true", {
    timeout: 3000,
  });
});

test("site loads the full Fraunces axes and real italic face", async ({ page }) => {
  await page.goto("/");
  const typography = await page.evaluate(async () => {
    await document.fonts.ready;
    const normal = getComputedStyle(document.querySelector<HTMLElement>(".intro h1")!);
    const italic = getComputedStyle(
      document.querySelector<HTMLElement>(".name-word-accent")!,
    );
    const body = getComputedStyle(document.body);
    return {
      normalFamily: normal.fontFamily,
      normalVariation: normal.fontVariationSettings,
      italicStyle: italic.fontStyle,
      italicVariation: italic.fontVariationSettings,
      bodyFamily: body.fontFamily,
    };
  });

  expect(typography.normalFamily).toContain("Fraunces");
  expect(typography.normalVariation).toContain("opsz");
  expect(typography.normalVariation).toContain("SOFT");
  expect(typography.italicStyle).toBe("italic");
  expect(typography.italicVariation).toContain("opsz");
  expect(typography.bodyFamily).toContain("Manrope");
});

test("theme control changes theme, label, and persists after reload", async ({ page }) => {
  await page.goto("/");
  const toggle = page.locator("[data-theme-toggle]");
  await expect(toggle).toHaveCount(1);
  const initial = await page.locator("html").getAttribute("data-theme");
  await toggle.click();
  const next = initial === "light" ? "dark" : "light";
  await expect(page.locator("html")).toHaveAttribute("data-theme", next);
  await expect(toggle).toHaveAttribute(
    "aria-label",
    next === "light" ? "Switch to dark theme" : "Switch to light theme",
  );
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", next);
});

test("home has no horizontal overflow and keeps controls usable", async ({ page }) => {
  await page.goto("/");
  const geometry = await page.evaluate(() => ({
    viewport: window.innerWidth,
    page: document.documentElement.scrollWidth,
    buttons: [
      ...document.querySelectorAll<HTMLElement>(".action-button, .theme-toggle"),
    ].map((item) => ({
      width: item.getBoundingClientRect().width,
      height: item.getBoundingClientRect().height,
    })),
  }));
  expect(geometry.page).toBeLessThanOrEqual(geometry.viewport);
  for (const button of geometry.buttons) {
    expect(button.height).toBeGreaterThanOrEqual(40);
    expect(button.width).toBeGreaterThanOrEqual(40);
  }
});

test("routes publish the confirmed social preview metadata", async ({ page, request }) => {
  const expectedImages = new Map([
    ["/", "/og/home.png"],
    ["/work/", "/og/work.png"],
    ["/notes/", "/og/notes.png"],
    ["/notes/durable-agent-studio-workflows/", "/og/notes.png"],
    ["/about/", "/og/about.png"],
  ]);

  for (const [route, expectedPath] of expectedImages) {
    await page.goto(route);
    const openGraphImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");
    const twitterImage = await page
      .locator('meta[name="twitter:image"]')
      .getAttribute("content");

    expect(new URL(openGraphImage ?? "").pathname).toBe(expectedPath);
    expect(new URL(twitterImage ?? "").pathname).toBe(expectedPath);
    expect((await request.get(expectedPath)).ok()).toBeTruthy();
  }
});

test("pages have no serious or critical automated accessibility violations", async ({
  page,
}) => {
  for (const route of [
    "/",
    "/work/opengraph-creator/",
    "/notes/durable-agent-studio-workflows/",
    "/about/",
  ]) {
    for (const theme of ["dark", "light"]) {
      await page.goto(route);
      await page.evaluate((value) => {
        localStorage.setItem("portfolio-theme", value);
      }, theme);
      await page.reload();
      const results = await new AxeBuilder({ page }).analyze();
      const severe = results.violations.filter(
        (item) => item.impact === "serious" || item.impact === "critical",
      );
      expect(
        severe,
        `${route} (${theme}): ${severe.map((item) => item.id).join(", ")}`,
      ).toEqual([]);
    }
  }
});
