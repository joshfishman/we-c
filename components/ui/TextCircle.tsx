"use client";

/**
 * TextCircle — text standing on an upright 3D cylinder that rotates around the
 * vertical axis (front glyphs face you and read large; back glyphs curve away,
 * mirrored and dim). Pure CSS 3D, dependency-free.
 *
 *   <TextCircle text="We grow everywhere" radius={260} fontSize={42} />
 */
export type TextCircleProps = {
  text?: string;
  /** Separator between repeats of the phrase. */
  separator?: string;
  /** Cylinder radius in px (how wide the ring is). */
  radius?: number;
  fontSize?: number;
  /** Seconds per full rotation. */
  speed?: number;
  reverse?: boolean;
  /** Slight forward lean in degrees (0 = perfectly upright). */
  lean?: number;
  color?: string;
  /** Letter-spacing in em. */
  tracking?: number;
  className?: string;
  style?: React.CSSProperties;
};

export function TextCircle({
  text = "We grow everywhere",
  separator = "  •  ",
  radius = 260,
  fontSize = 42,
  speed = 22,
  reverse = false,
  lean = 0,
  color = "currentColor",
  tracking = 0.02,
  className,
  style,
}: TextCircleProps) {
  const phrase = text + separator;
  const chars = Array.from(phrase);
  const step = 360 / chars.length;

  return (
    <div
      className={className}
      role="img"
      aria-label={text}
      style={{
        perspective: `${radius * 4}px`,
        width: radius * 2,
        height: fontSize * 1.8,
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
                fontWeight: 600,
                fontSize,
                lineHeight: 1,
                letterSpacing: `${tracking}em`,
                textTransform: "uppercase",
                color,
                transform: `translate(-50%,-50%) rotateY(${i * step}deg) translateZ(${radius}px)`,
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
