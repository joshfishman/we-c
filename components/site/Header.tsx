"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { tinaField } from "tinacms/dist/react";
import { Cta } from "../ui/Cta";
import { Logo } from "./Logo";
import { useQuiz } from "../quiz/QuizContext";
import { trackCtaClick } from "../../lib/track";
import styles from "./header.module.css";

/** The path a nav link ultimately targets (ignoring any #anchor). */
function linkPath(url?: string) {
  if (!url) return "";
  const path = url.split("#")[0];
  return path || "/";
}

export function Header({
  settings,
  tone = "default",
}: {
  settings: any;
  tone?: "default" | "sky";
}) {
  const header = settings?.header;
  const ref = useRef<HTMLElement | null>(null);
  const pathname = usePathname();
  const quiz = useQuiz();
  // Both pages share the sunset palette and a transparent bar, so the nav link
  // uses one treatment. The old pale-blue "sky" variant sat at ~1.1:1 over the
  // bright hero with no backing behind it (see header.module.css .scrolled).
  const linkCls = styles.sunText;

  // Show only cross-page links: hide any nav item that points at the page
  // you're already on (so Home shows "One Day Website" and vice-versa).
  const links = (header?.links ?? []).filter(
    (link: any) => linkPath(link?.url) !== pathname
  );

  // Transparent at the top → frosted dark on scroll (matches the design).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const scrolled =
        (window.scrollY || document.documentElement.scrollTop) > 40;
      el.classList.toggle(styles.scrolled, scrolled);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Publish the header's height as --header-h so heroes can reserve space for
  // the fixed bar (measured at the top / unscrolled height, updated on resize
  // and when the bar wraps at narrow widths).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const setH = () => {
      if (window.scrollY <= 40) {
        document.documentElement.style.setProperty(
          "--header-h",
          `${el.offsetHeight}px`
        );
      }
    };
    setH();
    // Web-font swap can reflow the bar (nav wrap) after first paint — re-measure
    // once fonts are ready so the reserved space matches the settled height.
    const fonts = (document as any).fonts;
    if (fonts?.ready) fonts.ready.then(setH);
    const ro = new ResizeObserver(setH);
    ro.observe(el);
    window.addEventListener("resize", setH);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setH);
    };
  }, []);

  if (header?.visible === false) return null;

  return (
    <header ref={ref} className={styles.header} id="site-header">
      <Link href="/" aria-label="Ecommerce Marketing, Home">
        <Logo settings={settings} tone={tone} />
      </Link>

      <nav className={styles.nav}>
        {links.map((link: any, i: number) => (
          <a
            key={i}
            href={link?.url || "#"}
            className={`${styles.link} ${linkCls}`}
            data-tina-field={tinaField(link, "label")}
          >
            {link?.label}
          </a>
        ))}
        {/* The CTA opens the lead quiz. It's a real <button>, not a link: it
            opens a dialog rather than navigating, and Radix returns focus here
            when the dialog closes. With the quiz turned off in the editor it
            falls back to the plain link to the contact form. */}
        {quiz.enabled && header?.cta?.label ? (
          <button
            type="button"
            className={`btn btn--primary ${styles.headerCta}`}
            data-tina-field={tinaField(header.cta, "label")}
            onClick={() => {
              trackCtaClick(header.cta.label, "header");
              quiz.open();
            }}
          >
            {header.cta.label}
          </button>
        ) : (
          <Cta
            label={header?.cta?.label}
            url={header?.cta?.url}
            location="header"
            variant="primary"
            className={styles.headerCta}
            tinaField={header?.cta ? tinaField(header.cta, "label") : undefined}
          />
        )}
      </nav>
    </header>
  );
}
