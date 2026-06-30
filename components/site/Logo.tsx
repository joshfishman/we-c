"use client";

import { tinaField } from "tinacms/dist/react";
import styles from "./logo.module.css";

/**
 * Shared brand lockup ("WE" + sub-label). Used by both the Header and Footer
 * so they always match. `tone="sky"` swaps the gold gradient for sky-blue.
 */
export function Logo({
  settings,
  tone = "default",
}: {
  settings: any;
  tone?: "default" | "sky";
}) {
  const sky = tone === "sky";
  const toneCls = sky ? styles.sky : "gradText--gold";
  const toneStyle = sky
    ? ({ textShadow: "0 1px 14px rgba(8,26,36,0.55)" } as React.CSSProperties)
    : undefined;

  return (
    <span className={styles.brand}>
      <span
        className={`${styles.we} ${toneCls}`}
        style={toneStyle}
        data-tina-field={tinaField(settings, "logoText")}
      >
        {settings?.logoText || "WE"}
      </span>
      {settings?.logoSub ? (
        <span
          className={`${styles.sub} ${toneCls}`}
          style={toneStyle}
          data-tina-field={tinaField(settings, "logoSub")}
          dangerouslySetInnerHTML={{ __html: settings.logoSub }}
        />
      ) : null}
    </span>
  );
}
