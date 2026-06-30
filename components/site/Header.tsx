"use client";

import { useEffect, useRef } from "react";
import { tinaField } from "tinacms/dist/react";
import { Cta } from "../ui/Cta";
import styles from "./header.module.css";

export function Header({
  settings,
  tone = "default",
}: {
  settings: any;
  tone?: "default" | "sky";
}) {
  const header = settings?.header;
  const ref = useRef<HTMLElement | null>(null);
  const sky = tone === "sky";
  const logoCls = sky ? styles.skyText : "gradText--gold";
  const linkCls = sky ? styles.skyText : "gradText";

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

  if (header?.visible === false) return null;

  return (
    <header ref={ref} className={styles.header} id="site-header">
      <a href="#top" className={styles.brand}>
        <span
          className={`${styles.logo} ${logoCls}`}
          data-tina-field={tinaField(settings, "logoText")}
        >
          {settings?.logoText || "WE"}
        </span>
        {settings?.logoSub ? (
          <span
            className={`${styles.logoSub} ${logoCls}`}
            data-tina-field={tinaField(settings, "logoSub")}
            dangerouslySetInnerHTML={{ __html: settings.logoSub }}
          />
        ) : null}
      </a>

      <nav className={styles.nav}>
        {header?.links?.map((link: any, i: number) => (
          <a
            key={i}
            href={link?.url || "#"}
            className={`${styles.link} ${linkCls}`}
            data-tina-field={tinaField(link, "label")}
          >
            {link?.label}
          </a>
        ))}
        <Cta
          label={header?.cta?.label}
          url={header?.cta?.url}
          location="header"
          variant="primary"
          className={styles.headerCta}
          tinaField={header?.cta ? tinaField(header.cta, "label") : undefined}
        />
      </nav>
    </header>
  );
}
