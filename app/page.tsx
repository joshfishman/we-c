import { SiteRenderer } from "../components/site/SiteRenderer";
import { client } from "../tina/__generated__/databaseClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const page = await client.queries.page({ relativePath: "home.json" });
  const settings = await client.queries.settings({
    relativePath: "global.json",
  });

  return (
    <SiteRenderer
      // https://github.com/vercel/next.js/issues/47447
      page={JSON.parse(JSON.stringify(page))}
      settings={JSON.parse(JSON.stringify(settings))}
    />
  );
}
