import type { Metadata } from "next";
import { AiVisibility } from "../../components/aivisibility/AiVisibility";
import { loadAiVisibility, loadSettings } from "../../lib/loadContent";
import { pageMetadata } from "../../lib/site";

export const metadata: Metadata = pageMetadata({
  title: "AI Visibility",
  ogTitle: "Be the answer when people ask AI.",
  description:
    "Get your business recommended by ChatGPT, Google AI and Perplexity. Cited across AI assistants, Google News, YouTube, Spotify and social, every month.",
  path: "/ai-visibility",
});

/**
 * AI Visibility page, the landing page for the AI Visibility outreach. Dev
 * queries Tina's datalayer (real query → visual editing); production renders
 * from committed JSON statically.
 */
export default async function AiVisibilityPage() {
  const page = await loadAiVisibility();
  const settings = await loadSettings();

  return <AiVisibility page={page} settings={settings} />;
}
