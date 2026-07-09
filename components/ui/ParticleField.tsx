"use client";

import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

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
  /** Vortex swirl — differential rotation by depth/radius. 0 = none, ~0.4 = dramatic. */
  swirl?: number;
  /**
   * Fly-through speed. When > 0 the camera travels forward through a deep
   * volumetric field (particles barely move; you move past them) — the
   * Shopify "moving through space" feel. ~0.3–0.8 reads well.
   */
  travel?: number;
  /** Draw square particles (pixelated look) instead of round dots. */
  pixel?: boolean;
  /**
   * Forest mode (fly-through only): cluster particles into vertical tree
   * structures — thin trunks rising from the floor into wide canopies — so you
   * fly through a forest rather than an even field. Pair with colorMode
   * "gradientY" + a green→blue-green palette (floor → canopy).
   */
  forest?: boolean;
  /**
   * Pillars mode (fly-through only): dense, blocky vertical rock columns /
   * mesas rising from the floor — a canyon you fly through. Pair with
   * colorMode "gradientY" + a rock palette (dark base → warm top).
   */
  pillars?: boolean;
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
  swirl = 0,
  travel = 0,
  pixel = false,
  forest = false,
  pillars = false,
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
    const floorNoise = createNoise2D(); // bumpy ground heightfield
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
    const prad = new Float32Array(count); // base radius, for swirl differential
    const jitter = 0.07; // organic "loose" offset so it isn't a clean ball
    const fly = travel > 0;
    const Z_NEAR = 0.12,
      Z_FAR = 5;

    // Structures (fly-through): pre-place columns, then fill them.
    const forestMode = fly && forest;
    const pillarMode = fly && pillars;
    const structured = forestMode || pillarMode;
    let colX: Float32Array, colZ: Float32Array, colH: Float32Array, colW: Float32Array;
    let COLS = 0;
    if (structured) {
      // pillars = fewer, fatter columns with more particles each (denser/solid)
      COLS = pillarMode
        ? Math.max(7, Math.round(count / 380))
        : Math.max(10, Math.round(count / 140));
      colX = new Float32Array(COLS);
      colZ = new Float32Array(COLS);
      colH = new Float32Array(COLS);
      colW = new Float32Array(COLS);
      for (let t = 0; t < COLS; t++) {
        colX[t] = (Math.random() * 2 - 1) * 1.8;
        colZ[t] = Z_NEAR + Math.random() * (Z_FAR - Z_NEAR);
        colH[t] = pillarMode ? 0.7 + Math.random() * 0.9 : 0.85 + Math.random() * 0.5;
        colW[t] = pillarMode ? 0.1 + Math.random() * 0.14 : 0;
      }
    }

    for (let i = 0; i < count; i++) {
      if (pillarMode) {
        if (i < count * 0.34) {
          // bumpy particle floor — undulating ground heightfield
          const fx = (Math.random() * 2 - 1) * 2.4;
          const fz = Z_NEAR + Math.random() * (Z_FAR - Z_NEAR);
          const bump = floorNoise(fx * 1.4, fz * 1.4) * 0.13;
          px[i] = fx;
          py[i] = 0.98 - bump + (Math.random() - 0.5) * 0.03;
          pz[i] = fz;
        } else if (i < count * 0.82) {
          // solid square-ish rock column, floor up to a flat mesa top
          const t = i % COLS;
          const w = colW![t];
          px[i] = colX![t] + (Math.random() - 0.5) * 2 * w;
          py[i] = 0.95 - Math.random() * (0.95 + colH![t]);
          pz[i] = colZ![t] + (Math.random() - 0.5) * 2 * w;
        } else {
          // ambient dust through the whole volume
          px[i] = (Math.random() * 2 - 1) * 2.2;
          py[i] = (Math.random() * 2 - 1) * 1.3;
          pz[i] = Z_NEAR + Math.random() * (Z_FAR - Z_NEAR);
        }
      } else if (forestMode) {
        const treeX = colX!,
          treeZ = colZ!,
          treeH = colH!,
          TREES = COLS;
        const t = i % TREES;
        const tx = treeX![t],
          tz = treeZ![t],
          th = treeH![t];
        if (Math.random() < 0.5) {
          // canopy: wide cluster near the top (negative y = up)
          const cr = 0.16 + Math.random() * 0.14;
          const ang = Math.random() * 6.283;
          const rr = Math.random() * cr;
          px[i] = tx + Math.cos(ang) * rr;
          py[i] = -th + (Math.random() - 0.5) * 0.5;
          pz[i] = tz + Math.sin(ang) * rr;
        } else {
          // trunk: thin vertical column from the floor (+0.95) up toward the canopy
          px[i] = tx + (Math.random() - 0.5) * 0.05;
          py[i] = 0.95 - Math.random() * (0.95 + th * 0.5);
          pz[i] = tz + (Math.random() - 0.5) * 0.05;
        }
      } else if (fly) {
        // Box volume in front of the camera: x,y spread, z = depth.
        px[i] = (Math.random() * 2 - 1) * 1.4;
        py[i] = (Math.random() * 2 - 1) * 1.4;
        pz[i] = Z_NEAR + Math.random() * (Z_FAR - Z_NEAR);
      } else {
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
        prad[i] = r;
      }
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
    // Reusable pixel buffer for the fly-through (handles 100k+ particles).
    let frameBuf: ImageData | null = null;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // Fly-through renders into a pixel buffer — keep it at 1x so the per-frame
      // buffer fill + putImageData stays cheap (huge particle counts).
      dpr = travel > 0 ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      cloudR = Math.min(w, h) * radius;
      if (travel > 0) frameBuf = ctx.createImageData(canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Pointer parallax (eased toward target) + raw position for the smash force.
    let tiltX = 0,
      tiltY = 0,
      targX = 0,
      targY = 0,
      mpx = -9999,
      mpy = -9999; // pointer in CSS px relative to canvas
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mpx = e.clientX - rect.left;
      mpy = e.clientY - rect.top;
      targY = (mpx / rect.width - 0.5) * 0.6;
      targX = (mpy / rect.height - 0.5) * 0.6;
    };
    const onLeave = () => {
      mpx = -9999;
      mpy = -9999;
    };
    if (interactive) {
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerout", onLeave);
    }

    let rotY = 0,
      elapsed = 0,
      raf = 0,
      last = performance.now(),
      running = true;
    const focal = 2.2; // perspective strength
    const camZ = 2.4; // camera distance (in cloud-radius units)

    const frame = (now: number) => {
      // self-heal if the canvas wasn't laid out when resize first ran
      if (canvas.width <= 4) {
        const r = canvas.getBoundingClientRect();
        if (r.width > 4) resize();
      }
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

      // ---- Fly-through: camera travels forward through a deep field ----
      // Rendered into an ImageData buffer (device px) so it scales to 100k+
      // particles, additively blended for a luminous, dense look.
      if (fly) {
        if (!frameBuf) frameBuf = ctx.createImageData(canvas.width, canvas.height);
        const data = frameBuf.data;
        // clear / fill background
        if (background === "transparent") {
          data.fill(0);
        } else {
          const [br, bg2, bb] = hexToRgb(background);
          for (let p = 0; p < data.length; p += 4) {
            data[p] = br;
            data[p + 1] = bg2;
            data[p + 2] = bb;
            data[p + 3] = 255;
          }
        }
        const W = canvas.width,
          H = canvas.height;
        const dz = reduce ? 0 : travel * dt;
        const proj = Math.min(W, H) * 0.5;
        const ccx = W / 2,
          ccy = H / 2;
        const camX = tiltY * 0.35; // gentler look-around (smash is the main effect)
        const camY = tiltX * 0.35;
        // Mouse "smash" force, in device px.
        const mx = mpx * dpr,
          my = mpy * dpr;
        const hasM = mpx > -9000;
        const R = Math.min(W, H) * 0.22; // smash radius
        const R2 = R * R;

        const farK = 1 / (Z_FAR * 0.45);
        const nearK = 1 / 0.55;
        for (let i = 0; i < count; i++) {
          let z = pz[i] - dz;
          if (z <= Z_NEAR) z += Z_FAR - Z_NEAR;
          pz[i] = z;
          const inv = proj / z;
          let sx = ccx + (px[i] - camX) * inv;
          let sy = ccy + (py[i] - camY) * inv;
          if (hasM) {
            const dx = sx - mx,
              dy = sy - my;
            const d2 = dx * dx + dy * dy;
            if (d2 < R2) {
              const d = Math.sqrt(d2) || 1;
              const f = ((R - d) / d) * (R * 0.55) * (1.4 - z / Z_FAR);
              sx += dx * f;
              sy += dy * f;
            }
          }
          const xi = sx | 0,
            yi = sy | 0;
          if (xi < 0 || yi < 0 || xi >= W || yi >= H) continue;
          let aFar = (Z_FAR - z) * farK;
          if (aFar > 1) aFar = 1;
          const aNear = (z - Z_NEAR) * nearK;
          const a = opacity * (aFar < aNear ? aFar : aNear);
          if (a <= 0) continue;
          const idx = (yi * W + xi) * 4;
          let v = data[idx] + pr[i] * a;
          data[idx] = v > 255 ? 255 : v;
          v = data[idx + 1] + pg[i] * a;
          data[idx + 1] = v > 255 ? 255 : v;
          v = data[idx + 2] + pb[i] * a;
          data[idx + 2] = v > 255 ? 255 : v;
          v = data[idx + 3] + a * 255;
          data[idx + 3] = v > 255 ? 255 : v;
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.putImageData(frameBuf, 0, 0);
        if (running) raf = requestAnimationFrame(frame);
        return;
      }

      for (let i = 0; i < count; i++) {
        const ph = pf[i];
        // organic drift — each particle floats on its own slow path
        let x = px[i] + Math.sin(elapsed * 0.6 + ph) * dft;
        let y = py[i] + Math.cos(elapsed * 0.5 + ph * 1.3) * dft;
        const z = pz[i] + Math.sin(elapsed * 0.45 + ph * 0.7) * dft;
        // vortex swirl — inner vs outer particles rotate at different rates
        if (swirl && !reduce) {
          const za = elapsed * swirl * (0.4 + prad[i]);
          const cz = Math.cos(za),
            sz = Math.sin(za);
          const nx = x * cz - y * sz;
          y = x * sz + y * cz;
          x = nx;
        }
        // rotate Y then X
        const x1 = x * cy + z * sy;
        const z1 = -x * sy + z * cy;
        const y1 = y * cx - z1 * sx;
        const z2 = y * sx + z1 * cx;
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
      if (interactive) {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerout", onLeave);
      }
    };
  }, [count, color, colorMode, background, size, speed, radius, distribution, interactive, opacity, drift, sway, swirl, travel, pixel, forest, pillars, glow]);

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
