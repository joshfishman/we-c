"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { isEditing } from "../../lib/track";
import styles from "./typewriter.module.css";

export type TWSegment = {
  /** Visible text for this run (omit for a line break). */
  text?: string;
  /** Scoped CSS-module class to style this run (e.g. a gradient word). */
  className?: string;
  /** Render a <br/> here instead of text. */
  break?: boolean;
};

/** Subscribe to prefers-reduced-motion without setState-in-effect. */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

/**
 * Types a styled headline out character-by-character with a blinking caret.
 *
 * - SSR-safe: renders the FULL text first (no hydration mismatch, works with
 *   JS disabled and for SEO). The typing effect resets to empty on mount and
 *   plays; the parent hero keeps content hidden until its entrance animation,
 *   so there is no flash of full text.
 * - A hidden sizer reserves the final size, so typing never shifts layout.
 * - Disabled (shows full text, no caret) under prefers-reduced-motion and
 *   inside the Tina editor (so editing the headline doesn't re-trigger typing).
 */
export function Typewriter({
  segments,
  className,
  startDelay = 450,
  speed = 45,
}: {
  segments: TWSegment[];
  className?: string;
  startDelay?: number;
  speed?: number;
}) {
  const total = segments.reduce(
    (n, s) => n + (s.break ? 0 : s.text?.length || 0),
    0
  );
  // Starts empty (matches SSR: 0 typed) so there's no full-text flash — just a
  // waiting caret, then typing. All state changes happen in async callbacks so
  // nothing runs setState synchronously inside the effect.
  const [count, setCount] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced || isEditing()) {
      const t = setTimeout(() => setCount(total), 0); // show full text, no typing
      return () => clearTimeout(t);
    }
    let n = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const timer = setTimeout(() => {
      interval = setInterval(() => {
        n += 1;
        setCount(n);
        if (n >= total && interval) clearInterval(interval);
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, [total, speed, startDelay, reduced]);

  const done = count >= total;

  // Typed (visible) layer — slice each run to the revealed count, drop the
  // caret right after the run the cursor currently sits in.
  const typed: ReactNode[] = [];
  let cursor = 0;
  let caretPlaced = false;
  segments.forEach((seg, i) => {
    if (seg.break) {
      typed.push(<br key={`b${i}`} />);
      return;
    }
    const text = seg.text || "";
    const show = Math.max(0, Math.min(text.length, count - cursor));
    typed.push(
      <span key={i} className={seg.className}>
        {text.slice(0, show)}
      </span>
    );
    cursor += text.length;
    if (!done && !caretPlaced && count <= cursor) {
      typed.push(<span key={`c${i}`} className={styles.caret} aria-hidden="true" />);
      caretPlaced = true;
    }
  });

  const full = segments.map((seg, i) =>
    seg.break ? (
      <br key={`fb${i}`} />
    ) : (
      <span key={i} className={seg.className}>
        {seg.text}
      </span>
    )
  );
  const plain = segments.map((s) => (s.break ? " " : s.text || "")).join("");

  return (
    <span className={`${styles.tw} ${className || ""}`}>
      <span className={styles.sizer} aria-hidden="true">
        {full}
      </span>
      <span className={styles.type} aria-hidden="true">
        {typed}
      </span>
      <span className={styles.srOnly}>{plain}</span>
    </span>
  );
}
