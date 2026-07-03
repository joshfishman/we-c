"use client";

import { tinaField } from "tinacms/dist/react";
import { Section } from "../../ui/Section";
import { Cta } from "../../ui/Cta";
import { ContactForm } from "../../ui/ContactForm";
import styles from "./cta.module.css";

function renderHeading(heading: string) {
  if (typeof heading !== "string") return heading;
  const parts = heading.split(/\bWE\b/);
  if (parts.length < 2) return heading;
  return (
    <>
      {parts[0]}
      <span className={styles.we}>WE</span>
      {parts.slice(1).join("WE")}
    </>
  );
}

export function CtaSection({ data, id = "contact" }: { data: any; id?: string }) {
  const year = new Date().getFullYear();
  return (
    <Section
      name="contact"
      id={id}
      className={`${styles.section} ${data?.theme === "forest" ? styles.forest : ""}`}
    >
      <div className={styles.grid}>
        <div>
          <h2
            className={`serif ${styles.heading}`}
            data-tina-field={tinaField(data, "heading")}
          >
            {renderHeading(data.heading)}
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

        <div className={styles.formCol}>
          <ContactForm buttonLabel="Send message →" location="contact" dark />
        </div>
      </div>

      <div className={styles.footerBar}>
        <a href="/" className={styles.footerBrand} aria-label="WE Creative Agency home">
          <span className={styles.weMark}>WE</span>
          <span className={styles.weSub}>
            Digital
            <br />
            agency
          </span>
        </a>

        <nav className={styles.footerNav}>
          <a href="/one-day">One-Day Websites</a>
          <a href="/#framework">Ecommerce Marketing</a>
        </nav>

        <p className={styles.copyright}>
          © {year} WE Creative Agency — Los Angeles
        </p>
      </div>
    </Section>
  );
}
