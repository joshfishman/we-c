import type { Collection, Template } from "tinacms";

/**
 * Every section block carries a `visible` boolean. When false, the renderer
 * skips it — this is the "hide any section" capability from the editor.
 */
const visibleField = {
  type: "boolean" as const,
  name: "visible",
  label: "Visible (uncheck to hide this section)",
};

const withVisible = (
  t: Omit<Template, "fields"> & { fields: any[] }
): Template => ({
  ...t,
  fields: [visibleField, ...t.fields],
});

const ctaField = (name = "cta", label = "Button") => ({
  type: "object" as const,
  name,
  label,
  fields: [
    { type: "string" as const, name: "label", label: "Label" },
    { type: "string" as const, name: "url", label: "URL" },
  ],
});

const heroTemplate: Template = withVisible({
  name: "hero",
  label: "Hero",
  ui: { itemProps: () => ({ label: "● Hero" }) },
  fields: [
    {
      type: "string",
      name: "bgVideo",
      label: "Background video (desktop)",
      description: "Path to an .mp4 in /public, e.g. /media/hero-video-4.mp4",
    },
    {
      type: "string",
      name: "bgVideoMobile",
      label: "Background video (mobile)",
      description: "Optional. Falls back to the desktop video.",
    },
    { type: "image", name: "bgPoster", label: "Video poster / fallback image" },
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    { type: "string", name: "headlineLead", label: "Headline — lead" },
    {
      type: "string",
      name: "headlineAccent",
      label: "Headline — italic word",
    },
    { type: "string", name: "headlineTail", label: "Headline — tail" },
    {
      type: "string",
      name: "subhead",
      label: "Sub-headline",
      ui: { component: "textarea" },
    },
    ctaField("ctaPrimary", "Primary button (Let's Grow)"),
    ctaField("ctaSecondary", "Secondary button (See Our Work)"),
    {
      type: "object",
      name: "callout",
      label: "Side callout (AI-powered)",
      fields: [
        { type: "string", name: "eyebrow", label: "Eyebrow" },
        { type: "string", name: "text", label: "Text" },
        { type: "string", name: "url", label: "URL" },
      ],
    },
  ],
});

const proofTemplate: Template = withVisible({
  name: "proof",
  label: "Proof Bar",
  ui: { itemProps: () => ({ label: "● Proof Bar" }) },
  fields: [
    {
      type: "object",
      name: "intro",
      label: "Intro cell",
      fields: [
        { type: "string", name: "title", label: "Title (e.g. Since 2012)" },
        { type: "string", name: "subtitle", label: "Subtitle" },
      ],
    },
    {
      type: "object",
      name: "stats",
      label: "Stats",
      list: true,
      ui: { itemProps: (i: any) => ({ label: i?.value || "Stat" }) },
      fields: [
        { type: "string", name: "value", label: "Value (e.g. 77+)" },
        { type: "string", name: "label", label: "Label" },
      ],
    },
  ],
});

const caseStudyTemplate: Template = withVisible({
  name: "caseStudy",
  label: "Social Proof",
  ui: { itemProps: () => ({ label: "● Social Proof" }) },
  fields: [
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    { type: "string", name: "metricValue", label: "Metric value (e.g. 300%)" },
    { type: "string", name: "metricLabel", label: "Metric label" },
    { type: "string", name: "brand", label: "Brand / client" },
    {
      type: "string",
      name: "quote",
      label: "Quote",
      ui: { component: "textarea" },
    },
    { type: "string", name: "personName", label: "Attribution name" },
    { type: "string", name: "personTitle", label: "Attribution title" },
    { type: "image", name: "image", label: "Brand photo" },
    { type: "string", name: "imageAlt", label: "Brand photo alt" },
    { type: "image", name: "avatar", label: "Avatar photo" },
  ],
});

const frameworkTemplate: Template = withVisible({
  name: "framework",
  label: "Services Framework",
  ui: { itemProps: () => ({ label: "● Services Framework" }) },
  fields: [
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: { component: "textarea" },
    },
    { type: "string", name: "flowIntro", label: "Flow intro label" },
    {
      type: "object",
      name: "layers",
      label: "Layers",
      list: true,
      ui: {
        itemProps: (i: any) => ({
          label: `${i?.no ?? ""} ${i?.title ?? "Layer"}`,
        }),
      },
      fields: [
        { type: "string", name: "no", label: "Number (e.g. 01)" },
        { type: "string", name: "title", label: "Title" },
        { type: "string", name: "badge", label: "Badge (e.g. Organic & Paid)" },
        {
          type: "string",
          name: "description",
          label: "Description",
          ui: { component: "textarea" },
        },
        { type: "string", name: "tags", label: "Tags", list: true },
      ],
    },
  ],
});

