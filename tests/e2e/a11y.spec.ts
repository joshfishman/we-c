import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Accessibility gate: axe-core scans against WCAG 2.0/2.1 A & AA. We fail the
 * build on any serious or critical violation (moderate/minor are reported but
 * don't block).
 */
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

for (const path of ["/", "/one-day"]) {
  test(`${path} has no serious or critical a11y violations`, async ({ page }) => {
    await page.goto(path);
    // Let the hero/arc settle.
    await page.getByRole("heading", { level: 1 }).first().waitFor();

    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();

    const blocking = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical"
    );

    // Human-readable failure output.
    const report = blocking
      .map(
        (v) =>
          `[${v.impact}] ${v.id}: ${v.help}\n  ${v.nodes
            .map((n) => n.target.join(" "))
            .join("\n  ")}`
      )
      .join("\n\n");

    expect(blocking, `\n${report}`).toEqual([]);
  });
}

/**
 * The quiz is a modal, so it only exists once opened — the page scans above
 * never see it. Scan it at each shape it takes.
 */
test("lead quiz modal has no serious or critical a11y violations", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("header button").first().click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor();

  const scan = async (label: string) => {
    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    const blocking = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical"
    );
    const report = blocking
      .map((v) => `[${v.impact}] ${v.id}: ${v.help}`)
      .join("\n");
    expect(blocking, `${label}\n${report}`).toEqual([]);
  };

  await scan("first question");
  await dialog.getByText("Both", { exact: true }).click();
  await dialog.getByRole("button", { name: /Next/ }).click();
  await scan("branched question");
});
