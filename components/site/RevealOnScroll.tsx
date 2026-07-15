"use client";

import { useEffect } from "react";

/**
 * Elegant load: each section fades up gently as it comes into view.
 *
 * The hidden state is applied from JS (not CSS), so with JS disabled every
 * section stays visible — nothing can get stranded at opacity 0. Heroes are
 * skipped: they run their own staggered entrance on load, and fading the
 * whole section would fade its background image/video too.
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
      document.querySelectorAll<HTMLElement>("[data-section]")
    ).filter((el) => !/hero$/i.test(el.dataset.section || ""));

    const show = () => els.forEach((el) => el.classList.remove("revealPending"));

    els.forEach((el) => el.classList.add("revealPending"));

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
