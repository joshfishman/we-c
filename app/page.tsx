import type { Metadata } from "next";
import { SiteRenderer } from "../components/site/SiteRenderer";
import { loadPage, loadSettings } from "../lib/loadContent";
import { pageMetadata } from "../lib/site";

export const metadata: Metadata = pageMetadata({
  title: "WE Digital Studio | We grow businesses online",
  absoluteTitle: true,
  ogTitle: "WE Digital Studio — grow your brand online",
  description:
    "Human-led strategy, AI speed. We grow ecommerce & lifestyle brands — strategy, development, and marketing under one roof.",
  path: "/",
});

/**
 * Home page. In dev it queries Tina's datalayer (real query → visual editing);
 * in production it renders from committed JSON statically (no runtime backend).
 */
export default async function Home() {
  const page = await loadPage();
  const settings = await loadSettings();

  return <SiteRenderer page={page} settings={settings} />;
}
