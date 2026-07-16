import styles from "./squiggle.module.css";

/**
 * The dashed hand-drawn connector arrow. Shared by the One Day process steps
 * and the home Attract → Convert → Retain flow so both read as one design.
 *
 * The dashed line lands exactly on the caret's vertex (59,76) so the caret
 * reads as the line's arrowhead rather than a V floating beside it.
 * `.left` / `.right` then nudge the whole arrow off the centre line so the
 * two arrows don't stack in a column. Stroke is currentColor ← --t-connector,
 * so it re-skins with the theme.
 */
export function Squiggle({
  flip,
  indent,
  className,
}: {
  flip?: boolean;
  indent: "left" | "right";
  className?: string;
}) {
  return (
    <svg
      width="92"
      height="84"
      viewBox="0 0 92 84"
      fill="none"
      className={`${styles.squiggle} ${
        indent === "left" ? styles.left : styles.right
      }${className ? ` ${className}` : ""}`}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
    >
      {/* ends on the caret's vertex so the caret is this line's arrowhead */}
      <path
        d="M22 8 C 80 28, 20 54, 59 76"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="1 11"
      />
      {/* symmetric about the vertex: both arms 13 across, 14 up */}
      <path
        d="M46 62 L59 76 L72 62"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
