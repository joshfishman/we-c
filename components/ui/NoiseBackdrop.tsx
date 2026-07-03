"use client";

import { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

/**
 * NoiseBackdrop — an animated sunset-cloud background driven by fractal Simplex
 * noise (fBm). Irregular and off-center by nature (no radial symmetry); the
 * colour bands wave and drift organically.
 *
 * Rendered to a tiny offscreen buffer and scaled up (cheap + naturally soft).
 *
 *   <NoiseBackdrop colors={["#1A2244","#4F5C92","#8E5E9E","#D0708E","#E88E5C","#F2B566"]} />
 *   //                ^ top of sky                                        ^ warm horizon
 */
export type NoiseBackdropProps = {
  /** Gradient stops, top-of-sky → warm horizon. */
  colors?: string[];
  /** Noise feature size (smaller = bigger, softer cloud masses). */
  scale?: number;
  /** Drift / evolve speed. */
  speed?: number;
  /** How strongly clouds warp the colour bands (0–1). */
  turbulence?: number;
  className?: string;
  style?: React.CSSProperties;
};

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(v, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function sample(stops: [number, number, number][], t: number) {
  const x = Math.max(0, Math.min(1, t)) * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(x));
  const f = x - i;
  const a = stops[i], b = stops[i + 1];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
}

export function NoiseBackdrop({
  colors = ["#1A2244", "#2B3766", "#4F5C92", "#8E5E9E", "#D0708E", "#E88E5C", "#F2B566"],
  scale = 2.2,
  speed = 0.04,
  turbulence = 0.55,
  className,
  style,
}: NoiseBackdropProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const pal = colors.map(hexToRgb);
    const noise3D = createNoise3D();
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Low-res buffer; CSS scales it up softly.
    let W = 0, H = 0;
    const BW = 160;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const aspect = Math.max(0.4, r.height / Math.max(1, r.width));
      W = BW;
      H = Math.max(40, Math.round(BW * aspect));
      canvas.width = W;
      canvas.height = H;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const img = () => ctx.createImageData(W, H);
    let buf = img();
    let t = 0, raf = 0, last = performance.now(), running = true, acc = 0;
    const fbm = (x: number, y: number, z: number) => {
      let sum = 0, amp = 0.5, freq = 1;
      for (let o = 0; o < 4; o++) {
        sum += amp * noise3D(x * freq, y * freq, z);
        freq *= 2;
        amp *= 0.5;
      }
      return sum; // ~[-0.75, 0.75]
    };

    const draw = () => {
      if (buf.width !== W || buf.height !== H) buf = img();
      const d = buf.data;
      const panX = t * 0.15; // clouds drift sideways
      for (let y = 0; y < H; y++) {
        const vy = y / (H - 1); // 0 top → 1 bottom
        for (let x = 0; x < W; x++) {
          const nx = (x / W) * scale + panX;
          const ny = (y / H) * scale;
          const n = fbm(nx, ny, t); // off-center, irregular
          // warp the vertical sunset bands with the noise
          let ct = vy + n * turbulence;
          if (ct < 0) ct = 0; else if (ct > 1) ct = 1;
          const [r, g, b] = sample(pal, ct);
          const i = (y * W + x) * 4;
          d[i] = r; d[i + 1] = g; d[i + 2] = b; d[i + 3] = 255;
        }
      }
      ctx.putImageData(buf, 0, 0);
    };

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      acc += dt;
      if (acc >= 1 / 30) {
        // ~30fps update is plenty for soft clouds
        if (!reduce) t += speed * acc;
        draw();
        acc = 0;
      }
      if (running) raf = requestAnimationFrame(frame);
    };
    draw();
    raf = requestAnimationFrame(frame);
    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      if (running) { last = performance.now(); raf = requestAnimationFrame(frame); }
      else cancelAnimationFrame(raf);
    });
    io.observe(canvas);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [colors, scale, speed, turbulence]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        filter: "blur(28px)",
        transform: "scale(1.15)", // hide blur edges
        ...style,
      }}
      className={className}
    />
  );
}
