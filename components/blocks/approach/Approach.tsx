"use client";

import { tinaField } from "tinacms/dist/react";
import { Section } from "../../ui/Section";
import styles from "./approach.module.css";

export function Approach({ data }: { data: any }) {
  return (
    <Section name="approach" id="approach" className={styles.wrap}>
      <div className={styles.grid}>
        <div className={`${styles.card} ${styles.light}`}>
          <p
            className={`${styles.eyebrow} gradText`}
            data-tina-field={tinaField(data, "leftEyebrow")}
          >
            {data.leftEyebrow}
          </p>
          <h3
            className={`serif ${styles.heading}`}
            data-tina-field={tinaField(data, "leftHeading")}
          >
            {data.leftHeading}
          </h3>
          <p
            className={styles.body}
            data-tina-field={tinaField(data, "leftBody")}
          >
            {data.leftBody}
          </p>
        </div>

        <div className={styles.plus} aria-hidden="true">
          <span className="serif">+</span>
        </div>

        <div className={`${styles.card} ${styles.dark}`}>
          <p
            className={`${styles.eyebrow} gradText`}
            data-tina-field={tinaField(data, "rightEyebrow")}
          >
            {data.rightEyebrow}
          </p>
          <h3
            className={`serif ${styles.heading}`}
            data-tina-field={tinaField(data, "rightHeading")}
          >
            {data.rightHeading}
          </h3>
          <p
            className={`${styles.body} ${styles.bodyDark}`}
            data-tina-field={tinaField(data, "rightBody")}
          >
            {data.rightBody}
          </p>
        </div>
      </div>
    </Section>
  );
}
