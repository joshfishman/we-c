"use client";

import * as Popover from "@radix-ui/react-popover";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { tinaField } from "tinacms/dist/react";
import { Section } from "../../ui/Section";
import { Cta } from "../../ui/Cta";
import { Starfield } from "../../ui/Starfield";
import { getCaseCopy } from "../../ui/CaseStudyPopover";
import styles from "./ourWork.module.css";

/** Inline brand marks for the sunset "tech logo" row. */
const LOGO_SVGS: Record<string, { label: string; svg: React.ReactNode }> = {
  shopify: {
    label: "Shopify",
    svg: (
      <svg width="18" height="18" viewBox="0 0 48 55" aria-hidden="true">
        <path
          fill="#95BF47"
          d="M37.6 10.6c0-.3-.3-.4-.5-.4-.2 0-4.2-.3-4.2-.3s-2.8-2.8-3.1-3.1c-.3-.3-.9-.2-1.1-.1 0 0-.6.2-1.5.5-.9-2.6-2.5-5-5.3-5h-.4C20.9 1 19.9.4 19.1.4c-6.3 0-9.3 7.9-10.3 11.9-2.4.8-4.2 1.3-4.4 1.4-1.4.4-1.4.5-1.6 1.8C2.7 16.5 0 46.6 0 46.6L30.3 52l16.4-3.5S37.6 10.9 37.6 10.6Z"
        />
        <path
          fill="#5E8E3E"
          d="M37.1 10.2c-.2 0-4.2-.3-4.2-.3s-2.8-2.8-3.1-3.1c-.1-.1-.3-.2-.4-.2L30.3 52l16.4-3.5S37.6 10.9 37.6 10.6c0-.3-.3-.4-.5-.4Z"
        />
        <path
          fill="#FFF"
          d="M22.9 18.5l-1.9 5.7s-1.7-.9-3.8-.9c-3 0-3.2 1.9-3.2 2.4 0 2.6 6.9 3.6 6.9 9.8 0 4.9-3.1 8-7.3 8-5 0-7.6-3.1-7.6-3.1l1.3-4.4s2.6 2.3 4.9 2.3c1.5 0 2.1-1.2 2.1-2 0-3.4-5.6-3.6-5.6-9.3 0-4.8 3.4-9.4 10.4-9.4 2.7 0 4 .8 4 .8Z"
        />
      </svg>
    ),
  },
  meta: {
    label: "Meta",
    svg: (
      <svg width="18" height="18" viewBox="0 0 36 36" aria-hidden="true">
        <path
          fill="#0866FF"
          d="M12.1 9C7.9 9 5 13 5 18s2.7 9 6.8 9c2.5 0 4.2-1.3 6.1-4.4 1.4 2.3 2.4 3.4 3.3 4 .9.5 1.9.4 2.9.4 4.1 0 6.9-4.1 6.9-9s-2.8-9-6.9-9c-2 0-3.4 1-4.7 2.9-.4.6-.8 1.2-1.2 1.9-1.9-3.1-3.6-4.7-6-4.7Zm-.2 3.2c1.3 0 2.4 1.3 4 4-1.9 3.1-2.9 4.6-4 4.6-1.7 0-2.9-2-2.9-4.3s1.2-4.3 2.9-4.3Zm12.2 0c1.7 0 2.9 2 2.9 4.3s-1.2 4.3-2.9 4.3c-1.1 0-2-1.2-3.7-4 .3-.5.5-.9.8-1.4 1.2-2 2-3.2 2.9-3.2Z"
        />
      </svg>
    ),
  },
  facebook: {
    label: "Facebook",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <rect width="24" height="24" rx="6" fill="#1877F2" />
        <path
          fill="#fff"
          d="M14 24V13.4h2.9l.5-3.4H14V7.9c0-1 .3-1.7 1.7-1.7h1.8V3.2c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5V10H7.4v3.4h3.1V24z"
        />
      </svg>
    ),
  },
  google: {
    label: "Google",
    svg: (
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M45.1 24.5c0-1.6-.1-2.8-.4-4H24v7.3h12.1c-.2 1.9-1.6 4.8-4.5 6.7l6.5 5C42 42 45.1 34 45.1 24.5Z"
        />
        <path
          fill="#34A853"
          d="M24 46c5.9 0 10.9-1.9 14.5-5.3l-6.5-5c-1.8 1.2-4.1 2-8 2-6.1 0-11.3-4.1-13.2-9.7l-6.7 5.2C7.5 40.8 15.1 46 24 46Z"
        />
        <path
          fill="#FBBC05"
          d="M10.8 27.9c-.5-1.4-.8-2.9-.8-4.4s.3-3 .7-4.4l-6.7-5.2C2.4 17 1.5 20.4 1.5 23.5s.9 6.5 2.6 9.6l6.7-5.2Z"
        />
        <path
          fill="#EA4335"
          d="M24 9.4c3.4 0 5.8 1.5 7.1 2.7l5.7-5.6C33.3 3.1 28.9 1 24 1 15.1 1 7.5 6.2 4.1 13.9l6.7 5.2C12.7 13.5 17.9 9.4 24 9.4Z"
        />
      </svg>
    ),
  },
  instagram: {
    label: "Instagram",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="6" fill="#E1306C" />
        <circle cx="12" cy="12" r="5" fill="none" stroke="#fff" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1.3" fill="#fff" />
      </svg>
    ),
  },
  webflow: {
    label: "Webflow",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <rect width="24" height="24" rx="6" fill="#146EF5" />
        <path
          fill="#fff"
          d="M18.5 7.5l-3 6-2.3-4.2-2.2 4.2-3-6H7l3.5 9h1.7l2-3.9 2 3.9h1.7L21 7.5z"
        />
      </svg>
    ),
  },
  wordpress: {
    label: "WordPress",
    svg: (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="11" fill="#21759B" />
        <path
          fill="#fff"
          d="M4 12c0 3.2 1.9 6 4.6 7.3L4.7 8.6C4.2 9.6 4 10.8 4 12Zm13.4-.4c0-1-.4-1.7-.7-2.2-.4-.7-.8-1.2-.8-1.9 0-.7.6-1.4 1.4-1.4h.1A8 8 0 0 0 12 4a8 8 0 0 0-6.7 3.6h.5c.9 0 2.2-.1 2.2-.1.4 0 .5.6.1.7 0 0-.5.1-1 .1l3 8.9 1.8-5.4-1.3-3.5c-.4 0-.9-.1-.9-.1-.4 0-.4-.7.1-.7 0 0 1.4.1 2.2.1.9 0 2.2-.1 2.2-.1.5 0 .5.6.1.7 0 0-.5.1-1 .1l3 8.8.8-2.7c.4-1.1.6-1.9.6-2.6ZM12.2 13l-2.5 7.2c.7.2 1.5.3 2.3.3 1 0 1.9-.2 2.7-.5l-.1-.1L12.2 13Zm6.9-4.5c0 .8-.1 1.6-.6 2.7l-2.3 6.7A8 8 0 0 0 20 12c0-1.3-.3-2.5-.9-3.5Z"
        />
      </svg>
    ),
  },
};

