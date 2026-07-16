import { defineConfig, LocalAuthProvider } from "tinacms";

import { PageCollection } from "./collections/page";
import { SettingsCollection } from "./collections/settings";
import { OneDayCollection } from "./collections/oneDay";

export default defineConfig({
  // Editing is local-only (`npm run dev` → /admin), which needs no login: the
  // editor is only reachable from localhost, and /admin and /api/tina both 404
  // in production. The Supabase login this replaces was for hosted editing,
  // which was never switched on. No user collection either, so there are still
  // no credentials in this repo.
  authProvider: new LocalAuthProvider(),
  contentApiUrlOverride: "/api/tina/gql",
  build: {
    publicFolder: "public",
    outputFolder: "admin",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
      static: true,
    },
  },
  schema: {
    collections: [SettingsCollection, PageCollection, OneDayCollection],
  },
});
