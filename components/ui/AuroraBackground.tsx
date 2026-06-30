"use client";

/**
 * AuroraBackground — a slow, flowing gradient backdrop (deep-sea / northern
 * lights). Heavily-blurred color blobs drift over a base gradient. Pure CSS,
 * absolute-fill; drop behind a ParticleField in a `position: relative` parent.
 *
 *   <AuroraBackground preset="deepSea" />
 *   <AuroraBackground colors={["#0c1733","#13405c","#1f7a6e","#9a5e9e"]} />
 */
export type AuroraProps = {
  /** Base + blob colors (first is the base wash; rest are drifting blobs). */
  colors?: string[];
  preset?: "deepSea" | "aurora" | "sunset" | "mist" | "forest";
  /** Seconds per drift cycle (higher = slower). */
  speed?: number;
  /** Add expanding concentric radial-pulse rings. */
  pulse?: boolean;
  /** Pulse ring color (cool blue-green by default). */
  pulseColor?: string;
  /** Seconds per pulse cycle. */
  pulseSpeed?: number;
  className?: string;
  style?: React.CSSProperties;
};

const PRESETS: Record<string, string[]> = {
  deepSea: ["#06121f", "#0b3b4d", "#10706a", "#1f9c8a", "#2b3a6b"],
  aurora: ["#06101f", "#1f7a6e", "#36c08a", "#5a86c4", "#9a5e9e"],
  sunset: ["#0c1733", "#27305f", "#7a4a86", "#d76d7e", "#f0a35a"],
  // Shopify-like dreamscape: mossy green low, lavender mid, pink/white glow high
  mist: ["#0f1813", "#3c6a44", "#7b6f93", "#d68aa6", "#f2e6e9"],
  // Forest: deep green base, canopy glow in light blue-green
  forest: ["#0b1510", "#2f5a3a", "#3f7a6a", "#6fae9a", "#bfe6dd"],
};

export function AuroraBackground({
  colors,
  preset = "deepSea",
  speed = 26,
  pulse = false,
  pulseColor = "rgba(120,215,195,0.22)",
  pulseSpeed = 7,
  className,
  style,
}: AuroraProps) {
  const pal = colors && colors.length ? colors : PRESETS[preset];
  const [base, ...blobs] = pal;

  const blob = (
    color: string,
    pos: string,
    size: number,
    anim: "auroraA" | "auroraB",
    dur: number
  ): React.CSSProperties => ({
    position: "absolute",
    width: `${size}%`,
    height: `${size}%`,
    borderRadius: "50%",
    background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
    filter: "blur(90px)",
    mixBlendMode: "screen",
    animation: `${anim} ${dur}s ease-in-out infinite`,
    ...positionToStyle(pos),
  });

  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: base,
        ...style,
      }}
    >
      {blobs.map((c, i) =>
        i === 0 ? (
          <div key={i} style={blob(c, "top:-10%;left:-5%", 70, "auroraA", speed)} />
        ) : i === 1 ? (
          <div key={i} style={blob(c, "bottom:-15%;right:-5%", 80, "auroraB", speed * 1.3)} />
        ) : i === 2 ? (
          <div key={i} style={blob(c, "top:20%;right:10%", 55, "auroraA", speed * 0.85)} />
        ) : (
          <div key={i} style={blob(c, "bottom:5%;left:15%", 60, "auroraB", speed * 1.15)} />
        )
      )}

      {pulse
        ? [0, 1, 2].map((i) => (
            <div
              key={`pulse-${i}`}
              style={{
                position: "absolute",
                left: "50%",
                top: "52%",
                width: "78%",
                aspectRatio: "1",
                borderRadius: "50%",
                background: `radial-gradient(circle, transparent 40%, ${pulseColor} 47%, transparent 62%)`,
                mixBlendMode: "screen",
                animation: `pulse ${pulseSpeed}s ease-out infinite`,
                animationDelay: `${(i * pulseSpeed) / 3}s`,
              }}
            />
          ))
        : null}
    </div>
  );
}

function positionToStyle(pos: string): React.CSSProperties {
  const s: any = {};
  for (const part of pos.split(";")) {
    const [k, v] = part.split(":");
    if (k && v) s[k.trim()] = v.trim();
  }
  return s;
}
