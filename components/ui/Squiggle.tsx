import styles from "./squiggle.module.css";

/**
 * The dashed hand-drawn connector arrow. Shared by the One Day process steps
 * and the home Attract → Convert → Retain flow so both read as one design.
 *
 * Two directions, each drawn for the way it's used rather than one rotated
 * into the other: `down` arcs between stacked cards, `right` runs along a row.
 * Rotating the vertical arc 90° reads as a swoosh, because its curve is shaped
 * to fall rather than to travel sideways.
 *
 * In both, the dashed line lands on the caret's vertex so the caret reads as
 * the line's arrowhead rather than a V floating beside it, and the caret is
 * symmetric about that vertex. Stroke is currentColor ← --t-connector, so it
 * re-skins with the theme.
 */
export function Squiggle({
  flip,
  indent,
  direction = "down",
  className,
}: {
  flip?: boolean;
  /** Nudges the arrow off the centre line — for stacked columns only. */
  indent?: "left" | "right";
  direction?: "down" | "right";
  className?: string;
}) {
  const indentClass =
    indent === "left" ? styles.left : indent === "right" ? styles.right : "";
  return (
    <svg
      width="92"
      height="84"
      viewBox="0 0 92 84"
      fill="none"
      className={`${styles.squiggle}${indentClass ? ` ${indentClass}` : ""}${
        className ? ` ${className}` : ""
      }`}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
    >
      {direction === "right" ? (
        <>
          <path
            d="M16 45 C30 45 44 45 60 42"
            pathLength={97}
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="1 11"
          />
          {/* symmetric about the vertex: both arms 14 back, 13 out */}
          <path
            d="M49 56 L63 42 L49 29"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
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
        </>
      )}
    </svg>
  );
}
