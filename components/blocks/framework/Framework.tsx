"use client";

import { tinaField } from "tinacms/dist/react";
import { Section } from "../../ui/Section";
import styles from "./framework.module.css";

function DownArrow() {
  return (
    <svg
      width="14"
      height="18"
      viewBox="0 0 14 18"
      fill="none"
      className={styles.arrow}
      aria-hidden="true"
    >
      <path
        d="M7 1 V15 M2 10 L7 15 L12 10"
        stroke="#cbe0c4"
        strokeOpacity="0.7"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LeafGlyph() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 4c-9 0-14 4-14 11 0 2 .6 3.6 1.6 4.9C10 16 13 13 18 11c-4 3-7 6-8.4 10.4 1.2.4 2.5.6 3.9.6 7 0 8.5-9 6.5-18Z"
        stroke="#ffffff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function OuterCard({ layer }: { layer: any }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>
        <div className={styles.cardHeadText}>
          {layer.badge ? (
            <span
              className={styles.badgeLabel}
              data-tina-field={tinaField(layer, "badge")}
            >
              {layer.badge}
            </span>
          ) : null}
          <h3
            className={styles.cardTitle}
            data-tina-field={tinaField(layer, "title")}
          >
            {layer.title}
          </h3>
        </div>
        <span className={styles.iconBadge}>
          <LeafGlyph />
        </span>
      </div>
      <ul className={styles.tagList}>
        {layer.tags?.map((tag: string, j: number) => (
          <li key={j} className={styles.tagRow}>
            {tag}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ConvertCircle({ layer }: { layer: any }) {
  return (
    <div className={styles.circleWrap}>
      <div className={styles.orbit} aria-hidden="true">
        <span className={`${styles.orbitDot} ${styles.orbitDot1}`} />
        <span className={`${styles.orbitDot} ${styles.orbitDot2}`} />
        <span className={`${styles.orbitDot} ${styles.orbitDot3}`} />
      </div>
      <div className={styles.circle}>
        <h3
          className={styles.circleTitle}
          data-tina-field={tinaField(layer, "title")}
        >
          {layer.title}
        </h3>
        <div className={styles.circleTags}>
          {layer.tags?.map((tag: string, j: number) => (
            <span key={j} className={styles.circleTag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
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
            {data.flowIntro ? (
              <p
                className={styles.flowIntro}
                data-tina-field={tinaField(data, "flowIntro")}
              >
                {data.flowIntro}
              </p>
            ) : null}
          </div>

          <div className={styles.flow}>
            {layers[0] ? <OuterCard layer={layers[0]} /> : null}
            {layers[1] ? <DownArrow /> : null}
            {layers[1] ? <ConvertCircle layer={layers[1]} /> : null}
            {layers[2] ? <DownArrow /> : null}
            {layers[2] ? <OuterCard layer={layers[2]} /> : null}
          </div>
        </div>
      </div>
    </Section>
  );
}
