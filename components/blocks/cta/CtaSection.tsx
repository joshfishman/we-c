"use client";

import { tinaField } from "tinacms/dist/react";
import { Section } from "../../ui/Section";
import { Cta } from "../../ui/Cta";
import styles from "./cta.module.css";

export function CtaSection({ data, settings }: { data: any; settings?: any }) {
  const footer = settings?.footer;
  return (
    <Section name="contact" id="contact" className={styles.section}>
      <div className={styles.grid}>
        <div>
          <h2
            className={`serif ${styles.heading}`}
            data-tina-field={tinaField(data, "heading")}
          >
            {data.heading}
          </h2>
          <p className={styles.body} data-tina-field={tinaField(data, "body")}>
            {data.body}
          </p>
          <Cta
            label={data.cta?.label}
            url={data.cta?.url}
            location="contact"
            variant="primary"
            className={styles.cta}
            tinaField={data.cta ? tinaField(data.cta, "label") : undefined}
          />
        </div>

        <div className={styles.details}>
          {data.email ? (
            <div className={styles.detail}>
              <div className={styles.detailLabel}>Email</div>
              <a
                className={styles.detailValue}
                href={`mailto:${data.email}`}
                data-tina-field={tinaField(data, "email")}
              >
                {data.email}
              </a>
            </div>
          ) : null}
          {data.phone ? (
            <div className={styles.detail}>
              <div className={styles.detailLabel}>Phone</div>
              <div
                className={styles.detailValue}
                data-tina-field={tinaField(data, "phone")}
              >
                {data.phone}
              </div>
            </div>
          ) : null}
          {data.studio?.length ? (
            <div className={styles.detail}>
              <div className={styles.detailLabel}>Studio</div>
              <div className={styles.detailValue}>
                {data.studio.map((line: string, i: number) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className={styles.legal}>
        <span className={`serif ${styles.legalBrand}`}>
          {settings?.logoText || "WE"}{" "}
          <span className={styles.legalBrandSub}>
            {settings?.siteName || "Creative Agency"}
          </span>
        </span>
        <span
          className={styles.copyright}
          data-tina-field={footer ? tinaField(footer, "copyright") : undefined}
        >
          {footer?.copyright || "© WE Creative Agency"}
        </span>
      </div>
    </Section>
  );
}
