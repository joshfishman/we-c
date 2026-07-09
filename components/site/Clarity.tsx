"use client";

import { useEffect } from "react";
import { isEditing } from "../../lib/track";

/**
 * Microsoft Clarity — session replay + heatmaps (behaviour tracking).
 *
 * Loads the official Clarity tag when NEXT_PUBLIC_CLARITY_ID is set. Suppressed
 * inside the Tina visual editor (iframe / /admin) so editor sessions don't
 * pollute the recordings — same rule as the GTM event layer (see lib/track).
 *
 * GA4 / Google Ads / Meta conversion events still flow through GTM; Clarity is
 * additive (qualitative behaviour on top of the quantitative funnel).
 */
export function Clarity({ id }: { id?: string }) {
  useEffect(() => {
    if (!id || isEditing()) return;
    // Guard against double-injection (React strict-mode / client nav).
    const w = window as unknown as { clarity?: unknown };
    if (w.clarity || document.getElementById("clarity-tag")) return;

    (function (c: any, l: Document, a: string, r: string, i: string) {
      c[a] =
        c[a] ||
        function (...args: unknown[]) {
          (c[a].q = c[a].q || []).push(args);
        };
      const t = l.createElement(r) as HTMLScriptElement;
      t.async = true;
      t.src = "https://www.clarity.ms/tag/" + i;
      t.id = "clarity-tag";
      const y = l.getElementsByTagName(r)[0];
      y.parentNode!.insertBefore(t, y);
    })(window, document, "clarity", "script", id);
  }, [id]);

  return null;
}
