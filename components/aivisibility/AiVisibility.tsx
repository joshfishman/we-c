"use client";

import { useTina, tinaField } from "tinacms/dist/react";
import { Cta } from "../ui/Cta";
import { BgVideo } from "../ui/BgVideo";
import { Starfield } from "../ui/Starfield";
import { HeroHeadline, type HeadlineSegment } from "../ui/HeroHeadline";
import { SiteLayout } from "../site/SiteLayout";
import { CtaSection } from "../blocks/cta/CtaSection";
import { HowItWorks } from "./HowItWorks";
// Shares the One Day page's sections (hero, stats strip, cards, process) so the
// two offer pages read as one system; only the AI-specific pieces live in a.
import s from "../oneday/oneday.module.css";
import a from "./aiVisibility.module.css";

const STEP_BADGES = [s.badge1, s.badge2, s.badge3];

// Placeholder result cards are scaffolding for the editor: visible (dashed) in
// development, never rendered on the live site.
const SHOW_PLACEHOLDERS = process.env.NODE_ENV !== "production";

export function AiVisibility(props: {
  page: { data: any; variables: any; query: string };
  settings: { data: any; variables: any; query: string };
}) {
  const { data } = useTina(props.page);
  const { data: settingsData } = useTina(props.settings);
  const settings = settingsData?.settings;
  const page = data.aiVisibility;
  const hero = page?.hero;
  const proof = page?.proof;
  const problem = page?.problem;
  const channels = page?.channels;
  const process = page?.process;
  const results = page?.results;
  const faq = page?.faq;
  const contact = page?.contact;

  // Headline markup (editor-friendly, no code): *words* get the sunset
  // highlight, and a standalone "WE" renders as the logo wordmark.
  const titleSegments: HeadlineSegment[] = [];
  const pushMarked = (text: string) => {
    text.split(/(\*[^*]+\*)/).forEach((part) => {
      if (!part) return;
      if (/^\*[^*]+\*$/.test(part)) {
        titleSegments.push({ text: part.slice(1, -1), className: s.heroTitleSunset });
        return;
      }
      part.split(/(\bWE\b)/).forEach((bit) => {
        if (!bit) return;
        titleSegments.push(
          bit === "WE" ? { text: bit, className: `gradText--gold ${a.heroWe}` } : { text: bit }
        );
      });
    });
  };
  const pushLine = (accent?: string, rest?: string) => {
    if (!accent && !rest) return;
    if (titleSegments.length) titleSegments.push({ break: true });
    if (accent)
      titleSegments.push({ text: accent, className: s.heroTitleSunset });
    if (rest) pushMarked(accent ? ` ${rest}` : rest);
  };
  pushLine(hero?.headlineLine1Accent, hero?.headlineLine1);
  pushLine(hero?.headlineLine2Accent, hero?.headlineLine2);

  const resultCards = (results?.cards || []).filter(
    (c: any) => SHOW_PLACEHOLDERS || !c?.placeholder
  );

  return (
    <SiteLayout settings={settings} headerTone="sky" theme="sunset">
      <div
        className={s.page}
        data-theme="sunset"
        // With the hero hidden, clear the fixed header for the first section.
        style={hero?.visible === false ? { paddingTop: "var(--header-h, 92px)" } : undefined}
      >
        {/* HERO */}
        {hero?.visible !== false ? (
          <section
            className={`${s.hero} ${a.heroAi}`}
            id="top"
            data-section="ai_hero"
          >
            <div className={s.heroBg} aria-hidden="true">
              <BgVideo poster={hero?.bgImage} className={s.heroMedia} />
              <div className={s.scrimTop} />
              <div className={s.scrimCenter} />
              <div className={s.scrimVignette} />
            </div>
            <div
              className={`${s.heroContent} ${
                proof?.visible === false ? a.heroNoStrip : ""
              }`}
            >
              <h1 className={`serif ${s.heroTitle} ${a.heroTitleAi}`}>
                <HeroHeadline segments={titleSegments} />
              </h1>
              <p
                className={`${s.heroSub} ${a.heroSubWide}`}
                data-tina-field={tinaField(hero, "subhead")}
              >
                {hero?.subhead}
              </p>
              <div className={s.heroActions}>
                <Cta
                  label={hero?.ctaPrimary?.label}
                  url={hero?.ctaPrimary?.url}
                  location="ai_hero"
                  variant="primary"
                  tinaField={
                    hero?.ctaPrimary
                      ? tinaField(hero.ctaPrimary, "label")
                      : undefined
                  }
                />
                <Cta
                  label={hero?.ctaSecondary?.label}
                  url={hero?.ctaSecondary?.url}
                  location="ai_hero"
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

        {/* STATS STRIP */}
        {proof?.visible !== false ? (
          <section className={s.proofWrap} data-section="ai_proof">
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

        {/* EVERYWHERE AI LOOKS (channels): AI chat → where we publish → the result */}
        {channels?.visible !== false ? <HowItWorks data={channels} /> : null}

        {/* RESULTS */}
        {results?.visible !== false && resultCards.length ? (
          <section className={s.quality} data-section="ai_results">
            <div className={s.qualityHead}>
              <p
                className={s.qualityEyebrow}
                data-tina-field={tinaField(results, "eyebrow")}
              >
                {results?.eyebrow}
              </p>
              <h2
                className={`serif ${s.h2}`}
                data-tina-field={tinaField(results, "heading")}
              >
                {results?.heading}
              </h2>
            </div>
            <div className={s.qualityGrid}>
              {resultCards.map((card: any, i: number) => (
                <div
                  key={i}
                  className={`${s.qualityCard} ${
                    card?.placeholder ? a.placeholder : ""
                  }`}
                >
                  {card?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className={a.resultImage}
                      src={card.image}
                      alt={card?.imageAlt || ""}
                      loading="lazy"
                      data-tina-field={tinaField(card, "image")}
                    />
                  ) : null}
                  <div className={a.resultTop}>
                    <div
                      className={`serif ${a.resultMetric}`}
                      data-tina-field={tinaField(card, "metric")}
                    >
                      {card?.metric}
                    </div>
                    {card?.label ? (
                      <p
                        className={a.resultLabel}
                        data-tina-field={tinaField(card, "label")}
                      >
                        {card.label}
                      </p>
                    ) : null}
                  </div>
                  <h3
                    className={`${s.qualityTitle} ${a.resultTitle}`}
                    data-tina-field={tinaField(card, "title")}
                  >
                    {card?.title}
                  </h3>
                  <p
                    className={s.qualityBody}
                    data-tina-field={tinaField(card, "body")}
                  >
                    {card?.body}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* HOW IT WORKS */}
        {process?.visible !== false ? (
          <section
            className={`${s.process} ${a.bandFlush}`}
            id="process"
            data-section="ai_process"
          >
            <div className={s.processPanel}>
              <Starfield />
              <div className={s.processInner}>
                <div className={`${s.processHead} ${a.processHeadCenter}`}>
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
                {/* Steps stack vertically, one per row. */}
                <div
                  className={a.stepGrid}
                  data-cols={(process?.steps?.length ?? 0) === 4 ? 2 : 3}
                >
                  {process?.steps?.map((step: any, i: number) => (
                    <div key={i} className={`${s.stepCard} ${a.stepGridCard}`}>
                      {/* Left: tag chip above the number. Right: title and description. */}
                      <div className={a.stepGridTop}>
                        {step?.tag ? (
                          <span
                            className={`${s.stepTag} ${a.stepGridTag}`}
                            data-tina-field={tinaField(step, "tag")}
                          >
                            {step.tag}
                          </span>
                        ) : null}
                        <span
                          className={`${s.stepBadge} ${a.stepGridBadge} ${
                            STEP_BADGES[i % STEP_BADGES.length]
                          }`}
                          data-tina-field={tinaField(step, "no")}
                        >
                          {step?.no}
                        </span>
                      </div>
                      <div className={a.stepGridText}>
                        <h3
                          className={s.stepTitle}
                          data-tina-field={tinaField(step, "title")}
                        >
                          {step?.title}
                        </h3>
                        <p
                          className={s.stepBody}
                          data-tina-field={tinaField(step, "body")}
                        >
                          {step?.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* THE PROBLEM: an example AI answer that leaves you out */}
        {problem?.visible !== false ? (
          <section className={s.quality} data-section="ai_problem">
            <div className={a.problemGrid}>
              <div>
                <p
                  className={s.qualityEyebrow}
                  data-tina-field={tinaField(problem, "eyebrow")}
                >
                  {problem?.eyebrow}
                </p>
                <h2
                  className={`serif ${s.h2}`}
                  data-tina-field={tinaField(problem, "heading")}
                >
                  {problem?.heading}
                </h2>
                <p
                  className={a.problemBody}
                  data-tina-field={tinaField(problem, "body")}
                >
                  {problem?.body}
                </p>
              </div>
              <figure className={a.chat} aria-label="Example AI answer">
                <p className={a.chatTag}>Example</p>
                <p
                  className={a.chatAsk}
                  data-tina-field={tinaField(problem, "prompt")}
                >
                  {problem?.prompt}
                </p>
                <div className={a.chatAnswer}>
                  <p data-tina-field={tinaField(problem, "answerIntro")}>
                    {problem?.answerIntro}
                  </p>
                  <ol className={a.chatList}>
                    {problem?.answers?.map((ans: any, i: number) => (
                      <li key={i}>
                        <span
                          className={a.chatName}
                          data-tina-field={tinaField(ans, "name")}
                        >
                          {ans?.name}
                        </span>
                        <span
                          className={a.chatNote}
                          data-tina-field={tinaField(ans, "note")}
                        >
                          {ans?.note}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
                <p
                  className={a.chatMissing}
                  data-tina-field={tinaField(problem, "missingLabel")}
                >
                  {problem?.missingLabel}
                </p>
              </figure>
            </div>
          </section>
        ) : null}

        {/* FAQ */}
        {faq?.visible !== false ? (
          <section className={s.quality} data-section="ai_faq">
            <div>
              <div className={`${s.qualityHead} ${a.faqHead}`}>
                <p
                  className={s.qualityEyebrow}
                  data-tina-field={tinaField(faq, "eyebrow")}
                >
                  {faq?.eyebrow}
                </p>
                <h2
                  className={`serif ${s.h2}`}
                  data-tina-field={tinaField(faq, "heading")}
                >
                  {faq?.heading}
                </h2>
              </div>
              <div className={a.faq}>
                {faq?.items?.map((item: any, i: number) => (
                  <div key={i} className={a.faqItem}>
                    <h3
                      className={a.faqQ}
                      data-tina-field={tinaField(item, "q")}
                    >
                      {item?.q}
                    </h3>
                    <p
                      className={a.faqA}
                      data-tina-field={tinaField(item, "a")}
                    >
                      {item?.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* FREE CHECK / CONTACT + FOOTER */}
        {contact?.visible !== false ? (
          <CtaSection
            id="contact"
            data={{ ...contact, location: "ai_contact", flush: true }}
          />
        ) : null}
      </div>
    </SiteLayout>
  );
}