export function OurWork({
  data,
  theme = "sunset",
}: {
  data: any;
  theme?: "sage" | "sunset" | "green";
}) {
  // sunset + green share the staggered layout; they differ only in color.
  const staggered = theme === "sunset" || theme === "green";
  const green = theme === "green";

  return (
    <Section name="our_work" id="work" className={styles.wrap}>
      <div
        className={`${styles.panel} ${staggered ? styles.sunset : ""} ${
          green ? styles.green : ""
        }`}
      >
        {/* Night sky is at the foot of this panel, so the field is flipped. */}
        <Starfield flip />
        <div className={styles.head}>
          <div>
            <p
              className={`${styles.eyebrow} ${staggered ? "" : "gradText"}`}
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
          <Cta
            label={data.cta?.label}
            url={data.cta?.url}
            location="our_work"
            variant={green ? "secondary" : staggered ? "dusk" : "primary"}
            tinaField={data.cta ? tinaField(data.cta, "label") : undefined}
          />
        </div>

        <div className={styles.rows}>
          {data.projects?.map((project: any, i: number) => {
            const imgs: string[] =
              Array.isArray(project?.images) && project.images.length
                ? project.images
                : project?.image
                  ? [project.image]
                  : [];
            const isFan = imgs.length > 1;
            const single = imgs[0] || "";
            const isShot = single.toLowerCase().endsWith(".png");
            const isStonedMockup = single
              .toLowerCase()
              .includes("work-stoned-immaculate");
            const imageLeft = i % 2 === 0;
            const logos: string[] = Array.isArray(project?.logos)
              ? project.logos
              : [];
            const caseCopy = getCaseCopy(project);

            return (
              <div
                key={i}
                className={`${styles.row} ${imageLeft ? styles.imgLeft : styles.imgRight}`}
              >
                <div className={styles.textPanel}>
                  {project?.badge ? (
                    <span className={styles.badge}>{project.badge}</span>
                  ) : null}
                  <div
                    className={styles.projTitle}
                    data-tina-field={tinaField(project, "title")}
                  >
                    {project?.title}
                  </div>
                  {project?.services ? (
                    <div className={styles.projCat}>{project.services}</div>
                  ) : null}
                  {staggered && logos.length ? (
                    <div className={styles.logos}>
                      {logos.map((key) => {
                        const logo = LOGO_SVGS[key?.toLowerCase()];
                        if (!logo) return null;
                        return (
                          <span key={key} className={styles.logo}>
                            {logo.svg}
                            {logo.label}
                          </span>
                        );
                      })}
                    </div>
                  ) : null}
                  <Popover.Root>
                    <Popover.Trigger asChild>
                      <button
                        type="button"
                        className={`btn btn--secondary ${styles.readMore}`}
                      >
                        Read more <span aria-hidden="true">→</span>
                      </button>
                    </Popover.Trigger>
                    <Popover.Portal>
                      <Popover.Content
                        className={styles.casePop}
                        sideOffset={10}
                        collisionPadding={14}
                      >
                        <span className={styles.casePopKicker}>
                          Project Details
                        </span>
                        <h3 className={`serif ${styles.casePopTitle}`}>
                          {caseCopy.title}
                        </h3>
                        {caseCopy.rich ? (
                          <div className={styles.casePopBody}>
                            <TinaMarkdown content={caseCopy.rich} />
                          </div>
                        ) : (
                          <div
                            className={styles.casePopBody}
                            dangerouslySetInnerHTML={{
                              __html: caseCopy.bodyHtml,
                            }}
                          />
                        )}
                        <Popover.Close
                          className={styles.casePopClose}
                          aria-label="Close"
                        >
                          ×
                        </Popover.Close>
                        <Popover.Arrow className={styles.casePopArrow} />
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                </div>

                {isFan ? (
                  <div className={`${styles.media} ${styles.fan}`}>
                    {imgs.map((src, j) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={j}
                        src={src}
                        alt={`${project?.title || ""} ${j + 1}`}
                        className={styles.fanItem}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div
                    className={`${styles.media} ${isShot ? styles.mediaShot : styles.mediaFill} ${isStonedMockup ? styles.mediaContain : ""}`}
                  >
                    {single ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={single} alt={project?.title || ""} />
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </Section>
  );
}
