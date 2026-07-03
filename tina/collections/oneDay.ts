import type { Collection } from "tinacms";

const visible = {
  type: "boolean" as const,
  name: "visible",
  label: "Visible (uncheck to hide this section)",
};

const cta = (name: string, label: string) => ({
  type: "object" as const,
  name,
  label,
  fields: [
    { type: "string" as const, name: "label", label: "Label" },
    { type: "string" as const, name: "url", label: "URL" },
  ],
});

/**
 * The "One Day" / Site Development page. A singleton document
 * (content/oneDay/index.json) with one object field per section.
 */
export const OneDayCollection: Collection = {
  name: "oneDay",
  label: "One Day Page",
  path: "content/oneDay",
  format: "json",
  ui: {
    allowedActions: { create: false, delete: false },
    router: () => "/one-day",
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
      type: "object",
      name: "hero",
      label: "Hero",
      fields: [
        visible,
        { type: "string", name: "bgVideo", label: "Background video (desktop)" },
        { type: "string", name: "bgVideoMobile", label: "Background video (mobile)" },
        { type: "image", name: "bgPoster", label: "Video poster" },
        { type: "string", name: "badge", label: "Badge" },
        { type: "string", name: "headlineLine1", label: "Headline line 1" },
        { type: "string", name: "headlineLine2", label: "Headline line 2 (italic)" },
        {
          type: "string",
          name: "subhead",
          label: "Sub-headline",
          ui: { component: "textarea" },
        },
        cta("ctaPrimary", "Primary button"),
        cta("ctaSecondary", "Secondary button"),
        {
          type: "object",
          name: "pills",
          label: "Arc pills",
          list: true,
          ui: { itemProps: (i: any) => ({ label: i?.label || "Pill" }) },
          fields: [{ type: "string", name: "label", label: "Label" }],
        },
      ],
    },
    {
      type: "object",
      name: "proof",
      label: "Proof Strip",
      fields: [
        visible,
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
      ],
    },
    {
      type: "object",
      name: "caseStudy",
      label: "Testimonial",
      fields: [
        visible,
        { type: "string", name: "eyebrow", label: "Eyebrow" },
        { type: "string", name: "metricValue", label: "Metric value (e.g. 300+%)" },
        { type: "string", name: "metricLabel", label: "Metric label" },
        { type: "string", name: "brand", label: "Brand / client" },
        { type: "string", name: "quote", label: "Quote", ui: { component: "textarea" } },
        { type: "string", name: "personName", label: "Attribution name" },
        { type: "string", name: "personTitle", label: "Attribution title" },
        { type: "image", name: "image", label: "Brand photo" },
        { type: "string", name: "imageAlt", label: "Brand photo alt" },
        { type: "image", name: "avatar", label: "Avatar photo" },
      ],
    },
    {
      type: "object",
      name: "ourWork",
      label: "Past Work",
      fields: [
        visible,
        { type: "string", name: "eyebrow", label: "Eyebrow" },
        { type: "string", name: "heading", label: "Heading" },
        {
          type: "object",
          name: "cta",
          label: "Header button",
          fields: [
            { type: "string", name: "label", label: "Label" },
            { type: "string", name: "url", label: "URL" },
          ],
        },
        {
          type: "object",
          name: "projects",
          label: "Projects",
          list: true,
          ui: { itemProps: (i: any) => ({ label: i?.title || "Project" }) },
          fields: [
            { type: "string", name: "title", label: "Title" },
            { type: "string", name: "badge", label: "Metric badge" },
            { type: "string", name: "services", label: "Services" },
            { type: "image", name: "image", label: "Image" },
            { type: "string", name: "url", label: "URL (Read more)" },
          ],
        },
      ],
    },
    {
      type: "object",
      name: "quality",
      label: "Enterprise Quality",
      fields: [
        visible,
        { type: "string", name: "eyebrow", label: "Eyebrow" },
        {
          type: "string",
          name: "heading",
          label: "Heading",
          ui: { component: "textarea" },
        },
        {
          type: "object",
          name: "cards",
          label: "Cards",
          list: true,
          ui: { itemProps: (i: any) => ({ label: i?.title || "Card" }) },
          fields: [
            { type: "string", name: "icon", label: "Icon (glyph)" },
            { type: "string", name: "title", label: "Title" },
            {
              type: "string",
              name: "body",
              label: "Body",
              ui: { component: "textarea" },
            },
          ],
        },
      ],
    },
    {
      type: "object",
      name: "process",
      label: "Process",
      fields: [
        visible,
        { type: "string", name: "eyebrow", label: "Eyebrow" },
        {
          type: "string",
          name: "heading",
          label: "Heading",
          ui: { component: "textarea" },
        },
        {
          type: "object",
          name: "steps",
          label: "Steps",
          list: true,
          ui: {
            itemProps: (i: any) => ({
              label: `${i?.no ?? ""} ${i?.title ?? "Step"}`,
            }),
          },
          fields: [
            { type: "string", name: "no", label: "Number" },
            { type: "string", name: "title", label: "Title" },
            { type: "string", name: "tag", label: "Tag (e.g. Morning)" },
            {
              type: "string",
              name: "body",
              label: "Body",
              ui: { component: "textarea" },
            },
          ],
        },
      ],
    },
    {
      type: "object",
      name: "cta",
      label: "Start CTA",
      fields: [
        visible,
        { type: "string", name: "eyebrow", label: "Eyebrow" },
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
        cta("ctaPrimary", "Primary button"),
        cta("ctaSecondary", "Secondary button"),
      ],
    },
    {
      type: "object",
      name: "footer",
      label: "Footer",
      fields: [
        { type: "string", name: "contact", label: "Contact line" },
        { type: "string", name: "copyright", label: "Copyright" },
      ],
    },
  ],
};
