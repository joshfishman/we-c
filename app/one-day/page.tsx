import { OneDay } from "../../components/oneday/OneDay";
import { client } from "../../tina/__generated__/databaseClient";

export const dynamic = "force-dynamic";

export default async function OneDayPage() {
  const data = await client.queries.oneDay({ relativePath: "index.json" });
  const settings = await client.queries.settings({
    relativePath: "global.json",
  });
  return (
    <OneDay
      // https://github.com/vercel/next.js/issues/47447
      page={JSON.parse(JSON.stringify(data))}
      settings={JSON.parse(JSON.stringify(settings))}
    />
  );
}
