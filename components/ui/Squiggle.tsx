import styles from "./squiggle.module.css";

/**
 * The dashed hand-drawn connector arrow. Shared by the One Day process steps
 * and the home Attract → Convert → Retain flow so both read as one design.
 *
 * The arrowhead tip sits off-centre inside the 92px box (x=59, or x=33 when
 * flipped), so `.left` / `.right` add a compensating margin that puts the tip
 * on the column's centre line. Stroke is currentColor ← --t-connector, so it
 * re-skins with the theme.
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
      <path
        d="M22 8 C 78 26, 14 50, 46 74"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="1 11"
      />
      <path
        d="M45 62 L59 76 L72 60"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
