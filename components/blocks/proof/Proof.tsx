"use client";

import { tinaField } from "tinacms/dist/react";
import { Section } from "../../ui/Section";
import styles from "./proof.module.css";

export function Proof({ data }: { data: any }) {
  return (
    <Section name="proof" className={styles.wrap}>
      <div className={styles.bar}>
        {data.intro ? (
          <div className={styles.cell}>
            {data.intro.eyebrow ? (
              <div
                className={styles.eyebrow}
                data-tina-field={tinaField(data.intro, "eyebrow")}
              >
                {data.intro.eyebrow}
              </div>
            ) : null}
            <div
              className={`serif ${styles.introTitle}`}
              data-tina-field={tinaField(data.intro, "title")}
            >
              {data.intro.title}
            </div>
            <div
              className={styles.label}
              data-tina-field={tinaField(data.intro, "subtitle")}
            >
              {data.intro.subtitle}
            </div>
          </div>
        ) : null}

        {data.stats?.map((stat: any, i: number) => (
          <div key={i} className={`${styles.cell} ${styles.cellBordered}`}>
            {stat.eyebrow ? (
              <div
                className={styles.eyebrow}
                data-tina-field={tinaField(stat, "eyebrow")}
              >
                {stat.eyebrow}
              </div>
            ) : null}
            <div
              className={`serif ${styles.value}`}
              data-tina-field={tinaField(stat, "value")}
            >
              {stat.value}
            </div>
            <div
              className={styles.label}
              data-tina-field={tinaField(stat, "label")}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
