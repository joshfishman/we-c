"use client";

import { tinaField } from "tinacms/dist/react";
import { Logo } from "./Logo";
import styles from "./footer.module.css";

/**
 * Shared site footer. Uses the same <Logo/> as the header so the brand lockup
 * always matches. Content comes from Site Settings → footer.
 */
export function Footer({ settings }: { settings: any }) {
  const footer = settings?.footer;
  if (footer?.visible === false) return null;

  const contact = [footer?.email, footer?.phone].filter(Boolean).join("  ·  ");

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <a href="/" aria-label="Home" className={styles.brandLink}>
          <Logo settings={settings} />
        </a>
        {contact ? (
          <div className={styles.contact}>
            {footer?.email ? (
              <a href={`mailto:${footer.email}`} data-tina-field={tinaField(footer, "email")}>
                {footer.email}
              </a>
            ) : null}
            {footer?.email && footer?.phone ? <span className={styles.dot}>·</span> : null}
            {footer?.phone ? (
              <span data-tina-field={tinaField(footer, "phone")}>{footer.phone}</span>
            ) : null}
          </div>
        ) : null}
        <span
          className={styles.copyright}
          data-tina-field={footer ? tinaField(footer, "copyright") : undefined}
        >
          {footer?.copyright}
        </span>
      </div>
    </footer>
  );
}
