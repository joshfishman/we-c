"use client";

import { tinaField } from "tinacms/dist/react";
import { Section } from "../../ui/Section";
import { Cta } from "../../ui/Cta";
import { ContactForm } from "../../ui/ContactForm";
import styles from "./cta.module.css";

export function CtaSection({ data }: { data: any }) {
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

          <div className={styles.details}>
            {data.email ? (
              <a className={styles.detail} href={`mailto:${data.email}`}>
                {data.email}
              </a>
            ) : null}
            {data.phone ? <span className={styles.detail}>{data.phone}</span> : null}
            {data.studio?.length ? (
              <span className={styles.detail}>{data.studio.join(", ")}</span>
            ) : null}
          </div>
        </div>

        <div className={styles.formCol}>
          <ContactForm buttonLabel="Send message →" location="contact" dark />
        </div>
      </div>
    </Section>
  );
}
