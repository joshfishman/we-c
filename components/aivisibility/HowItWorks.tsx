"use client";

import { tinaField } from "tinacms/dist/react";
import { LuSparkles, LuArrowUp, LuTrendingUp } from "react-icons/lu";
import { Cta } from "../ui/Cta";
import { ChannelIcons } from "./ChannelIcons";
import { Typewriter } from "../ui/Typewriter";
import h from "./howItWorks.module.css";

/**
 * "Everywhere AI looks": the AI Visibility story, top to bottom.
 *   - Top: the section heading, beside an example AI chat window that names
 *     the client.
 *   - Middle (featured): where we publish, one tile per channel with its
 *     logos and a line on what we do there.
 *   - Bottom: a small "The result" card (new customers, reported monthly).
 * Then an optional offer card (off by default: it repeats the footer form).
 * Content: `channels` in content/aiVisibility/index.json (Tina: "How it works (channels)").
 */

export function HowItWorks({ data }: { data: any }) {
  const goal = data?.goal;
  const publish = data?.publish;
  const measure = data?.measure;
  const offer = data?.offer;

  return (
    <section
      className={h.section}
      id="how-it-works"
      data-section="ai_how"
      data-reveal="stagger"
    >
      <div className={h.panel}>
        <div className={h.inner}>
          {/* TOP: the goal, with the example AI chat beside it */}
          <div className={h.top}>
            <div className={h.topText}>
              {data?.eyebrow ? (
                <p className={h.eyebrow} data-reveal-item data-tina-field={tinaField(data, "eyebrow")}>
                  {data.eyebrow}
                </p>
              ) : null}
              <h2 className={`serif ${h.heading}`} data-reveal-item>
                {data?.headingAccent ? (
                  <span className={h.accent} data-tina-field={tinaField(data, "headingAccent")}>
                    {data.headingAccent}
                  </span>
                ) : null}{" "}
                <span className={h.italic} data-tina-field={tinaField(data, "heading")}>
                  {data?.heading}
                </span>
              </h2>
              {data?.intro ? (
                <p className={h.intro} data-reveal-item data-tina-field={tinaField(data, "intro")}>
                  {data.intro}
                </p>
              ) : null}
            </div>
            <figure data-reveal-item className={h.chat} aria-label="Example AI chat">
                  <div className={h.chatBar}>
                    <span className={h.chatDots} aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </span>
                    <div className={h.chatLogos} data-tina-field={tinaField(goal, "iconSet")}>
                      <ChannelIcons set={goal?.iconSet || "ai"} />
                    </div>
                    <span aria-hidden="true" />
                  </div>
                  <div className={h.chatBody}>
                    <p className={h.chatAsk} data-tina-field={tinaField(goal, "prompt")}>
                      {goal?.prompt}
                    </p>
                    <div className={h.chatReply}>
                      <span className={h.chatAvatar} aria-hidden="true">
                        <LuSparkles />
                      </span>
                      <div className={h.chatReplyText}>
                        <p>
                          <span data-tina-field={tinaField(goal, "answerLead")}>
                            {goal?.answerLead}
                          </span>{" "}
                          <mark className={h.chatName} data-tina-field={tinaField(goal, "businessName")}>
                            {goal?.businessName}
                          </mark>
                          {goal?.answerRest ? (
                            <span data-tina-field={tinaField(goal, "answerRest")}>
                              {/^[.,;:!?]/.test(goal.answerRest) ? "" : " "}
                              {goal.answerRest}
                            </span>
                          ) : null}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={h.chatInputWrap} aria-hidden="true">
                    <div className={h.chatInput}>
                      {/* The caption types itself into the search field, like
                          someone asking the AI. */}
                      <span className={goal?.caption ? h.chatTyped : undefined}>
                        {goal?.caption ? (
                          <Typewriter
                            segments={[{ text: goal.caption }]}
                            startOnView
                            startDelay={300}
                            speed={55}
                          />
                        ) : (
                          "Ask anything"
                        )}
                      </span>
                      <span className={h.chatSend}>
                        <LuArrowUp />
                      </span>
                    </div>
                  </div>
                </figure>
          </div>

          {/* MIDDLE: where we publish, expanded */}
          <div className={`${h.card} ${h.cardFeature}`} data-reveal-item>
            <div className={h.cardHead}>
              <h3 className={`serif ${h.cardTitle}`} data-tina-field={tinaField(publish, "title")}>
                {publish?.title}
              </h3>
              <p className={h.cardBody} data-tina-field={tinaField(publish, "body")}>
                {publish?.body}
              </p>
            </div>
            <ul className={h.tiles}>
              {publish?.cards?.map((card: any, i: number) => (
                <li key={i} className={h.tile} data-reveal-item>
                  <div data-tina-field={tinaField(card, "iconSet")}>
                    <ChannelIcons set={card?.iconSet} />
                  </div>
                  <p className={h.tileTitle} data-tina-field={tinaField(card, "title")}>
                    {card?.title}
                  </p>
                  {card?.body ? (
                    <p className={h.tileBody} data-tina-field={tinaField(card, "body")}>
                      {card.body}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          {/* BOTTOM: the result, as a small card */}
          {measure?.title || measure?.body ? (
            <div className={h.result} data-reveal-item>
              {/* "The result" label to the left of the icon, on one row. */}
              <div className={h.resultTop}>
                {measure?.label ? (
                  <p
                    className={`${h.cardLabel} ${h.resultLabel}`}
                    data-tina-field={tinaField(measure, "label")}
                  >
                    {measure.label}
                  </p>
                ) : null}
                <span className={h.resultIcon} aria-hidden="true">
                  <LuTrendingUp />
                </span>
              </div>
              <div className={h.resultText}>
                <h3 className={`serif ${h.resultTitle}`} data-tina-field={tinaField(measure, "title")}>
                  {measure?.title}
                </h3>
                <p className={h.resultBody} data-tina-field={tinaField(measure, "body")}>
                  {measure?.body}
                </p>
              </div>
            </div>
          ) : null}

          {/* OFFER */}
          {offer?.visible !== false ? (
            <div className={h.offer}>
              {offer?.eyebrow ? (
                <p className={h.offerEyebrow} data-tina-field={tinaField(offer, "eyebrow")}>
                  {offer.eyebrow}
                </p>
              ) : null}
              <h3 className={`serif ${h.offerHeading}`} data-tina-field={tinaField(offer, "heading")}>
                {offer?.heading}
              </h3>
              <div className={h.offerCta}>
                <Cta
                  label={offer?.buttonLabel}
                  url={offer?.buttonUrl}
                  location="ai_how"
                  variant="primary"
                  tinaField={offer ? tinaField(offer, "buttonLabel") : undefined}
                />
              </div>
              {offer?.note ? (
                <p className={h.offerNote} data-tina-field={tinaField(offer, "note")}>
                  {offer.note}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
