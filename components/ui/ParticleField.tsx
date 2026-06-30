"use client";

import { useEffect, useRef } from "react";

/**
 * ParticleField — a self-contained, dependency-free 3D particle cloud rendered
 * on a 2D canvas. Inspired by the Shopify Editions hero (a drifting/rotating
 * point cloud) but written from scratch so you fully control it.
 *
 * Everything is prop-driven — drop it behind any section as an absolute-fill
 * background and tune to taste:
 *
 *   <div style={{ position: "relative" }}>
 *     <ParticleField count={1600} color="#E08A4E" speed={0.12} />
 *     …your content…
 *   </div>
 */
export type ParticleFieldProps = {
  /** Number of particles. ~800–2500 looks good. */
  count?: number;
  /** Particle color(s). A single hex, or an array of stops. */
  color?: string | string[];
  /**
   * How colors map onto the cloud:
   *  - "random"    — each particle picks a random stop
   *  - "gradientY" — stops blend bottom→top (sunset look: gold low, blue high)
   */
  colorMode?: "random" | "gradientY";
  /** CSS background for the canvas (e.g. "#0b0b10" or "transparent"). */
  background?: string;
  /** Base particle radius in px (scaled by depth). */
  size?: number;
  /** Auto-rotation speed (radians/sec). 0 = no spin. */
  speed?: number;
  /** Cloud radius as a fraction of the smaller viewport dimension (0–1). */
  radius?: number;
  /** "volume" fills a sphere; "shell" hugs the surface (denser rim). */
  distribution?: "volume" | "shell";
  /** Mouse/scroll parallax tilt. */
  interactive?: boolean;
  /** Max opacity of the nearest particles (0–1). */
  opacity?: number;
  /** Organic per-particle drift (fraction of radius) — the floating/pollen feel. */
  drift?: number;
  /** Gentle 3D sway amount (radians). 0 = none. */
  sway?: number;
  /** Additive glow — luminous, soft particles (best on dark backgrounds). */
  glow?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const v =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(v, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Sample a multi-stop gradient (array of rgb) at t in [0,1]. */
function sampleStops(stops: [number, number, number][], t: number) {
  if (stops.length === 1) return stops[0];
  const x = Math.max(0, Math.min(1, t)) * (stops.length - 1);
  const i = Math.min(stops.length - 2, Math.floor(x));
  const f = x - i;
  const a = stops[i];
  const b = stops[i + 1];
  return [
    Math.round(a[0] + (b[0] - a[0]) * f),
    Math.round(a[1] + (b[1] - a[1]) * f),
    Math.round(a[2] + (b[2] - a[2]) * f),
  ] as [number, number, number];
}

export function ParticleField({
  count = 1500,
  color = "#ffffff",
  colorMode = "random",
  background = "transparent",
  size = 1.7,
  speed = 0.12,
  radius = 0.42,
  distribution = "volume",
  interactive = true,
  opacity = 0.9,
  drift = 0.08,
  sway = 0.12,
  glow = false,
  className,
  style,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const palette = (Array.isArray(color) ? color : [color]).map(hexToRgb);
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Build the point cloud (unit-sphere coords + a per-point color).
    const px = new Float32Array(count);
    const py = new Float32Array(count);
    const pz = new Float32Array(count);
    const pr = new Uint8Array(count);
    const pg = new Uint8Array(count);
    const pb = new Uint8Array(count);
    const pf = new Float32Array(count); // drift phase, per particle
    const jitter = 0.07; // organic "loose" offset so it isn't a clean ball
    for (let i = 0; i < count; i++) {
      // even direction on a sphere
      const u = Math.random() * 2 - 1;
      const theta = Math.random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      const dir = [s * Math.cos(theta), s * Math.sin(theta), u];
      const r =
        distribution === "shell"
          ? 0.82 + Math.random() * 0.18
          : 0.2 + Math.cbrt(Math.random()) * 0.8;
      px[i] = dir[0] * r + (Math.random() - 0.5) * jitter;
      py[i] = dir[1] * r + (Math.random() - 0.5) * jitter;
      pz[i] = dir[2] * r + (Math.random() - 0.5) * jitter;
      const [cr, cg, cb] =
        colorMode === "gradientY"
          ? // canvas Y is inverted, so (1-py)/2 puts stop[0] at the visual
            // bottom and the last stop at the top (sunset: gold low → blue high)
            sampleStops(palette, (1 - py[i]) / 2)
          : palette[(Math.random() * palette.length) | 0];
      pr[i] = cr;
      pg[i] = cg;
      pb[i] = cb;
      pf[i] = Math.random() * 6.283185;
    }

    let w = 0,
      h = 0,
      dpr = 1,
      cloudR = 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      cloudR = Math.min(w, h) * radius;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Pointer parallax (eased toward target).
    let tiltX = 0,
      tiltY = 0,
      targX = 0,
      targY = 0;
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      targY = ((e.clientX - rect.left) / rect.width - 0.5) * 0.6;
      targX = ((e.clientY - rect.top) / rect.height - 0.5) * 0.6;
    };
    if (interactive) window.addEventListener("pointermove", onMove);

    let rotY = 0,
      elapsed = 0,
      raf = 0,
      last = performance.now(),
      running = true;
    const focal = 2.2; // perspective strength
    const camZ = 2.4; // camera distance (in cloud-radius units)

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!reduce) {
        rotY += speed * dt;
        elapsed += dt;
      }
      const dft = reduce ? 0 : drift;
      tiltX += (targX - tiltX) * 0.05;
      tiltY += (targY - tiltY) * 0.05;
      const ay = rotY + tiltY;
      // gentle 3D sway in addition to pointer tilt
      const ax = Math.sin(elapsed * 0.15) * sway + tiltX;
      const cy = Math.cos(ay),
        sy = Math.sin(ay);
      const cx = Math.cos(ax),
        sx = Math.sin(ax);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (background === "transparent") ctx.clearRect(0, 0, w, h);
      else {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, w, h);
      }
      ctx.globalCompositeOperation = glow ? "lighter" : "source-over";
      const cxp = w / 2,
        cyp = h / 2;

      for (let i = 0; i < count; i++) {
        const ph = pf[i];
        // organic drift — each particle floats on its own slow path
        let x = px[i] + Math.sin(elapsed * 0.6 + ph) * dft;
        let y = py[i] + Math.cos(elapsed * 0.5 + ph * 1.3) * dft;
        let z = pz[i] + Math.sin(elapsed * 0.45 + ph * 0.7) * dft;
        // rotate Y then X
        let x1 = x * cy + z * sy;
        let z1 = -x * sy + z * cy;
        let y1 = y * cx - z1 * sx;
        let z2 = y * sx + z1 * cx;
        // perspective project
        const depth = camZ + z2;
        if (depth <= 0.1) continue;
        const k = focal / depth;
        const sxp = cxp + x1 * cloudR * k;
        const syp = cyp + y1 * cloudR * k;
        // depth shading: nearer = bigger & brighter
        const t = (z2 + 1) / 2; // 0 (back) → 1 (front)
        const a = opacity * (0.15 + t * 0.85);
        const rad = size * k * (0.5 + t * 0.8);
        ctx.fillStyle = `rgba(${pr[i]},${pg[i]},${pb[i]},${a})`;
        ctx.beginPath();
        ctx.arc(sxp, syp, rad, 0, 6.283185);
        ctx.fill();
      }
      if (running) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // Pause when scrolled out of view.
    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running) {
          last = performance.now();
          raf = requestAnimationFrame(frame);
        } else cancelAnimationFrame(raf);
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      if (interactive) window.removeEventListener("pointermove", onMove);
    };
  }, [count, color, colorMode, background, size, speed, radius, distribution, interactive, opacity, drift, sway, glow]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
}
