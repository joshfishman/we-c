"use client";

import { useEffect, useState } from "react";
import { tinaField } from "tinacms/dist/react";
import { Section } from "../../ui/Section";
import { Cta } from "../../ui/Cta";
import styles from "./hero.module.css";

function useResponsiveSrc(desktop?: string, mobile?: string) {
  const [src, setSrc] = useState(desktop || mobile || "");
  useEffect(() => {
    if (!mobile) {
      setSrc(desktop || "");
      return;
    }
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setSrc(mq.matches ? mobile : desktop || mobile);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [desktop, mobile]);
  return src;
}

export function Hero({ data }: { data: any }) {
  const videoSrc = useResponsiveSrc(data.bgVideo, data.bgVideoMobile);

  return (
    <Section name="hero" id="top" className={styles.hero}>
      <div
        className={styles.bg}
        aria-hidden="true"
        data-tina-field={data.bgVideo ? tinaField(data, "bgVideo") : undefined}
      >
        {videoSrc ? (
          <video
            key={videoSrc}
            className={styles.media}
            autoPlay
            muted
            loop
            playsInline
            poster={data.bgPoster || undefined}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : data.bgPoster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className={styles.media} src={data.bgPoster} alt="" />
        ) : null}
        {/* legibility scrims */}
        <div className={styles.scrimTop} />
        <div className={styles.scrimCenter} />
        <div className={styles.scrimVignette} />
        <div className={styles.sheen} />
      </div>

      <div className={styles.content}>
        {data.eyebrow ? (
          <p
            className={`${styles.eyebrow} gradText`}
            data-tina-field={tinaField(data, "eyebrow")}
          >
            {data.eyebrow}
          </p>
        ) : null}

        <h1 className={`serif ${styles.headline}`}>
          <span data-tina-field={tinaField(data, "headlineLead")}>
            {data.headlineLead}{" "}
          </span>
          <span
            className="serif--italic"
            data-tina-field={tinaField(data, "headlineAccent")}
          >
            {data.headlineAccent}
          </span>{" "}
          <span data-tina-field={tinaField(data, "headlineTail")}>
            {data.headlineTail}
          </span>
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
