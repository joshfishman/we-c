import type { Metadata } from "next";
import { OneDay } from "../../components/oneday/OneDay";
import { loadOneDay, loadSettings } from "../../lib/loadContent";
import { pageMetadata } from "../../lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Websites in a Day",
  ogTitle: "Plan in the morning. Go live by sunset.",
  description:
    "Enterprise-grade websites in a single day. Strategy, design and development — planned in the morning, live by sunset.",
  path: "/one-day",
});

/**
 * One Day page. Dev queries Tina's datalayer (real query → visual editing);
 * production renders from committed JSON statically.
 */
export default async function OneDayPage() {
  const page = await loadOneDay();
  const settings = await loadSettings();

  return <OneDay page={page} settings={settings} />;
}
