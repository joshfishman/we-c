"use client";

import { sendGTMEvent } from "@next/third-parties/google";

/**
 * Conversion / engagement tracking layer.
 *
 * Every helper pushes a structured event to the GTM `dataLayer`. Configure the
 * actual tags (GA4, Google Ads, Meta pixel, …) inside the GTM UI off these
 * event names — no further code needed here.
 *
 * Events emitted:
 *   - section_view   { section }            when a section scrolls into view
 *   - scroll_depth   { percent }            at 25 / 50 / 75 / 100%
 *   - cta_click      { label, location }    any CTA button
 *   - outbound_click { url }                links to other domains
 *   - form_submit    { form }               form submissions
 *   - generate_lead  { label, location }    PRIMARY conversion (contact CTAs)
 */

/** Suppress tracking inside the Tina visual editor (which renders in an iframe). */
export function isEditing(): boolean {
  if (typeof window === "undefined") return true;
  try {
    if (window.self !== window.top) return true; // editor preview iframe
    if (window.location.pathname.startsWith("/admin")) return true;
  } catch {
    return true; // cross-origin iframe access throws → treat as editor
  }
  return false;
}

export function track(event: string, params: Record<string, unknown> = {}) {
  if (isEditing()) return;
  sendGTMEvent({ event, ...params });
}

export const trackCtaClick = (label: string, location: string) =>
  track("cta_click", { label, location });

/** Primary conversion — fire on "Start a project" / contact CTAs. */
export const trackLead = (label: string, location: string) =>
  track("generate_lead", { label, location });

export const trackOutbound = (url: string) => track("outbound_click", { url });

export const trackSectionView = (section: string) =>
  track("section_view", { section });

export const trackScrollDepth = (percent: number) =>
  track("scroll_depth", { percent });

export const trackFormSubmit = (form: string) => track("form_submit", { form });
