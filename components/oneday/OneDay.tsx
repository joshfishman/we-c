"use client";

import { useTina, tinaField } from "tinacms/dist/react";
import { Cta } from "../ui/Cta";
import { SiteLayout } from "../site/SiteLayout";
import { CaseStudy } from "../blocks/caseStudy/CaseStudy";
import { OurWork } from "../blocks/ourWork/OurWork";
import { CtaSection } from "../blocks/cta/CtaSection";
import s from "./oneday.module.css";

const STEP_BADGES = ["#E6849C", "#E8A44C", "#D8623F"];

// Hero day-arc chips: fixed position/colors per index (0=morning,1=midday,2=sunset)
const ARC_CHIPS = [
  {
    group: {
      left: "10%",
      bottom: 0,
      transform: "translateX(-50%)",
    } as React.CSSProperties,
    dot: "#F0A6BE",
    dotGlow: "rgba(240,166,190,0.7)",
    belowSize: 11,
    belowShadow:
      "0 0 0 4px rgba(240,166,190,0.22),0 0 16px 3px rgba(240,166,190,0.7)",
    accent: "#F0A6BE55",
    twinkleDelay: "0s",
  },
  {
    group: {
      left: "50%",
      top: "-12px",
      transform: "translateX(-50%)",
    } as React.CSSProperties,
    dot: "#FFE08A",
    dotGlow: "rgba(255,224,138,0.8)",
    belowSize: 13,
    belowShadow:
      "0 0 0 5px rgba(255,224,138,0.22),0 0 20px 4px rgba(255,224,138,0.8)",
    accent: "#FFE08A55",
    twinkleDelay: ".6s",
  },
  {
    group: {
      right: "10%",
      bottom: 0,
      transform: "translateX(50%)",
    } as React.CSSProperties,
    dot: "#F4943E",
    dotGlow: "rgba(244,148,62,0.7)",
    belowSize: 11,
    belowShadow:
      "0 0 0 4px rgba(244,148,62,0.22),0 0 16px 3px rgba(244,148,62,0.7)",
    accent: "#F4943E55",
    twinkleDelay: "1.2s",
  },
] as const;

// Process night-sky decorative stars: exact positions
const PROCESS_STARS = [
  { left: "8%", top: "14%", size: 3, dur: "3.4s", delay: "0s" },
  { left: "18%", top: "32%", size: 2, dur: "2.8s", delay: ".5s" },
  { left: "27%", top: "9%", size: 2.5, dur: "4.1s", delay: ".2s" },
  { left: "39%", top: "24%", size: 2, dur: "3.1s", delay: "1.1s" },
  { left: "52%", top: "12%", size: 3, dur: "3.7s", delay: ".8s" },
  { left: "63%", top: "30%", size: 2, dur: "2.6s", delay: "1.4s" },
  { left: "72%", top: "8%", size: 2.5, dur: "4.4s", delay: ".3s" },
  { left: "83%", top: "26%", size: 2, dur: "3.3s", delay: ".9s" },
  { left: "92%", top: "16%", size: 3, dur: "3.9s", delay: ".6s" },
  { left: "46%", top: "5%", size: 2, dur: "2.9s", delay: "1.7s" },
];

