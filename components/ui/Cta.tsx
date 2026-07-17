"use client";

import { trackCtaClick, trackLead, trackOutbound } from "../../lib/track";
import { useQuiz } from "../quiz/QuizContext";

type Props = {
  label?: string | null;
  url?: string | null;
  location: string;
  /** primary = sunset CTA · secondary = green pill · cream = light pill · dusk = purple→orange pill */
  variant?: "primary" | "secondary" | "cream" | "dusk";
  /** Tina field reference for inline editing of the label. */
  tinaField?: string;
  className?: string;
};

function isLead(url?: string | null) {
  if (!url) return false;
  return (
    url.startsWith("mailto:") ||
    url.toLowerCase().includes("contact") ||
    url.toLowerCase().includes("project")
  );
}

function isOutbound(url?: string | null) {
  return !!url && /^https?:\/\//i.test(url);
}

export function Cta({
  label,
  url,
  location,
  variant = "primary",
  tinaField,
  className,
}: Props) {
  const quiz = useQuiz();
  if (!label) return null;
  const href = url || "#";
  const opensSurvey = href === "#survey" && quiz.enabled;
  const outbound = isOutbound(href);
  const lead = isLead(href);

  const onClick = () => {
    if (lead) trackLead(label, location);
    else trackCtaClick(label, location);
    if (outbound) trackOutbound(href);
  };

  if (opensSurvey) {
    return (
      <button
        type="button"
        className={`btn btn--${variant}${className ? ` ${className}` : ""}`}
        data-tina-field={tinaField}
        onClick={() => {
          trackCtaClick(label, location);
          quiz.open();
        }}
      >
        {label}
      </button>
    );
  }

  return (
    <a
      href={href}
      className={`btn btn--${variant}${className ? ` ${className}` : ""}`}
      data-tina-field={tinaField}
      onClick={onClick}
      {...(outbound ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {label}
    </a>
  );
}
