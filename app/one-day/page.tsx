import { OneDay } from "../../components/oneday/OneDay";
import { loadOneDay, loadSettings } from "../../lib/loadContent";

/**
 * One Day page. Dev queries Tina's datalayer (real query → visual editing);
 * production renders from committed JSON statically.
 */
export default async function OneDayPage() {
  const page = await loadOneDay();
  const settings = await loadSettings();

  return <OneDay page={page} settings={settings} />;
}