function Squiggle({ flip, indent }: { flip?: boolean; indent: "left" | "right" }) {
  return (
    <svg
      width="92"
      height="84"
      viewBox="0 0 92 84"
      fill="none"
      className={`${s.arrow} ${indent === "left" ? s.arrowLeft : s.arrowRight}`}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
    >
      <path
        d="M22 8 C 78 26, 14 50, 46 74"
        stroke="#E9A94C"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="1 11"
      />
      <path
        d="M33 62 L47 76 L60 60"
        stroke="#E9A94C"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function OneDay(props: {
  page: { data: any; variables: any; query: string };
  settings: { data: any; variables: any; query: string };
}) {
  const { data } = useTina(props.page);
  const { data: settingsData } = useTina(props.settings);
  const settings = settingsData?.settings;
  const page = data.oneDay;
  const hero = page?.hero;
  const proof = page?.proof;
  const caseStudy = page?.caseStudy;
  const ourWork = page?.ourWork;
  const quality = page?.quality;
  const process = page?.process;
  const cta = page?.cta;
  const contact = page?.contact;

  return (
    <SiteLayout settings={settings} headerTone="sky">
      <div className={s.page}>
        {/* HERO */}
      {hero?.visible !== false ? (
        <section className={s.hero} id="top" data-section="oneday_hero">
          <div className={s.heroBg} aria-hidden="true">
            {hero?.bgVideo ? (
              <video
                className={s.heroMedia}
                autoPlay
                muted
                loop
                playsInline
                poster={hero?.bgPoster || undefined}
              >
                <source src={hero.bgVideo} type="video/mp4" />
              </video>
            ) : null}
            <div className={s.scrimTop} />
            <div className={s.scrimCenter} />
            <div className={s.scrimVignette} />
          </div>

          <div className={s.heroContent}>
            <div className={s.dayArc} aria-hidden="true">
              <svg
                className={s.dayArcSvg}
                viewBox="0 0 760 96"
                preserveAspectRatio="none"
              >
                <path
                  d="M 40 84 Q 380 -6 720 84"
                  fill="none"
                  stroke="rgba(255,241,218,0.55)"
                  strokeWidth="2"
                  strokeDasharray="2 9"
                  strokeLinecap="round"
                />
              </svg>
              {hero?.pills?.slice(0, 3).map((pill: any, i: number) => {
                const chip = ARC_CHIPS[i];
                if (!chip) return null;
                return (
                  <div key={i} className={s.arcGroup} style={chip.group}>
                    <span className={s.arcPill}>
                      <span
                        className={s.arcPillGradient}
                        style={{
                          background: `linear-gradient(90deg, rgba(240,166,190,0), ${chip.accent}, rgba(240,166,190,0))`,
                        }}
                      />
                      <span
                        className={s.arcPillDot}
                        style={{
                          background: chip.dot,
                          boxShadow: `0 0 12px 2px ${chip.dotGlow}`,
                        }}
                      />
                      <span className={s.arcPillLabel}>
                        {String(pill?.label || "")
                          .split("·")
                          .map((word: string, k: number) => (
                            <span key={k} className={s.arcWord}>
                              {word.trim()}
                            </span>
                          ))}
                      </span>
                    </span>
                    <span
                      className={s.arcBelowDot}
                      style={{
                        width: chip.belowSize,
                        height: chip.belowSize,
                        background: chip.dot,
                        boxShadow: chip.belowShadow,
                        animationDelay: chip.twinkleDelay,
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <h1 className={`serif ${s.heroTitle}`}>
              <span data-tina-field={tinaField(hero, "headlineLine1")}>
                {hero?.headlineLine1}
              </span>
              <br />
              <span
                className={s.heroTitleSunset}
                data-tina-field={tinaField(hero, "headlineLine2")}
              >
                {hero?.headlineLine2}
              </span>
            </h1>
            <p className={s.heroSub} data-tina-field={tinaField(hero, "subhead")}>
              {hero?.subhead}
            </p>
            <div className={s.heroActions}>
              <Cta
                label={hero?.ctaPrimary?.label}
                url={hero?.ctaPrimary?.url}
                location="oneday_hero"
                variant="primary"
                tinaField={
                  hero?.ctaPrimary ? tinaField(hero.ctaPrimary, "label") : undefined
                }
              />
              <Cta
                label={hero?.ctaSecondary?.label}
                url={hero?.ctaSecondary?.url}
                location="oneday_hero"
                variant="dusk"
                tinaField={
                  hero?.ctaSecondary
                    ? tinaField(hero.ctaSecondary, "label")
                    : undefined
                }
              />
            </div>
          </div>
        </section>
      ) : null}

      {/* PROOF STRIP */}
      {proof?.visible !== false ? (
        <section className={s.proofWrap} data-section="oneday_proof">
          <div className={s.proofBar}>
            {proof?.stats?.map((stat: any, i: number) => (
              <div key={i} className={s.proofCell}>
                <div
                  className={`serif ${s.proofValue}`}
                  data-tina-field={tinaField(stat, "value")}
                >
                  {stat.value}
                </div>
                <div
                  className={s.proofLabel}
                  data-tina-field={tinaField(stat, "label")}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* TESTIMONIAL */}
      {caseStudy && caseStudy.visible !== false ? (
        <CaseStudy data={caseStudy} theme="dusk" />
      ) : null}

      {/* ENTERPRISE QUALITY */}
      {quality?.visible !== false ? (
        <section className={s.quality} data-section="oneday_quality">
          <div className={s.qualityHead}>
            <p className={s.qualityEyebrow} data-tina-field={tinaField(quality, "eyebrow")}>
              {quality?.eyebrow}
            </p>
            <h2
              className={`serif ${s.h2}`}
              data-tina-field={tinaField(quality, "heading")}
            >
              {quality?.heading}
            </h2>
          </div>
          <div className={s.qualityGrid}>
            {quality?.cards?.map((card: any, i: number) => (
              <div key={i} className={s.qualityCard}>
                <div className={`serif ${s.qualityIcon}`}>{card?.icon}</div>
                <h3 className={s.qualityTitle} data-tina-field={tinaField(card, "title")}>
                  {card?.title}
                </h3>
                <p className={s.qualityBody} data-tina-field={tinaField(card, "body")}>
                  {card?.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* PROCESS */}
      {process?.visible !== false ? (
        <section className={s.process} id="process" data-section="oneday_process">
          <div className={s.stars} aria-hidden="true">
            {PROCESS_STARS.map((star, i) => (
              <span
                key={i}
                className={s.star}
                style={{
                  left: star.left,
                  top: star.top,
                  width: star.size,
                  height: star.size,
                  animationDuration: star.dur,
                  animationDelay: star.delay,
                }}
              />
            ))}
          </div>
          <div className={s.processInner}>
            <div className={s.processHead}>
              <p
                className={s.processEyebrow}
                data-tina-field={tinaField(process, "eyebrow")}
              >
                {process?.eyebrow}
              </p>
              <h2
                className={`serif ${s.h2}`}
                data-tina-field={tinaField(process, "heading")}
              >
                {process?.heading}
              </h2>
            </div>
            <div className={s.steps}>
              {process?.steps?.map((step: any, i: number) => (
                <div key={i} className={s.stepRow}>
                  <div
                    className={s.stepCard}
                    data-align={i % 2 === 0 ? "start" : "end"}
                  >
                    <span
                      className={`serif ${s.stepBadge}`}
                      style={{ background: STEP_BADGES[i % STEP_BADGES.length] }}
                      data-tina-field={tinaField(step, "no")}
                    >
                      {step?.no}
                    </span>
                    <div>
                      <div className={s.stepTitleRow}>
                        <h3
                          className={s.stepTitle}
                          data-tina-field={tinaField(step, "title")}
                        >
                          {step?.title}
                        </h3>
                        {step?.tag ? (
                          <span
                            className={s.stepTag}
                            data-tina-field={tinaField(step, "tag")}
                          >
                            {step.tag}
                          </span>
                        ) : null}
                      </div>
                      <p
                        className={s.stepBody}
                        data-tina-field={tinaField(step, "body")}
                      >
                        {step?.body}
                      </p>
                    </div>
                  </div>
                  {i < (process?.steps?.length ?? 0) - 1 ? (
                    <Squiggle
                      flip={i % 2 === 1}
                      indent={i % 2 === 0 ? "left" : "right"}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* PAST WORK */}
      {ourWork && ourWork.visible !== false ? (
        <OurWork data={ourWork} theme="sunset" />
      ) : null}

      {/* START / CTA — questionnaire */}
      {cta?.visible !== false ? (
        <section className={s.startWrap} id="start" data-section="oneday_cta">
          <div className={s.startPanel}>
            <div>
              <p className={s.startEyebrow} data-tina-field={tinaField(cta, "eyebrow")}>
                {cta?.eyebrow}
              </p>
              <h2
                className={`serif ${s.startHeading}`}
                data-tina-field={tinaField(cta, "heading")}
              >
                {cta?.heading}
              </h2>
              <p className={s.startBody} data-tina-field={tinaField(cta, "body")}>
                {cta?.body}
              </p>
              <div className={s.startActions}>
                <Cta
                  label={cta?.ctaPrimary?.label}
                  url={cta?.ctaPrimary?.url}
                  location="oneday_start"
                  variant="cream"
                  tinaField={
                    cta?.ctaPrimary ? tinaField(cta.ctaPrimary, "label") : undefined
                  }
                />
              </div>
            </div>
            <div
              className={s.startImage}
              style={cta?.image ? { backgroundImage: `url(${cta.image})` } : undefined}
              aria-hidden="true"
            />
          </div>
        </section>
      ) : null}

      {/* CONTACT + FOOTER — shared block */}
      {contact?.visible !== false ? (
        <CtaSection
          id="contact"
          data={{
            heading: contact?.heading,
            body: contact?.body,
            cta: contact?.cta,
          }}
        />
      ) : null}
      </div>
    </SiteLayout>
  );
}
