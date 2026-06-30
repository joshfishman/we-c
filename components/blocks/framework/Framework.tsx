"use client";

import { tinaField } from "tinacms/dist/react";
import { Section } from "../../ui/Section";
import styles from "./framework.module.css";

const BADGE_GRADIENTS = [
  "linear-gradient(145deg,#A7D8A0 0%,#6FB060 46%,#3E7C4E 100%)",
  "linear-gradient(145deg,#CBD98A 0%,#9FB85C 46%,#6E8A38 100%)",
  "linear-gradient(145deg,#8FB07A 0%,#4E7C4A 46%,#2E5A30 100%)",
];

function Squiggle({ flip }: { flip?: boolean }) {
  return (
    <svg
      width="92"
      height="84"
      viewBox="0 0 92 84"
      fill="none"
      className={styles.arrow}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
    >
      <path
        d="M22 8 C 78 26, 14 50, 46 74"
        stroke="#F2C078"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="1 11"
      />
      <path
        d="M33 62 L47 76 L60 60"
        stroke="#F2C078"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Framework({ data }: { data: any }) {
  const layers = data.layers ?? [];
  return (
    <Section name="framework" id="framework" className={styles.wrap}>
      <div className={styles.panel}>
        <div className={styles.inner}>
          <div className={styles.head}>
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

          <div className={styles.steps}>
            {layers.map((layer: any, i: number) => (
              <div key={i} className={styles.step}>
                <div
                  className={styles.card}
                  data-align={i % 2 === 0 ? "start" : "end"}
                >
                  <span
                    className={styles.badge}
                    style={{
                      background: BADGE_GRADIENTS[i % BADGE_GRADIENTS.length],
                    }}
                    data-tina-field={tinaField(layer, "no")}
                  >
                    {layer.no}
                  </span>
                  <div className={styles.body}>
                    <div className={styles.titleRow}>
                      <h3
                        className={styles.title}
                        data-tina-field={tinaField(layer, "title")}
                      >
                        {layer.title}
                      </h3>
                      {layer.badge ? (
                        <span
                          className={styles.chip}
                          data-tina-field={tinaField(layer, "badge")}
                        >
                          {layer.badge}
                        </span>
                      ) : null}
                    </div>
                    <p
                      className={styles.desc}
                      data-tina-field={tinaField(layer, "description")}
                    >
                      {layer.description}
                    </p>
                    <div className={styles.tags}>
                      {layer.tags?.map((tag: string, j: number) => (
                        <span key={j} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {i < layers.length - 1 ? <Squiggle flip={i % 2 === 1} /> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
