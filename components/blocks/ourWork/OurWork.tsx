"use client";

import { tinaField } from "tinacms/dist/react";
import { Section } from "../../ui/Section";
import { Cta } from "../../ui/Cta";
import { ImageSlot } from "../../ui/ImageSlot";
import styles from "./ourWork.module.css";

export function OurWork({ data }: { data: any }) {
  return (
    <Section name="our_work" id="work" className={styles.wrap}>
      <div className={styles.panel}>
        <div className={styles.inner}>
          <div className={styles.head}>
            <div>
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
            </div>
            <Cta
              label={data.cta?.label}
              url={data.cta?.url}
              location="our_work"
              variant="secondary"
              tinaField={data.cta ? tinaField(data.cta, "label") : undefined}
            />
          </div>

          <div className={styles.grid}>
            {data.projects?.map((project: any, i: number) => (
              <a
                key={i}
                href={project?.url || "#"}
                className={styles.project}
                data-tina-field={tinaField(project, "title")}
              >
                <div className={styles.thumb}>
                  <ImageSlot
                    src={project?.image}
                    alt={project?.title}
                    placeholder="Drop a project image"
                  />
                  {project?.badge ? (
                    <span className={styles.badge}>{project.badge}</span>
                  ) : null}
                </div>
                <div className={styles.meta}>
                  <div>
                    <div className={styles.projTitle}>{project?.title}</div>
                    <div className={styles.projCat}>{project?.services}</div>
                  </div>
                  <span className={styles.viewCase}>
                    Read more <span aria-hidden="true">→</span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
