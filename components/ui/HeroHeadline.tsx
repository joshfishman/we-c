import type { ReactNode } from "react";

export type HeadlineSegment = {
  /** Visible text for this run (omit for a line break). */
  text?: string;
  /** Scoped CSS-module class to style this run (e.g. a gradient word). */
  className?: string;
  /** Render a <br/> here instead of text. */
  break?: boolean;
};

/**
 * A hero headline built from styled runs, so which words carry the gradient
 * stays editor content rather than markup. Static on purpose: the entrance is
 * the parent <h1>'s `heroRise` fade-up, which also respects reduced motion.
 */
export function HeroHeadline({ segments }: { segments: HeadlineSegment[] }) {
  return (
    <>
      {segments.map((seg, i): ReactNode =>
        seg.break ? (
          <br key={i} />
        ) : (
          <span key={i} className={seg.className}>
            {seg.text}
          </span>
        )
      )}
    </>
  );
}
