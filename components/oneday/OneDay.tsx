"use client";

import { useTina, tinaField } from "tinacms/dist/react";
import { Cta } from "../ui/Cta";
import { BgVideo } from "../ui/BgVideo";
import { Starfield } from "../ui/Starfield";
import { Squiggle } from "../ui/Squiggle";
import { Typewriter, type TWSegment } from "../ui/Typewriter";
import { SiteLayout } from "../site/SiteLayout";
import { CaseStudy } from "../blocks/caseStudy/CaseStudy";
import { OurWork } from "../blocks/ourWork/OurWork";
import { CtaSection } from "../blocks/cta/CtaSection";
import s from "./oneday.module.css";

// Animated gradient badges. Every stop stays dark enough that the white
// numeral keeps WCAG AA contrast (large text) right through the animation.
const STEP_BADGES = [s.badge1, s.badge2, s.badge3];

/**
 * Where the arc's curve actually sits, as a % of .dayArc's height.
 *
 * The SVG is viewBox="0 0 760 96" with preserveAspectRatio="none", so the curve
 * stretches to whatever height .dayArc is — 96px, but 118px once the pills wrap
 * to two lines on mobile. Percentages stretch with it; the fixed px offsets
 * these replace did not, which left the suns off the line at that width.
 *
 * For the path `M 40 84 Q 380 -6 720 84`, x(t) = 40 + 680t (the t² terms
 * cancel), so a chip at 10%/50%/90% of the 760-wide viewBox sits at
 * t = .0529/.5/.9471, where the curve's y = 74.98/39/74.98.
 */
const ARC_CURVE_Y = {
  outer: `${(74.98 / 96) * 100}%`, // 78.1%
  apex: `${(39 / 96) * 100}%`, // 40.6%
};

// Hero day-arc chips: fixed position/colors per index (0=morning,1=midday,2=sunset).
// `group` anchors the SUN's centre to the curve; the pill stacks above it.
const ARC_CHIPS = [
  {
    group: {
      left: "10%",
      top: ARC_CURVE_Y.outer,
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
      top: ARC_CURVE_Y.apex,
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
      left: "90%",
      top: ARC_CURVE_Y.outer,
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

  // Typed hero headline. Each line can lead with an accent phrase that carries
  // the sunset gradient ("Plan", "Go Live"); the rest of the line stays cream.
  // Both are editor fields, so which words glow is content, not markup.
  const titleSegments: TWSegment[] = [];
  const pushLine = (accent?: string, rest?: string) => {
    if (!accent && !rest) return;
    if (titleSegments.length) titleSegments.push({ break: true });
    if (accent) titleSegments.push({ text: accent, className: s.heroTitleSunset });
    if (rest) titleSegments.push({ text: accent ? ` ${rest}` : rest });
  };
  pushLine(hero?.headlineLine1Accent, hero?.headlineLine1);
  pushLine(hero?.headlineLine2Accent, hero?.headlineLine2);

  return (
    <SiteLayout settings={settings} headerTone="sky" theme="sunset">
      <div className={s.page} data-theme="sunset">
        {/* HERO */}
      {hero?.visible !== false ? (
        <section className={s.hero} id="top" data-section="oneday_hero">
          <div className={s.heroBg} aria-hidden="true">
            <BgVideo
              src={hero?.bgVideo}
              mobileSrc={hero?.bgVideoMobile}
              poster={hero?.bgPoster}
              className={s.heroMedia}
            />
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
                  <div
                    key={i}
                    className={s.arcGroup}
                    style={{
                      ...chip.group,
                      // The sun is the group's last child, so pulling the group
                      // up by its own height lands the sun's bottom on the
                      // curve; nudging back down by its radius centres it there
                      // — whatever height the pill above it grows to.
                      transform: `translate(-50%, calc(-100% + ${
                        chip.belowSize / 2
                      }px))`,
                    }}
                  >
                    <span className={s.arcPill}>
                      <span
                        className={s.arcPillGradient}
                        style={{
                          background: `linear-gradient(90deg, rgba(240,166,190,0), ${chip.accent}, rgba(240,166,190,0))`,
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
              <Typewriter segments={titleSegments} />
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
          {/* The navy lives on this inner band, not the section, so the
              section's padding is cream gap (like every other section) instead
              of navy — otherwise the block reads as half-spaced. */}
          <div className={s.processPanel}>
            <Starfield />
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
                      className={`${s.stepBadge} ${STEP_BADGES[i % STEP_BADGES.length]}`}
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
