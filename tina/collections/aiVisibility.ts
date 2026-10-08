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

const textarea = { component: "textarea" as const };

const iconSetOptions = [
  { value: "ai", label: "AI assistants (ChatGPT, Gemini, Perplexity, Claude)" },
  { value: "news", label: "News (Google News, FOX, Apple News)" },
  { value: "media", label: "Video & audio (YouTube, Spotify, Apple Podcasts)" },
  { value: "social", label: "Social (Facebook, Instagram, LinkedIn, TikTok, Pinterest)" },
  { value: "blog", label: "Blog & infographics" },
  { value: "report", label: "Reporting" },
];

/**
 * The AI Visibility page (/ai-visibility). The landing page the AI Visibility
 * outreach emails link to. A singleton document
 * (content/aiVisibility/index.json) with one object field per section.
 */
export const AiVisibilityCollection: Collection = {
  name: "aiVisibility",
  label: "AI Visibility Page",
  path: "content/aiVisibility",
  format: "json",
  ui: {
    allowedActions: { create: false, delete: false },
    router: () => "/ai-visibility",
  },
  fields: [
    { type: "string", name: "title", label: "Page title (SEO)" },
    {
      type: "string",
      name: "description",
      label: "Meta description (SEO)",
      ui: textarea,
    },
    {
      type: "object",
      name: "hero",
      label: "Hero",
      fields: [
        visible,
        { type: "image", name: "bgImage", label: "Background image" },
        {
          type: "string",
          name: "headlineLine1Accent",
          label: "Headline line 1, gradient words",
          description:
            "Leads the line in the sunset gradient. Leave empty for no accent.",
        },
        {
          type: "string",
          name: "headlineLine1",
          label: "Headline line 1",
          description:
            "Wrap words in *asterisks* to highlight them. A standalone WE shows as the logo.",
        },
        {
          type: "string",
          name: "headlineLine2Accent",
          label: "Headline line 2, gradient words",
        },
        {
          type: "string",
          name: "headlineLine2",
          label: "Headline line 2",
          description:
            "Wrap words in *asterisks* to highlight them. A standalone WE shows as the logo.",
        },
        { type: "string", name: "subhead", label: "Sub-headline", ui: textarea },
        cta("ctaPrimary", "Primary button"),
        cta("ctaSecondary", "Secondary button"),
      ],
    },
    {
      type: "object",
      name: "proof",
      label: "Stats strip",
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
      name: "problem",
      label: "The problem (AI answer example)",
      fields: [
        visible,
        { type: "string", name: "eyebrow", label: "Eyebrow" },
        { type: "string", name: "heading", label: "Heading" },
        { type: "string", name: "body", label: "Body", ui: textarea },
        {
          type: "string",
          name: "prompt",
          label: "Example question asked to the AI",
        },
        {
          type: "string",
          name: "answerIntro",
          label: "Example AI answer, opening line",
          ui: textarea,
        },
        {
          type: "object",
          name: "answers",
          label: "Businesses the AI recommends",
          list: true,
          ui: { itemProps: (i: any) => ({ label: i?.name || "Business" }) },
          fields: [
            { type: "string", name: "name", label: "Name" },
            { type: "string", name: "note", label: "Note (e.g. rating)" },
          ],
        },
        {
          type: "string",
          name: "missingLabel",
          label: "Line naming who's missing",
        },
      ],
    },
    {
      type: "object",
      name: "channels",
      label: "Everywhere AI looks (AI chat, where we publish, the result)",
      fields: [
        visible,
        { type: "string", name: "eyebrow", label: "Eyebrow" },
        {
          type: "string",
          name: "headingAccent",
          label: "Heading: gradient word",
          description: "Shown in the sunset gradient, e.g. \"How\".",
        },
        {
          type: "string",
          name: "heading",
          label: "Heading: italic part",
          description: "Shown in italics after the gradient word, e.g. \"it works\".",
        },
        { type: "string", name: "intro", label: "Intro line" },
        {
          type: "object",
          name: "goal",
          label: "AI chat example (top)",
          fields: [
            {
              type: "string",
              name: "iconSet",
              label: "Logos on top of the chat window",
              options: iconSetOptions,
            },
            {
              type: "string",
              name: "caption",
              label: "Text typed into the chat search field (e.g. Your customers are searching for you)",
            },
            { type: "string", name: "prompt", label: "Customer's question" },
            { type: "string", name: "answerLead", label: "AI answer: before the name" },
            { type: "string", name: "businessName", label: "AI answer: business name (highlighted)" },
            { type: "string", name: "answerRest", label: "AI answer: after the name", ui: textarea },
          ],
        },
        {
          type: "object",
          name: "publish",
          label: "Where we publish (featured)",
          fields: [
            { type: "string", name: "title", label: "Title" },
            { type: "string", name: "body", label: "Body", ui: textarea },
            {
              type: "object",
              name: "cards",
              label: "Channels",
              list: true,
              ui: { itemProps: (i: any) => ({ label: i?.title || "Channel" }) },
              fields: [
                {
                  type: "string",
                  name: "iconSet",
                  label: "Logo group",
                  description: "The cluster of platform logos shown on the tile.",
                  options: iconSetOptions,
                },
                { type: "string", name: "title", label: "Title" },
                { type: "string", name: "body", label: "Description", ui: textarea },
              ],
            },
          ],
        },
        {
          type: "object",
          name: "measure",
          label: "The result (small card at the bottom)",
          fields: [
            { type: "string", name: "label", label: "Small label (e.g. The result)" },
            { type: "string", name: "title", label: "Title" },
            { type: "string", name: "body", label: "Text", ui: textarea },
          ],
        },
        {
          type: "object",
          name: "offer",
          label: "Offer card (free check CTA)",
          fields: [
            visible,
            { type: "string", name: "eyebrow", label: "Super text (above the heading)" },
            { type: "string", name: "heading", label: "Heading" },
            { type: "string", name: "buttonLabel", label: "Button label" },
            { type: "string", name: "buttonUrl", label: "Button URL" },
            { type: "string", name: "note", label: "Sub text (under the button)", ui: textarea },
          ],
        },
      ],
    },
    {
      type: "object",
      name: "process",
      label: "How it works",
      fields: [
        visible,
        { type: "string", name: "eyebrow", label: "Eyebrow" },
        { type: "string", name: "heading", label: "Heading" },
        {
          type: "object",
          name: "steps",
          label: "Steps",
          list: true,
          ui: { itemProps: (i: any) => ({ label: i?.title || "Step" }) },
          fields: [
            { type: "string", name: "no", label: "Number" },
            { type: "string", name: "title", label: "Title" },
            { type: "string", name: "tag", label: "Tag" },
            { type: "string", name: "body", label: "Body", ui: textarea },
          ],
        },
      ],
    },
    {
      type: "object",
      name: "results",
      label: "Results",
      fields: [
        visible,
        { type: "string", name: "eyebrow", label: "Eyebrow" },
        { type: "string", name: "heading", label: "Heading" },
        {
          type: "object",
          name: "cards",
          label: "Result cards",
          list: true,
          ui: { itemProps: (i: any) => ({ label: i?.title || "Result" }) },
          fields: [
            {
              type: "boolean",
              name: "placeholder",
              label: "Placeholder (hidden on the live site)",
              description:
                "Placeholder cards show a dashed outline in development and are never rendered in production. Replace with a real client result, then uncheck.",
            },
            { type: "image", name: "image", label: "Photo (optional)" },
            { type: "string", name: "imageAlt", label: "Photo description" },
            {
              type: "string",
              name: "label",
              label: "Label (e.g. WE client, Program result)",
            },
            { type: "string", name: "metric", label: "Metric (e.g. 3×)" },
            { type: "string", name: "title", label: "Client / title" },
            { type: "string", name: "body", label: "Body", ui: textarea },
          ],
        },
      ],
    },
    {
      type: "object",
      name: "faq",
      label: "FAQ",
      fields: [
        visible,
        { type: "string", name: "eyebrow", label: "Eyebrow" },
        { type: "string", name: "heading", label: "Heading" },
        {
          type: "object",
          name: "items",
          label: "Questions",
          list: true,
          ui: { itemProps: (i: any) => ({ label: i?.q || "Question" }) },
          fields: [
            { type: "string", name: "q", label: "Question" },
            { type: "string", name: "a", label: "Answer", ui: textarea },
          ],
        },
      ],
    },
    {
      type: "object",
      name: "contact",
      label: "Free check / contact",
      fields: [
        visible,
        { type: "string", name: "heading", label: "Heading" },
        { type: "string", name: "body", label: "Body", ui: textarea },
        { type: "string", name: "phone", label: "Phone" },
        { type: "string", name: "messageLabel", label: "Form field label" },
        {
          type: "string",
          name: "messagePlaceholder",
          label: "Form field placeholder",
        },
        { type: "string", name: "buttonLabel", label: "Button label" },
      ],
    },
  ],
};
