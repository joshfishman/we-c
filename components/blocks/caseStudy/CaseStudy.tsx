"use client";

import { tinaField } from "tinacms/dist/react";
import { Section } from "../../ui/Section";
import { ImageSlot } from "../../ui/ImageSlot";
import styles from "./caseStudy.module.css";

export function CaseStudy({
  data,
  theme = "dusk",
}: {
  data: any;
  theme?: "default" | "dusk";
}) {
  return (
    <Section name="case_study" className={styles.wrap}>
      <div
        className={
          theme === "dusk" ? `${styles.grid} ${styles.dusk}` : styles.grid
        }
      >
        <div className={styles.photo}>
          <ImageSlot
            src={data.image}
            alt={data.imageAlt}
            placeholder="Drop a Stoned Immaculate photo"
            tinaField={tinaField(data, "image")}
          />
        </div>

        <div className={styles.story}>
          {data.eyebrow ? (
            <p
              className={`${styles.eyebrow} gradText`}
              data-tina-field={tinaField(data, "eyebrow")}
            >
              {data.eyebrow}
            </p>
          ) : null}

          <div className={styles.metricRow}>
            <span
              className={`serif ${styles.metric} gradText`}
              data-tina-field={tinaField(data, "metricValue")}
            >
              {data.metricValue}
            </span>
            <span
              className={styles.metricLabel}
              data-tina-field={tinaField(data, "metricLabel")}
            >
              {data.metricLabel}
            </span>
          </div>

          <p className={styles.brand} data-tina-field={tinaField(data, "brand")}>
            {data.brand}
          </p>

          <p
            className={`serif ${styles.quote}`}
            data-tina-field={tinaField(data, "quote")}
          >
            “{data.quote}”
          </p>

          <div className={styles.person}>
            <div className={styles.avatar}>
              <ImageSlot
                src={data.avatar}
                alt={data.personName}
                placeholder="Photo"
                tinaField={tinaField(data, "avatar")}
              />
            </div>
            <div>
              <div
                className={styles.personName}
                data-tina-field={tinaField(data, "personName")}
              >
                {data.personName}
              </div>
              <div
                className={styles.personTitle}
                data-tina-field={tinaField(data, "personTitle")}
              >
                {data.personTitle}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
