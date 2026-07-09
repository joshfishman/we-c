import { describe, it, expect } from "vitest";
import { getPage, getSettings, getOneDay } from "../../lib/content";

describe("getPage", () => {
  it("loads the home page and tags each block with a __typename", () => {
    const page = getPage("home.json");
    expect(Array.isArray(page.blocks)).toBe(true);
    expect(page.blocks.length).toBeGreaterThan(0);
    for (const block of page.blocks) {
      // Every seeded block maps to a renderer __typename.
      expect(block.__typename).toMatch(/^PageBlocks/);
    }
  });

  it("maps the hero template to PageBlocksHero", () => {
    const page = getPage("home.json");
    const hero = page.blocks.find((b: any) => b._template === "hero");
    expect(hero).toBeTruthy();
    expect(hero.__typename).toBe("PageBlocksHero");
  });
});

describe("getSettings / getOneDay", () => {
  it("reads global settings JSON", () => {
    const settings = getSettings();
    expect(settings).toBeTypeOf("object");
  });

  it("reads the One Day page with a hero section", () => {
    const oneDay = getOneDay();
    expect(oneDay.hero).toBeTypeOf("object");
    expect(oneDay.hero.headlineLine1).toBeTruthy();
  });
});
