"use client";

/**
 * TextCircle — text standing on an upright 3D cylinder that rotates around the
 * vertical axis. Glyphs are tall + condensed and the phrase auto-repeats to
 * fill the ring (no big gaps). Pure CSS 3D.
 *
 *   <TextCircle text="We grow everywhere" radius={300} fontSize={64} />
 */
export type TextCircleProps = {
  text?: string;
  /** Separator between repeats of the phrase. */
  separator?: string;
  /** Cylinder radius in px. */
  radius?: number;
  fontSize?: number;
  /** Seconds per full rotation. */
  speed?: number;
  reverse?: boolean;
  /** Slight forward lean in degrees. */
  lean?: number;
  color?: string;
  /** Letter-spacing in em (negative = tighter). */
  tracking?: number;
  /** Vertical stretch (taller letters). */
  stretchY?: number;
  /** Horizontal squeeze (condensed). */
  condense?: number;
  /** Override auto-fill: fixed number of phrase repeats. */
  repeat?: number;
  className?: string;
  style?: React.CSSProperties;
};

export function TextCircle({
  text = "We grow everywhere",
  separator = "   ",
  radius = 300,
  fontSize = 64,
  speed = 24,
  reverse = false,
  lean = 18,
  color = "currentColor",
  tracking = -0.04,
  stretchY = 1.55,
  condense = 0.82,
  repeat,
  className,
  style,
}: TextCircleProps) {
  const phrase = text + separator;
  // Fill the ring: enough glyphs that they sit close together.
  const circumference = 2 * Math.PI * radius;
  // ~real glyph advance for tall condensed caps → letters almost touch (no overlap)
  const advance = fontSize * condense * 0.72;
  const targetChars = Math.max(phrase.length, Math.ceil(circumference / Math.max(6, advance)));
  const reps = repeat ?? Math.max(1, Math.ceil(targetChars / phrase.length));
  const chars = Array.from(phrase.repeat(reps));
  const step = 360 / chars.length;

  return (
    <div
      className={className}
      role="img"
      aria-label={text}
      style={{
        perspective: `${radius * 4}px`,
        width: radius * 2,
        height: fontSize * stretchY * 1.4,
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transform: lean ? `rotateX(${lean}deg)` : undefined,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
            animation: `spinY ${speed}s linear infinite${reverse ? " reverse" : ""}`,
          }}
        >
          {chars.map((ch, i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize,
                lineHeight: 1,
                letterSpacing: `${tracking}em`,
                textTransform: "uppercase",
                color,
                transform: `translate(-50%,-50%) rotateY(${i * step}deg) translateZ(${radius}px) scale(${condense}, ${stretchY})`,
                transformStyle: "preserve-3d",
                whiteSpace: "pre",
              }}
            >
              {ch}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
