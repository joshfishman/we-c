"use client";

import { tinaField } from "tinacms/dist/react";
import { Section } from "../../ui/Section";
import { Cta } from "../../ui/Cta";
import { BgVideo } from "../../ui/BgVideo";
import { BgSlideshow } from "../../ui/BgSlideshow";
import { Typewriter, type TWSegment } from "../../ui/Typewriter";
import styles from "./hero.module.css";

export function Hero({ data }: { data: any }) {
  // Build the typed headline: gradient lead + italic accent + gradient tail.
  const headline: TWSegment[] = [];
  if (data.headlineLead)
    headline.push({ text: data.headlineLead, className: styles.gradWord });
  if (data.headlineAccent) {
    headline.push({ text: " " });
    // A newline in the accent becomes a line break in the headline (e.g.
    // "your\nBrand" → "Grow your" / "Brand Online").
    String(data.headlineAccent)
      .split("\n")
      .forEach((part: string, i: number) => {
        if (i > 0) headline.push({ break: true });
        headline.push({ text: part, className: "serif--italic" });
      });
  }
  if (data.headlineTail) {
    headline.push({ text: " " });
    headline.push({ text: data.headlineTail, className: styles.gradWord });
  }

  return (
    <Section name="hero" id="top" className={styles.hero}>
      <div className={styles.bg} aria-hidden="true">
        {/* Two or more background images → a slow crossfading slideshow.
            Otherwise the video/poster path (a single image is just a poster). */}
        {(data.bgSlides?.filter(Boolean).length ?? 0) >= 2 ? (
          <BgSlideshow slides={data.bgSlides} className={styles.media} />
        ) : (
          <BgVideo
            src={data.bgVideo}
            mobileSrc={data.bgVideoMobile}
            poster={data.bgPoster}
            className={styles.media}
          />
        )}
        {/* legibility scrims */}
        <div className={styles.scrimTop} />
        <div className={styles.scrimCenter} />
        <div className={styles.scrimVignette} />
        <div className={styles.sheen} />
      </div>

      <div className={styles.content}>
        {data.eyebrow ? (
          <p
            className={styles.eyebrow}
            data-tina-field={tinaField(data, "eyebrow")}
          >
            {data.eyebrow}
          </p>
        ) : null}

        <h1 className={`serif ${styles.headline}`}>
          <Typewriter segments={headline} />
        </h1>

        <p className={styles.subhead} data-tina-field={tinaField(data, "subhead")}>
          {data.subhead}
        </p>

        <div className={styles.actions}>
          <Cta
            label={data.ctaPrimary?.label}
            url={data.ctaPrimary?.url}
            location="hero"
            variant="primary"
            tinaField={
              data.ctaPrimary ? tinaField(data.ctaPrimary, "label") : undefined
            }
          />
          <Cta
            label={data.ctaSecondary?.label}
            url={data.ctaSecondary?.url}
            location="hero"
            variant="secondary"
            tinaField={
              data.ctaSecondary
                ? tinaField(data.ctaSecondary, "label")
                : undefined
            }
          />
        </div>
      </div>

      {data.callout?.text ? (
        <a
          href={data.callout?.url || "#"}
          className={styles.callout}
          data-tina-field={tinaField(data.callout, "text")}
        >
          <span className={styles.calloutText}>
            <span className={styles.calloutEyebrow}>{data.callout.eyebrow}</span>
            <span className={styles.calloutMain}>{data.callout.text}</span>
          </span>
          <span className={styles.calloutArrow}>→</span>
        </a>
      ) : null}
    </Section>
  );
}
