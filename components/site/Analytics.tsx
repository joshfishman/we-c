"use client";

import { useEffect } from "react";
import { trackScrollDepth } from "../../lib/track";

/**
 * Page-level engagement tracking, mounted once:
 *   - scroll_depth at 25 / 50 / 75 / 100%
 * (section_view lives on <Section>, cta_click/outbound on <Cta>.)
 */
export function Analytics() {
  useEffect(() => {
    const milestones = [25, 50, 75, 100];
    const hit = new Set<number>();

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = Math.round((window.scrollY / scrollable) * 100);
      for (const m of milestones) {
        if (pct >= m && !hit.has(m)) {
          hit.add(m);
          trackScrollDepth(m);
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
