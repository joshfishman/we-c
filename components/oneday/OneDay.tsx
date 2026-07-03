"use client";

import { useTina, tinaField } from "tinacms/dist/react";
import { Cta } from "../ui/Cta";
import { SiteLayout } from "../site/SiteLayout";
import { CaseStudy } from "../blocks/caseStudy/CaseStudy";
import { OurWork } from "../blocks/ourWork/OurWork";
import s from "./oneday.module.css";

const PILL_DOTS = ["#F0A6BE", "#EAF6FA", "#F4943E"];
const STAT_COLORS = ["#F3C57E", "#F0A6BE", "#EFA065"];
const STEP_BADGES = ["#E6849C", "#E8A44C", "#D8623F"];

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
            <div className={s.pills}>
              {hero?.pills?.map((pill: any, i: number) => (
                <span key={i} className={s.pill}>
                  <span
                    className={s.pillDot}
                    style={{ background: PILL_DOTS[i % PILL_DOTS.length] }}
                  />
                  {pill?.label}
                </span>
              ))}
            </div>
            {hero?.badge ? (
              <div className={s.badge} data-tina-field={tinaField(hero, "badge")}>
                <span className={s.badgeDot} />
                <span>{hero.badge}</span>
              </div>
            ) : null}
            <h1 className={`serif ${s.heroTitle}`}>
              <span data-tina-field={tinaField(hero, "headlineLine1")}>
                {hero?.headlineLine1}
              </span>
              <br />
              <span
                className="serif--italic"
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
                variant="cream"
                tinaField={
                  hero?.ctaPrimary ? tinaField(hero.ctaPrimary, "label") : undefined
                }
              />
              <Cta
                label={hero?.ctaSecondary?.label}
                url={hero?.ctaSecondary?.url}
                location="oneday_hero"
                variant="secondary"
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
                  style={{ color: STAT_COLORS[i % STAT_COLORS.length] }}
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
        <CaseStudy data={caseStudy} />
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
        <OurWork data={ourWork} />
      ) : null}

      {/* START CTA */}
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
            </div>
            <div className={s.startActions}>
              <Cta
                label={cta?.ctaPrimary?.label}
                url={cta?.ctaPrimary?.url}
                location="oneday_cta"
                variant="cream"
                tinaField={
                  cta?.ctaPrimary ? tinaField(cta.ctaPrimary, "label") : undefined
                }
              />
            </div>
          </div>
        </section>
      ) : null}
      </div>
    </SiteLayout>
  );
}
