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

/** Horseshoe magnet — "Attract". */
function MagnetGlyph() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 3h4v8a4 4 0 0 0 8 0V3h4v8a8 8 0 0 1-16 0Z"
        fill="#ffffff"
      />
      <rect x="4" y="3" width="4" height="2.6" fill="#d9614b" />
      <rect x="16" y="3" width="4" height="2.6" fill="#d9614b" />
    </svg>
  );
}

/** Circular arrows — "Retain" (recycle / loop). */
function RecycleGlyph() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

/** Bullseye — "Convert" (hit the goal). */
function TargetGlyph() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      stroke="#ffffff"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="#ffffff" stroke="none" />
    </svg>
  );
}

type CardIcon = "magnet" | "convert" | "recycle";
function CardGlyph({ icon }: { icon: CardIcon }) {
  if (icon === "magnet") return <MagnetGlyph />;
  if (icon === "convert") return <TargetGlyph />;
  return <RecycleGlyph />;
}

function OuterCard({
  layer,
  icon,
  pos,
}: {
  layer: any;
  icon: CardIcon;
  pos: "left" | "center" | "right";
}) {
  return (
    <div className={styles.card} data-pos={pos}>
      <div className={styles.cardHead}>
        <span className={styles.iconBadge}>
          <CardGlyph icon={icon} />
        </span>
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
            {layers[0] ? (
              <OuterCard layer={layers[0]} icon="magnet" pos="left" />
            ) : null}
            {layers[1] ? <DownArrow /> : null}
            {layers[1] ? (
              <OuterCard layer={layers[1]} icon="convert" pos="center" />
            ) : null}
            {layers[2] ? <DownArrow /> : null}
            {layers[2] ? (
              <OuterCard layer={layers[2]} icon="recycle" pos="right" />
            ) : null}
          </div>
        </div>
      </div>
    </Section>
  );
}
