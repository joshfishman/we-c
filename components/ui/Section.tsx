"use client";

import { useEffect, useRef } from "react";
import { trackSectionView } from "../../lib/track";

type Props = {
  name: string;
  id?: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * Section wrapper. Adds the shared `.section` padding and fires a one-time
 * `section_view` GTM event when the section first scrolls into view.
 */
export function Section({ name, id, className, children }: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !fired.current) {
            fired.current = true;
            trackSectionView(name);
            io.disconnect();
          }
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [name]);

  return (
    <section
      ref={ref}
      id={id}
      data-section={name}
      className={`section${className ? ` ${className}` : ""}`}
    >
      {children}
    </section>
  );
}
