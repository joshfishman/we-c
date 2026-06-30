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
