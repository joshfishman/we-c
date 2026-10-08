"use client";

import { useEffect } from "react";

/**
 * Subtle scroll reveal, opt-in per section.
 *
 * Sections no longer fade/slide in as whole blocks (that 24px rise read as a
 * sticky "bounce" while scrolling). Only a section marked
 * `data-reveal="stagger"` animates: its background stays still and each
 * `[data-reveal-item]` inside rises in one after another (index →
 * `--reveal-i`, which sets the transition delay).
 *
 * The hidden state is applied from JS (not CSS), so with JS disabled nothing
 * is ever hidden, and a failsafe shows everything if the observer never runs.
 */
export function RevealOnScroll() {
  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    const els = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal="stagger"]')
    );
    if (!els.length) return;

    const show = () => els.forEach((el) => el.classList.remove("revealStagger"));

    els.forEach((el) => {
      el.classList.add("revealStagger");
      el.querySelectorAll<HTMLElement>("[data-reveal-item]").forEach((item, i) =>
        item.style.setProperty("--reveal-i", String(i))
      );
    });

    let observerReported = false;
    const io = new IntersectionObserver(
      (entries) => {
        observerReported = true;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealIn");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.06, rootMargin: "0px 0px -5% 0px" }
    );

    els.forEach((el) => io.observe(el));

    // Failsafe: a working observer always reports an initial entry per target
    // almost immediately. If nothing reports, the observer isn't running — bail
    // out and show everything rather than strand the page at opacity 0.
    const failsafe = window.setTimeout(() => {
      if (!observerReported) {
        io.disconnect();
        show();
      }
    }, 1000);

    return () => {
      window.clearTimeout(failsafe);
      io.disconnect();
    };
  }, []);

  return null;
}
