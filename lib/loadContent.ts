import { getPage, getOneDay, getSettings } from "./content";

/**
 * Content loaders that feed both the rendered site and the Tina editor.
 *
 * In **development** (`tinacms dev` running its local datalayer "leader"), we
 * query through Tina's database client so `useTina` receives a real GraphQL
 * query — this is what makes the visual editor work.
 *
 * In **production / `next build`** there is no persistent datalayer (local mode
 * has no leader during prerender), so we read the committed JSON directly and
 * the pages render statically with no backend. To enable editing on the
 * deployed site, provision a KV datalayer, set TINA_PUBLIC_IS_LOCAL=false, and
 * these will switch to the live client there too.
 */
const useDatalayer = process.env.NODE_ENV === "development";

const plain = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

export async function loadPage() {
  if (useDatalayer) {
    const { databaseClient } = await import(
      "../tina/__generated__/databaseClient"
    );
    return plain(
      await databaseClient.queries.page({ relativePath: "home.json" })
    );
  }
  return {
    data: { page: getPage("home.json") },
    query: "",
    variables: { relativePath: "home.json" },
  };
}

export async function loadOneDay() {
  if (useDatalayer) {
    const { databaseClient } = await import(
      "../tina/__generated__/databaseClient"
    );
    return plain(
      await databaseClient.queries.oneDay({ relativePath: "index.json" })
    );
  }
  return {
    data: { oneDay: getOneDay() },
    query: "",
    variables: { relativePath: "index.json" },
  };
}

export async function loadSettings() {
  if (useDatalayer) {
    const { databaseClient } = await import(
      "../tina/__generated__/databaseClient"
    );
    return plain(
      await databaseClient.queries.settings({ relativePath: "global.json" })
    );
  }
  return {
    data: { settings: getSettings() },
    query: "",
    variables: { relativePath: "global.json" },
  };
}
