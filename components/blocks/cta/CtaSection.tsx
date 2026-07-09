"use client";

import Link from "next/link";
import { tinaField } from "tinacms/dist/react";
import { Section } from "../../ui/Section";
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
        </div>

        <div className={styles.formCol}>
          <ContactForm
            buttonLabel="Send message →"
            location="contact"
            dark
            forest={data?.theme === "forest"}
          />
        </div>
      </div>

      <div className={styles.footerBar}>
        <div className={styles.footerTop}>
          <Link href="/" className={styles.footerBrand} aria-label="WE Creative Agency home">
            <span className={styles.weMark}>WE</span>
            <span className={styles.weSub}>
              Digital
              <br />
              agency
            </span>
          </Link>

          <nav className={styles.footerNav}>
            <Link href="/one-day">One-Day Websites</Link>
            <Link href="/#framework">Ecommerce Marketing</Link>
          </nav>
        </div>

        <p className={styles.copyright}>
          © {year} WE Creative Agency — Los Angeles
        </p>
      </div>
    </Section>
  );
}
