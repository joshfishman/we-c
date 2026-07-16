"use client";

import { useEffect, useState } from "react";
import { isEditing } from "../../lib/track";

/**
 * Full-bleed crossfading background slideshow.
 *
 * All slides are stacked and only the active one is at opacity 1; a slow CSS
 * opacity transition does the crossfade, and a timer advances the active index.
 *
 * - SSR-safe: slide 0 starts active, so the first image renders with no JS and
 *   there's no flash.
 * - One slide (or none): renders it static, no timer — same as a plain poster.
 * - Respects `prefers-reduced-motion` and the Tina editor: no cycling, the first
 *   image just sits there (matches how the hero typewriter/entrance behave).
 */
export function BgSlideshow({
  slides,
  className,
  holdMs = 6000,
  fadeMs = 1800,
}: {
  slides: string[];
  className?: string;
  /** How long each slide is held before it starts fading to the next. */
  holdMs?: number;
  /** Crossfade duration. */
  fadeMs?: number;
}) {
  const [failed, setFailed] = useState<string[]>([]);
  // A slide that 404s (e.g. an image not dropped in yet) is dropped from the
  // rotation, so the show never crossfades to a broken frame.
  const clean = (slides || []).filter((s) => s && !failed.includes(s));
  const [active, setActive] = useState(0);
  // Clamp during render so a dropped slide can't leave `active` out of range —
  // no correcting effect (which would cascade an extra render).
  const activeIdx = clean.length ? active % clean.length : 0;

  useEffect(() => {
    if (clean.length < 2) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || isEditing()) return;

    const id = window.setInterval(
      () => setActive((i) => (i + 1) % clean.length),
      holdMs + fadeMs
    );
    return () => window.clearInterval(id);
    // Length is what matters; the array identity changes each render.
  }, [clean.length, holdMs, fadeMs]);

  if (clean.length === 0) return null;

  return (
    <>
      {clean.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src + i}
          className={className}
          src={src}
          alt=""
          aria-hidden="true"
          onError={() => setFailed((f) => (f.includes(src) ? f : [...f, src]))}
          style={{
            opacity: i === activeIdx ? 1 : 0,
            transition: `opacity ${fadeMs}ms ease-in-out`,
            // The active slide sits on top so the fade reads as a crossfade,
            // not a hard swap.
            zIndex: i === activeIdx ? 1 : 0,
          }}
        />
      ))}
    </>
  );
}
