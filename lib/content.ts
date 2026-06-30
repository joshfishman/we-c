import fs from "fs";
import path from "path";

/**
 * Static content loaders — read the committed JSON directly so the public site
 * renders with no backend/database (deploys anywhere, zero config).
 *
 * Tina still owns the schema and writes these same files during local editing
 * (`npm run dev` → /admin); to enable a hosted editor later, wire the
 * self-hosted backend env and swap these reads back to the Tina client.
 */

const TEMPLATE_TO_TYPENAME: Record<string, string> = {
  hero: "PageBlocksHero",
  proof: "PageBlocksProof",
  caseStudy: "PageBlocksCaseStudy",
  framework: "PageBlocksFramework",
  ourWork: "PageBlocksOurWork",
  approach: "PageBlocksApproach",
  builtInADay: "PageBlocksBuiltInADay",
  ctaSection: "PageBlocksCtaSection",
};

function readJSON(relPath: string) {
  const full = path.join(process.cwd(), "content", relPath);
  return JSON.parse(fs.readFileSync(full, "utf8"));
}

/** A page with its blocks tagged with the __typename the renderer switches on. */
export function getPage(file: string) {
  const data = readJSON(`page/${file}`);
  data.blocks = (data.blocks || []).map((b: any) => ({
    ...b,
    __typename: TEMPLATE_TO_TYPENAME[b._template] || "",
  }));
  return data;
}

export function getSettings() {
  return readJSON("settings/global.json");
}

export function getOneDay() {
  return readJSON("oneDay/index.json");
}
