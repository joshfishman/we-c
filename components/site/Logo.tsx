"use client";

import { tinaField } from "tinacms/dist/react";
import styles from "./logo.module.css";

/**
 * Shared brand lockup ("WE" + sub-label). Always uses the gold gradient so the
 * header wordmark matches the footer wordmark. A soft shadow keeps it legible
 * over the photo/sky heroes. (`tone` is kept for the caller API but the gold
 * treatment is used regardless.)
 */
export function Logo({
  settings,
}: {
  settings: any;
  tone?: "default" | "sky";
}) {
  const toneStyle = {
    textShadow: "0 1px 28px rgba(8,26,36,1)",
  } as React.CSSProperties;

  return (
    <span className={styles.brand}>
      <span
        className={`${styles.we} gradText--gold`}
        style={toneStyle}
        data-tina-field={tinaField(settings, "logoText")}
      >
        {settings?.logoText || "WE"}
      </span>
      {settings?.logoSub ? (
        <span
          className={`${styles.sub} gradText--gold`}
          style={toneStyle}
          data-tina-field={tinaField(settings, "logoSub")}
          dangerouslySetInnerHTML={{ __html: settings.logoSub }}
        />
      ) : null}
    </span>
  );
}
