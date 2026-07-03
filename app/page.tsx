import { SiteRenderer } from "../components/site/SiteRenderer";
import { loadPage, loadSettings } from "../lib/loadContent";

/**
 * Home page. In dev it queries Tina's datalayer (real query → visual editing);
 * in production it renders from committed JSON statically (no runtime backend).
 */
export default async function Home() {
  const page = await loadPage();
  const settings = await loadSettings();

  return <SiteRenderer page={page} settings={settings} />;
}
