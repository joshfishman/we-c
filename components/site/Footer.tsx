"use client";

import Link from "next/link";
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

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Link href="/" aria-label="Home" className={styles.brandLink}>
          <Logo settings={settings} />
        </Link>
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
