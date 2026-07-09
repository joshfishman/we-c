import { test, expect, Page } from "@playwright/test";

/**
 * Collect real JS/runtime errors (hydration bugs, uncaught exceptions). Ignores
 * resource-load 404s — some media (e.g. not-yet-uploaded case-study images) is a
 * content gap, not a code defect, and shouldn't fail the code suite.
 */
function trackConsoleErrors(page: Page) {
  const errors: string[] = [];
  const isResource404 = (t: string) =>
    /Failed to load resource/i.test(t) || /\b404\b/.test(t);
  page.on("console", (msg) => {
    if (msg.type() === "error" && !isResource404(msg.text())) {
      errors.push(msg.text());
    }
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

test.describe("Home (/)", () => {
  test("renders the hero, header and CTA with no console errors", async ({ page }) => {
    const errors = trackConsoleErrors(page);
    await page.goto("/");

    await expect(page.locator("#site-header")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // Logo links home.
    await expect(page.locator("#site-header a[href='/']").first()).toBeVisible();
    // At least one CTA button/link.
    await expect(page.getByRole("link", { name: /grow|work|start|build/i }).first()).toBeVisible();

    expect(errors, `console errors:\n${errors.join("\n")}`).toEqual([]);
  });

  test("hero content clears the fixed header (never behind it)", async ({ page }) => {
    await page.goto("/");
    const headerBox = await page.locator("#site-header").boundingBox();
    const h1Box = await page.getByRole("heading", { level: 1 }).boundingBox();
    expect(headerBox).not.toBeNull();
    expect(h1Box).not.toBeNull();
    // The headline starts at or below the header's bottom edge.
    expect(h1Box!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height - 1);
  });

  test("contact form has accessible fields and a submit button", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("textbox", { name: /your name/i })).toBeVisible();
    await expect(page.getByRole("textbox", { name: /email/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /send message/i })).toBeVisible();
  });

  test("read-more opens a case-study popover", async ({ page }) => {
    await page.goto("/");
    const readMore = page.getByRole("button", { name: /read more/i }).first();
    await readMore.scrollIntoViewIfNeeded();
    await readMore.click();
    await expect(page.getByText(/project details/i).first()).toBeVisible();
  });
});

test.describe("One Day (/one-day)", () => {
  test("renders the day-arc hero with no console errors", async ({ page }) => {
    const errors = trackConsoleErrors(page);
    await page.goto("/one-day");

    await expect(page.locator("#site-header")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    // Arc pills from the hero.
    await expect(page.getByText(/midday/i).first()).toBeVisible();

    expect(errors, `console errors:\n${errors.join("\n")}`).toEqual([]);
  });

  test("hero content clears the fixed header", async ({ page }) => {
    await page.goto("/one-day");
    const headerBox = await page.locator("#site-header").boundingBox();
    const h1Box = await page.getByRole("heading", { level: 1 }).boundingBox();
    expect(h1Box!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height - 1);
  });

  test("hero video is muted, inline, looping and never shows controls", async ({ page }) => {
    await page.goto("/one-day");
    const video = page.locator("video").first();
    await expect(video).toHaveCount(1);
    const attrs = await video.evaluate((el: HTMLVideoElement) => ({
      muted: el.muted,
      loop: el.loop,
      playsInline: el.playsInline,
      controls: el.controls,
      hasPoster: !!el.poster,
    }));
    expect(attrs.muted).toBe(true); // required for mobile autoplay
    expect(attrs.loop).toBe(true);
    expect(attrs.playsInline).toBe(true);
    expect(attrs.controls).toBe(false); // never a play button
    expect(attrs.hasPoster).toBe(true); // still-frame fallback on all browsers
  });

  test("header is transparent (no backing, no divider)", async ({ page }) => {
    await page.goto("/one-day");
    const header = page.locator("#site-header");
    const styles = await header.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { bg: cs.backgroundColor, border: cs.borderBottomColor, shadow: cs.boxShadow };
    });
    expect(styles.bg).toBe("rgba(0, 0, 0, 0)");
    expect(styles.border).toBe("rgba(0, 0, 0, 0)");
    expect(styles.shadow).toBe("none");
  });
});

test.describe("Responsive", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("home hero still clears the header on mobile", async ({ page }) => {
    await page.goto("/");
    const headerBox = await page.locator("#site-header").boundingBox();
    const h1Box = await page.getByRole("heading", { level: 1 }).boundingBox();
    expect(h1Box!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height - 1);
  });

  test("one-day hero still clears the header on mobile", async ({ page }) => {
    await page.goto("/one-day");
    const headerBox = await page.locator("#site-header").boundingBox();
    const h1Box = await page.getByRole("heading", { level: 1 }).boundingBox();
    expect(h1Box!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height - 1);
  });
});
