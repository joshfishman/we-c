import type { Metadata } from "next";

/**
 * Canonical production origin, used for absolute OG/Twitter image URLs and
 * canonical links. Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL — set this to the real production domain.
 *   2. VERCEL_PROJECT_PRODUCTION_URL — Vercel injects the production domain.
 *   3. wedigital.studio — last-resort fallback (matches the brand domain).
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://wedigital.studio")
).replace(/\/$/, "");

export const siteName = "WE Digital Studio";

/**
 * Build per-page metadata with matching OpenGraph + Twitter cards. Next.js does
 * not deep-merge `openGraph`/`twitter` across segments — the closest one wins
 * outright — so each page must declare a complete set. This keeps that DRY.
 */
export function pageMetadata({
  title,
  ogTitle,
  absoluteTitle = false,
  description,
  path = "/",
}: {
  /** The <title>. Runs through the layout's "%s | WE Digital Studio" template
   *  unless `absoluteTitle` is set (e.g. the home page, which is brand-first). */
  title: string;
  /** OpenGraph/Twitter title, if it should differ from <title>. */
  ogTitle?: string;
  absoluteTitle?: boolean;
  description: string;
  path?: string;
}): Metadata {
  const url = `${siteUrl}${path}`;
  const social = ogTitle ?? title;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName,
      url,
      title: social,
      description,
      // og:image / twitter:image come from the opengraph-image + twitter-image
      // file conventions, which generate the branded 1200×630 cards.
    },
    twitter: {
      card: "summary_large_image",
      title: social,
      description,
    },
  };
}
