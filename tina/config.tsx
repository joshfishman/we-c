import { defineConfig, LocalAuthProvider } from "tinacms";

import { SupabaseAuthProvider } from "./SupabaseAuthProvider";
import { PageCollection } from "./collections/page";
import { SettingsCollection } from "./collections/settings";
import { OneDayCollection } from "./collections/oneDay";

const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === "true";

export default defineConfig({
  // Local dev needs no login. Hosted editing authenticates against Supabase;
  // the API route re-verifies every request server-side, so this only gates
  // the editor UI (see pages/api/tina/[...routes].ts).
  authProvider: isLocal ? new LocalAuthProvider() : new SupabaseAuthProvider(),
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
    // No user collection: Supabase owns accounts and passwords now, so there
    // are no credentials stored in this repo.
    collections: [SettingsCollection, PageCollection, OneDayCollection],
  },
});
