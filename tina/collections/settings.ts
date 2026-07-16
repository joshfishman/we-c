import type { Collection } from "tinacms";

/**
 * Global site settings — the header/nav and footer that are shared across every
 * page (so editing them once updates page 1, page 2, etc.). Stored as a single
 * JSON document at content/settings/global.json.
 */
export const SettingsCollection: Collection = {
  name: "settings",
  label: "Site Settings",
  path: "content/settings",
  format: "json",
  ui: {
    // Singleton: editors can't create/delete, only edit the one document.
    allowedActions: { create: false, delete: false },
    global: true,
  },
  fields: [
    { type: "string", name: "siteName", label: "Site name" },
    { type: "string", name: "logoText", label: "Logo text (e.g. WE)" },
    {
      type: "string",
      name: "logoSub",
      label: "Logo sub-label (HTML allowed, e.g. DIGITAL<br>agency)",
    },
    {
      type: "string",
      name: "accent",
      label: "Accent color (hex)",
      description: "Brand accent used for buttons/links. e.g. #2E8C86",
    },
    {
      type: "object",
      name: "header",
      label: "Header",
      fields: [
        { type: "boolean", name: "visible", label: "Show header" },
        {
          type: "object",
          name: "links",
          label: "Nav links",
          list: true,
          ui: { itemProps: (i: any) => ({ label: i?.label || "Link" }) },
          fields: [
            { type: "string", name: "label", label: "Label" },
            { type: "string", name: "url", label: "URL" },
          ],
        },
        {
          type: "object",
          name: "cta",
          label: "Header button",
          fields: [
            { type: "string", name: "label", label: "Label" },
            { type: "string", name: "url", label: "URL" },
          ],
        },
      ],
    },
    {
      type: "object",
      name: "quiz",
      label: "Lead quiz (Let's Grow)",
      description:
        "The qualifying quiz behind the header button. Steps run in order; a step with a Branch set is only asked when that service is picked.",
      fields: [
        {
          type: "boolean",
          name: "visible",
          label: "Enabled (uncheck to send the button to the contact form instead)",
        },
        { type: "string", name: "title", label: "Title (modal heading)" },
        {
          type: "string",
          name: "intro",
          label: "Intro line (sits above the first question)",
          description:
            "Say how long it takes here — there's no separate intro screen.",
          ui: { component: "textarea" },
        },
        { type: "string", name: "submitLabel", label: "Final submit button" },
        {
          type: "object",
          name: "steps",
          label: "Questions",
          list: true,
          ui: {
            itemProps: (i: any) => ({
              label: `${i?.branch && i.branch !== "any" ? `[${i.branch}] ` : ""}${
                i?.question ?? "Question"
              }`,
            }),
          },
          fields: [
            {
              type: "string",
              name: "key",
              label: "Field key (what Formspree receives)",
              description: "Lowercase, no spaces. e.g. timeline",
            },
            { type: "string", name: "question", label: "Question" },
            {
              type: "string",
              name: "help",
              label: "Helper line under the question",
              ui: { component: "textarea" },
            },
            {
              type: "string",
              name: "type",
              label: "Answer type",
              options: [
                { value: "single", label: "Pick one" },
                { value: "multi", label: "Pick any" },
              ],
            },
            {
              type: "string",
              name: "branch",
              label: "Only ask for",
              description:
                "Which service picks this question. 'any' asks it of everyone.",
              options: [
                { value: "any", label: "Everyone" },
                { value: "marketing", label: "Digital Marketing (or Both)" },
                { value: "site", label: "Site Development (or Both)" },
              ],
            },
            {
              type: "object",
              name: "options",
              label: "Answers",
              list: true,
              ui: { itemProps: (i: any) => ({ label: i?.label || "Answer" }) },
              fields: [
                { type: "string", name: "label", label: "Label" },
                {
                  type: "string",
                  name: "value",
                  label: "Value (defaults to the label)",
                },
                {
                  type: "string",
                  name: "picks",
                  label: "Sets the service branch (first question only)",
                  description:
                    "On the service question, what this answer selects.",
                  options: [
                    { value: "", label: "—" },
                    { value: "marketing", label: "Digital Marketing" },
                    { value: "site", label: "Site Development" },
                    { value: "both", label: "Both" },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "object",
          name: "contact",
          label: "Final step (contact capture)",
          fields: [
            { type: "string", name: "question", label: "Heading" },
            {
              type: "string",
              name: "help",
              label: "Helper line",
              ui: { component: "textarea" },
            },
          ],
        },
        {
          type: "object",
          name: "done",
          label: "Confirmation (after submit)",
          fields: [
            { type: "string", name: "title", label: "Heading" },
            {
              type: "string",
              name: "body",
              label: "Body",
              ui: { component: "textarea" },
              description:
                "The final button promises a plan — say when it lands, and make sure it does.",
            },
          ],
        },
      ],
    },
    {
      type: "object",
      name: "footer",
      label: "Footer",
      fields: [
        { type: "boolean", name: "visible", label: "Show footer" },
        { type: "string", name: "tagline", label: "Tagline" },
        {
          type: "string",
          name: "addressLines",
          label: "Address lines",
          list: true,
        },
        { type: "string", name: "email", label: "Email" },
        { type: "string", name: "phone", label: "Phone" },
        { type: "string", name: "copyright", label: "Copyright line" },
      ],
    },
  ],
};
