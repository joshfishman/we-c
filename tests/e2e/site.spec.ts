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

/**
 * The One Day hero background must never leave a hole or offer a play button:
 * it plays muted+inline, and when the media can't play the poster still frame
 * carries the section instead.
 */
test.describe("Hero background video", () => {
  test("autoplays muted and inline, with no play button", async ({ page }) => {
    await page.goto("/one-day");
    const state = await page.evaluate(async () => {
      const v = document.querySelector("video");
      if (!v) return null;
      await new Promise((r) => setTimeout(r, 1500));
      return {
        playing: !v.paused && v.currentTime > 0,
        muted: v.muted,
        loop: v.loop,
        controls: v.controls,
        playsInline: v.playsInline,
        hasPoster: !!v.poster,
      };
    });
    expect(state).not.toBeNull();
    expect(state!.muted).toBe(true);
    expect(state!.loop).toBe(true);
    expect(state!.playsInline).toBe(true);
    expect(state!.controls).toBe(false); // no play button, ever
    expect(state!.hasPoster).toBe(true);
    expect(state!.playing).toBe(true);
  });

  test("falls back to the poster image when the video cannot play", async ({
    page,
  }) => {
    await page.route("**/*.mp4", (r) => r.fulfill({ status: 404, body: "" }));
    await page.goto("/one-day");
    const poster = await page.evaluate(() => {
      const img = [...document.querySelectorAll("img")].find((i) =>
        /sky-poster/.test(i.currentSrc || i.src)
      );
      if (!img) return null;
      const r = img.getBoundingClientRect();
      return { loaded: img.complete && img.naturalWidth > 0, w: r.width, h: r.height };
    });
    expect(poster).not.toBeNull();
    expect(poster!.loaded).toBe(true); // a real still frame is on screen
    expect(poster!.w).toBeGreaterThan(200);
    expect(poster!.h).toBeGreaterThan(200);
    // and still no controls to click
    expect(await page.evaluate(() => document.querySelector("video")?.controls ?? false)).toBe(false);
  });
});

/**
 * Lead quiz — the qualifying funnel behind the header CTA.
 *
 * The a11y rules here are the load-bearing ones (WCAG 3.2.2 on-input, 3.3.7
 * redundant entry, and the APG dialog pattern's focus contract); the axe scan
 * lives in a11y.spec.ts.
 */
test.describe("Lead quiz", () => {
  /** Opens the quiz and returns the dialog. Every locator is scoped to it:
   *  unscoped, /Next/ also matches Next.js's own dev-tools button when the
   *  suite attaches to a running dev server. */
  const openQuiz = async (page: Page) => {
    await page.goto("/");
    await page.locator("header button", { hasText: "Let's Grow" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.waitFor();
    return dialog;
  };

  test("the header CTA opens it as a dialog", async ({ page }) => {
    const dialog = await openQuiz(page);
    await expect(dialog).toBeVisible();
    // Labelled, and themed — it portals to <body>, outside the themed root.
    await expect(dialog).toHaveAttribute("aria-labelledby", /.+/);
    await expect(dialog).toHaveAttribute("data-theme", "sunset");
    // No intro panel: it opens on question one, with the intro line above it.
    await expect(dialog.getByRole("button", { name: "Start" })).toHaveCount(0);
    await expect(dialog.locator('[class*="progressText"]')).toHaveText(/^Step 1 of/);
  });

  test("selecting an answer never auto-advances (WCAG 3.2.2)", async ({
    page,
  }) => {
    const dialog = await openQuiz(page);
    const step = dialog.locator('[class*="progressText"]');
    await expect(step).toHaveText(/^Step 1 of/);
    await dialog.getByText("Digital Marketing", { exact: true }).click();
    // Still on step 1: choosing must not change context on its own. (The total
    // does move — picking a service adds its branch question — so this asserts
    // the step number, not the whole label.)
    await expect(step).toHaveText(/^Step 1 of/);
    await expect(dialog.getByRole("button", { name: /Next/ })).toBeVisible();
  });

  test("Back keeps the answers already given (WCAG 3.3.7)", async ({ page }) => {
    const dialog = await openQuiz(page);
    await dialog.getByText("Digital Marketing", { exact: true }).click();
    await dialog.getByRole("button", { name: /Next/ }).click();
    await dialog.getByText("Paid acquisition").click();
    await dialog.getByText("SEO & organic").click();
    await dialog.getByRole("button", { name: /Next/ }).click();
    await dialog.getByRole("button", { name: /Back/ }).click();

    const checked = dialog.locator("input:checked");
    await expect(checked).toHaveCount(2);
  });

  test("an unanswered step is blocked with an error", async ({ page }) => {
    const dialog = await openQuiz(page);
    const step = dialog.locator('[class*="progressText"]');
    await dialog.getByRole("button", { name: /Next/ }).click();
    await expect(step).toHaveText(/^Step 1 of/);
    await expect(dialog.getByRole("alert")).toBeVisible();
  });

  test("the service split drives which questions get asked", async ({ page }) => {
    const dialog = await openQuiz(page);

    // "Both" costs one extra question, not a second track.
    await dialog.getByText("Both", { exact: true }).click();
    const both = await dialog.locator('[class*="progressText"]').textContent();
    await dialog.getByText("Digital Marketing", { exact: true }).click();
    const marketing = await dialog.locator('[class*="progressText"]').textContent();
    expect(both).not.toBe(marketing); // the total shrinks back

    // Marketing-only never sees the site-development question.
    await dialog.getByRole("button", { name: /Next/ }).click();
    await expect(
      dialog.getByRole("heading", { name: /matter most right now/i })
    ).toBeVisible();
  });

  test("Esc closes it and returns focus to the button that opened it", async ({
    page,
  }) => {
    await openQuiz(page);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    const focused = await page.evaluate(
      () => document.activeElement?.textContent?.trim() ?? ""
    );
    expect(focused).toContain("Let's Grow");
  });
});
