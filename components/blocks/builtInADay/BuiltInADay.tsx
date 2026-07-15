"use client";

import { tinaField } from "tinacms/dist/react";
import { Section } from "../../ui/Section";
import { trackCtaClick } from "../../../lib/track";
import styles from "./builtInADay.module.css";

export function BuiltInADay({ data }: { data: any }) {
  const href = data.cta?.url || "#";
  return (
    <Section name="built_in_a_day" id="speed" className={styles.wrap}>
      <a
        href={href}
        className={styles.panel}
        onClick={() => trackCtaClick(data.cta?.label || "built-in-a-day", "speed")}
      >
        <div>
          <p
            className={`${styles.eyebrow} gradText`}
            data-tina-field={tinaField(data, "eyebrow")}
          >
            {data.eyebrow}
          </p>
          <h2
            className={`serif ${styles.heading}`}
            data-tina-field={tinaField(data, "heading")}
          >
            {data.heading}
          </h2>
        </div>

        <div className={styles.stats}>
          {data.stats?.map((stat: any, i: number) => (
            <div key={i} className={styles.stat}>
              <span
                className={`serif ${styles.value}`}
                data-tina-field={tinaField(stat, "value")}
              >
                {stat.value}
              </span>
              <span
                className={styles.label}
                data-tina-field={tinaField(stat, "label")}
              >
                {stat.label}
              </span>
            </div>
          ))}
          {data.cta?.label ? (
            // A span, not a <Cta>: the whole panel is already an <a>, and
            // anchors can't nest. It just wears the standard secondary pill.
            <span
              className={`btn btn--secondary ${styles.link}`}
              data-tina-field={tinaField(data.cta, "label")}
            >
              {data.cta.label}
            </span>
          ) : null}
        </div>
      </a>
    </Section>
  );
}