const ourWorkTemplate: Template = withVisible({
  name: "ourWork",
  label: "Our Work",
  ui: { itemProps: () => ({ label: "● Our Work" }) },
  fields: [
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    { type: "string", name: "heading", label: "Heading" },
    ctaField("cta", "Header button"),
    {
      type: "object",
      name: "projects",
      label: "Projects",
      list: true,
      ui: { itemProps: (i: any) => ({ label: i?.title || "Project" }) },
      fields: [
        { type: "string", name: "title", label: "Title" },
        { type: "string", name: "badge", label: "Metric badge (e.g. 3× revenue · 6 mo)" },
        { type: "string", name: "services", label: "Services" },
        { type: "image", name: "image", label: "Image (single)" },
        {
          type: "image",
          name: "images",
          label: "Images (2+ to fan out, overrides single)",
          list: true,
        },
        {
          type: "rich-text",
          name: "caseBody",
          label: "Read more (case study — WYSIWYG)",
        },
        { type: "string", name: "url", label: "URL (Read more)" },
      ],
    },
  ],
});

const approachTemplate: Template = withVisible({
  name: "approach",
  label: "Approach (Human + AI)",
  ui: { itemProps: () => ({ label: "● Approach (Human + AI)" }) },
  fields: [
    { type: "string", name: "leftEyebrow", label: "Left — eyebrow" },
    { type: "string", name: "leftHeading", label: "Left — heading" },
    {
      type: "string",
      name: "leftBody",
      label: "Left — body",
      ui: { component: "textarea" },
    },
    { type: "string", name: "rightEyebrow", label: "Right — eyebrow" },
    { type: "string", name: "rightHeading", label: "Right — heading" },
    {
      type: "string",
      name: "rightBody",
      label: "Right — body",
      ui: { component: "textarea" },
    },
  ],
});

const builtInADayTemplate: Template = withVisible({
  name: "builtInADay",
  label: "Built In A Day",
  ui: { itemProps: () => ({ label: "● Built In A Day" }) },
  fields: [
    { type: "string", name: "eyebrow", label: "Eyebrow" },
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: { component: "textarea" },
    },
    {
      type: "object",
      name: "stats",
      label: "Stats",
      list: true,
      ui: { itemProps: (i: any) => ({ label: i?.value || "Stat" }) },
      fields: [
        { type: "string", name: "value", label: "Value" },
        { type: "string", name: "label", label: "Label" },
      ],
    },
    ctaField("cta", "Link text + URL"),
  ],
});

const ctaTemplate: Template = withVisible({
  name: "ctaSection",
  label: "CTA / Contact",
  ui: { itemProps: () => ({ label: "● CTA / Contact" }) },
  fields: [
    {
      type: "string",
      name: "theme",
      label: "Footer theme",
      options: ["dusk", "forest"],
    },
    {
      type: "string",
      name: "heading",
      label: "Heading",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "body",
      label: "Body",
      ui: { component: "textarea" },
    },
    ctaField("cta", "Button"),
    { type: "string", name: "email", label: "Email" },
    { type: "string", name: "phone", label: "Phone" },
    {
      type: "string",
      name: "studio",
      label: "Studio address lines",
      list: true,
    },
  ],
});

export const PageCollection: Collection = {
  name: "page",
  label: "Pages",
  path: "content/page",
  format: "json",
  ui: {
    router: ({ document }) => {
      if (document._sys.filename === "home") return "/";
      return `/${document._sys.filename}`;
    },
  },
  fields: [
    { type: "string", name: "title", label: "Page title (SEO)" },
    {
      type: "string",
      name: "description",
      label: "Meta description (SEO)",
      ui: { component: "textarea" },
    },
    {
      type: "string",
      name: "theme",
      label: "Color theme",
      description:
        "Re-skins the whole page. Every section reads the theme tokens.",
      options: ["forest", "sunset"],
    },
    {
      type: "object",
      name: "blocks",
      label: "Sections",
      list: true,
      templates: [
        heroTemplate,
        proofTemplate,
        caseStudyTemplate,
        frameworkTemplate,
        ourWorkTemplate,
        approachTemplate,
        builtInADayTemplate,
        ctaTemplate,
      ],
    },
  ],
};
