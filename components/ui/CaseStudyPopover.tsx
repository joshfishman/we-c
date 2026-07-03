"use client";

import { useEffect } from "react";

/** Per-case default copy, keyed by a slug of the project title. */
const CASE_COPY: Record<string, string> = {
  "stoned-immaculate-clothing":
    "<p><strong>3× revenue in six months.</strong> WE rebuilt Stoned Immaculate's Shopify store from the ground up and implemented a structured ad-testing and scaling framework across paid social and search.</p><p><strong>What we did:</strong> Shopify theme &amp; PDP rebuild; creative testing on Meta &amp; Google; a scaling framework driven by blended ROAS.</p>",
  "california-chicken-cafe":
    "<p>A custom WordPress theme built hand-in-hand with the in-house team, plus a branded store locator tied to their delivery partners.</p>",
  "11-honore":
    "<p><strong>From idea to exit.</strong></p><p>Two full site builds, launch &amp; growth marketing, and ongoing optimization — all the way through to acquisition.</p>",
  "hudson-jeans":
    "<p><strong>6× ROI across all campaigns.</strong> Integrated digital and retail audiences, headlined by the Fall 2020 / Kaia Gerber collaboration launch.</p>",
  ovando:
    "<p>An editorial, image-led site for a luxury floral designer — with seasonal refreshes and a smooth content workflow.</p>",
};

function slugify(s: string) {
  return (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Resolve the popover body for a project: explicit override → default map → generic. */
export function getCaseCopy(project: any): { title: string; bodyHtml: string } {
  const title = project?.title || "";
  const bodyHtml =
    project?.caseBody ||
    CASE_COPY[slugify(title)] ||
    `<p>${project?.services || "A project we're proud of."}</p>`;
  return { title, bodyHtml };
}

export function CaseStudyPopover({
  open,
  title,
  bodyHtml,
  anchor,
  onClose,
}: {
  open: boolean;
  title: string;
  bodyHtml: string;
  anchor: { x: number; y: number } | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !anchor || typeof window === "undefined") return null;

  const w = Math.min(400, window.innerWidth - 24);
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const estH = Math.min(520, vh - 24);
  const ax = anchor.x;
  const ay = anchor.y;
  const left = Math.min(Math.max(ax - w / 2, 12), vw - w - 12);
  let top = ay + 16;
  let originY = -16;
  if (top + estH > vh - 12) {
    top = Math.max(12, ay - estH - 16);
    originY = estH + 16;
  }
  const originX = Math.min(Math.max(ax - left, 20), w - 20);
  const pointerUp = originY < 0;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "transparent",
        animation: "fadeIn .15s ease both",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={title}
        style={{
          position: "fixed",
          left: `${left}px`,
          top: `${top}px`,
          width: `${w}px`,
          background: "#FFFDF8",
          borderRadius: "18px",
          boxShadow: "0 32px 70px -24px rgba(20,10,20,0.55)",
          transformOrigin: `${originX}px ${originY}px`,
          animation: "popIn .22s cubic-bezier(.34,1.3,.5,1) both",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: `${originX - 7}px`,
            width: "14px",
            height: "14px",
            background: "#FFFDF8",
            transform: "rotate(45deg)",
            borderRadius: "3px",
            zIndex: 1,
            ...(pointerUp ? { top: "-6px" } : { bottom: "-6px" }),
          }}
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            zIndex: 3,
            width: "34px",
            height: "34px",
            border: "none",
            borderRadius: "50%",
            background: "#F1E7D8",
            color: "#3A2230",
            fontSize: "20px",
            lineHeight: 1,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ×
        </button>
        <div
          style={{
            padding: "24px 26px 26px",
            maxHeight: `${estH}px`,
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            position: "relative",
            zIndex: 2,
            background: "#FFFDF8",
            borderRadius: "18px",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#C2683E",
              marginBottom: "6px",
            }}
          >
            Project Details
          </div>
          <h3
            className="serif"
            style={{
              fontWeight: 500,
              fontSize: "20px",
              lineHeight: 1.12,
              letterSpacing: "-0.01em",
              color: "#2B1626",
              marginBottom: "14px",
              paddingRight: "30px",
            }}
          >
            {title}
          </h3>
          <div
            style={{ fontSize: "15px", lineHeight: 1.65, color: "#3A2230" }}
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        </div>
      </div>
    </div>
  );
}
