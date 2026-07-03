"use client";

import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

/**
 * ParticleFieldGL — GPU fly-through particle field (raw WebGL2). Generates a
 * sparse, abstract 3D scene (bumpy floor + rock/trunk pillars + ambient) and,
 * when `image` is set, colours every particle by sampling that photo at the
 * particle's position — so the scene takes on the picture's palette/structure
 * (canopy up high, ground low) without being a flat pixel copy.
 *
 * The vertex shader does travel + perspective + depth-fog + a small pointer
 * "push" for every point in parallel, so 100k+ points stay at 60fps.
 */
export type ParticleFieldGLProps = {
  count?: number;
  /** Gradient stops (floor → top) used when no `image` is given. */
  color?: string[];
  /** Photo URL — particles sample their colour from it by position. */
  image?: string;
  travel?: number;
  size?: number;
  opacity?: number;
  /** Pointer push radius as a fraction of the smaller viewport dim. */
  smashRadius?: number;
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

const VERT = `#version 300 es
precision highp float;
in vec3 a_pos;
in vec3 a_col;
uniform float u_dist, u_zNear, u_zFar, u_proj, u_size, u_opacity, u_mouseOn, u_mouseR;
uniform vec2 u_res, u_mouse, u_cam;
out vec3 v_col;
out float v_a;
void main(){
  float span = u_zFar - u_zNear;
  float z = u_zNear + mod((a_pos.z - u_dist) - u_zNear, span);
  if (z < 0.001) z += span;
  float inv = u_proj / z;
  // camera pans with the pointer (near particles shift more → look-around)
  float px = u_res.x * 0.5 + (a_pos.x - u_cam.x) * inv;
  float py = u_res.y * 0.5 + (a_pos.y - u_cam.y) * inv;
  // pointer PUSH only (no swirl, no camera look-around)
  if (u_mouseOn > 0.5) {
    vec2 dd = vec2(px, py) - u_mouse;
    float d = length(dd);
    if (d < u_mouseR && d > 0.001) {
      float fall = (u_mouseR - d) / u_mouseR;
      float push = fall * u_mouseR * 1.3 * (1.3 - z / u_zFar);
      px += (dd.x / d) * push;
      py += (dd.y / d) * push;
    }
  }
  float aFar = (u_zFar - z) / (u_zFar * 0.45);
  float aNear = (z - u_zNear) / 0.55;
  v_a = u_opacity * clamp(min(aFar, aNear), 0.0, 1.0);
  v_col = a_col / 255.0;
  gl_PointSize = clamp(u_size * inv * 0.014, 1.0, 16.0);
  gl_Position = vec4((px / u_res.x) * 2.0 - 1.0, 1.0 - (py / u_res.y) * 2.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
in vec3 v_col;
in float v_a;
out vec4 o;
void main(){ o = vec4(v_col * v_a, v_a); }`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    throw new Error(gl.getShaderInfoLog(s) || "shader compile failed");
  return s;
}

export function ParticleFieldGL({
  count = 40000,
  color = ["#2f4a2c", "#4a7a48", "#c9642b", "#e0913f", "#f0c46a"],
  image,
  travel = 0.045,
  size = 0.8,
  opacity = 0.9,
  smashRadius = 0.005,
  className,
  style,
}: ParticleFieldGLProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { premultipliedAlpha: true, antialias: false });
    if (!gl) return;

    let cleanup = () => {};
    let cancelled = false;

    const build = (img: { data: Uint8ClampedArray; w: number; h: number } | null) => {
      if (cancelled) return;

      const Z_NEAR = 0.12, Z_FAR = 5;
      const pal = color.map(hexToRgb);
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      const floorNoise = createNoise2D();

      const sampleImg = (u: number, v: number): [number, number, number] => {
        const ix = Math.min(img!.w - 1, Math.max(0, (u * img!.w) | 0));
        const iy = Math.min(img!.h - 1, Math.max(0, (v * img!.h) | 0));
        const k = (iy * img!.w + ix) * 4;
        return [img!.data[k], img!.data[k + 1], img!.data[k + 2]];
      };

      const pos = new Float32Array(count * 3);
      const col = new Float32Array(count * 3);
      const COLS = Math.max(6, Math.round(count / 900));
      const cX = new Float32Array(COLS), cZ = new Float32Array(COLS), cH = new Float32Array(COLS), cW = new Float32Array(COLS);
      for (let t = 0; t < COLS; t++) {
        cX[t] = (Math.random() * 2 - 1) * 1.9;
        cZ[t] = Z_NEAR + Math.random() * (Z_FAR - Z_NEAR);
        cH[t] = 1.0 + Math.random() * 1.1;
        cW[t] = 0.06 + Math.random() * 0.1;
      }
      const FLOOR = 0.28, PILLARS = 0.62; // floor, pillars, then a wide canopy/ambient
      for (let i = 0; i < count; i++) {
        let x: number, y: number, z: number;
        const f = i / count;
        if (f < FLOOR) {
          x = (Math.random() * 2 - 1) * 2.4;
          z = Z_NEAR + Math.random() * (Z_FAR - Z_NEAR);
          y = 0.99 - floorNoise(x * 1.6, z * 1.6) * 0.1 + (Math.random() - 0.5) * 0.02;
        } else if (f < PILLARS) {
          const t = i % COLS, w = cW[t];
          x = cX[t] + (Math.random() - 0.5) * 2 * w;
          y = 0.97 - Math.random() * (0.97 + cH[t]);
          z = cZ[t] + (Math.random() - 0.5) * 2 * w;
        } else {
          // wide canopy/ambient, biased upward
          x = (Math.random() * 2 - 1) * 2.4;
          y = -0.2 - Math.random() * 1.2;
          z = Z_NEAR + Math.random() * (Z_FAR - Z_NEAR);
        }
        pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;

        let cr: number, cg: number, cb: number;
        if (img) {
          // map position → image UV (top of image = canopy, bottom = ground),
          // jittered so it's abstract, not a crisp copy
          const u = Math.min(1, Math.max(0, x / 2.4 * 0.5 + 0.5 + (Math.random() - 0.5) * 0.06));
          const v = Math.min(1, Math.max(0, (y + 1) / 2 + (Math.random() - 0.5) * 0.06));
          [cr, cg, cb] = sampleImg(u, v);
        } else {
          [cr, cg, cb] = sample(pal, (1 - y) / 2) as [number, number, number];
        }
        col[i * 3] = cr; col[i * 3 + 1] = cg; col[i * 3 + 2] = cb;
      }

      const prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
      gl.useProgram(prog);

      const vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      const mk = (data: Float32Array, name: string) => {
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, name);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 3, gl.FLOAT, false, 0, 0);
      };
      mk(pos, "a_pos");
      mk(col, "a_col");

      const U = (n: string) => gl.getUniformLocation(prog, n);
      const uDist = U("u_dist"), uRes = U("u_res"), uMouse = U("u_mouse"),
        uMouseOn = U("u_mouseOn"), uMouseR = U("u_mouseR"), uProj = U("u_proj"), uCam = U("u_cam");
      gl.uniform1f(U("u_zNear"), Z_NEAR);
      gl.uniform1f(U("u_zFar"), Z_FAR);
      gl.uniform1f(U("u_size"), size);
      gl.uniform1f(U("u_opacity"), opacity);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);

      let dpr = 1, W = 0, H = 0;
      const resize = () => {
        const r = canvas.getBoundingClientRect();
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = Math.max(1, Math.round(r.width * dpr));
        H = Math.max(1, Math.round(r.height * dpr));
        canvas.width = W; canvas.height = H;
        gl.viewport(0, 0, W, H);
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(canvas);

      let mx = -9999, my = -9999, camX = 0, camY = 0, tcx = 0, tcy = 0;
      const onMove = (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect();
        mx = (e.clientX - r.left) * dpr;
        my = (e.clientY - r.top) * dpr;
        tcx = ((e.clientX - r.left) / r.width - 0.5) * 0.5; // pointer → camera pan
        tcy = ((e.clientY - r.top) / r.height - 0.5) * 0.5;
      };
      const onOut = () => { mx = -9999; my = -9999; tcx = 0; tcy = 0; };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerout", onOut);

      let dist = 0, raf = 0, last = performance.now(), running = true;
      const frame = (now: number) => {
        if (canvas.width <= 4) { const r = canvas.getBoundingClientRect(); if (r.width > 4) resize(); }
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        if (!reduce) dist += travel * dt;
        camX += (tcx - camX) * 0.06; // eased camera pan
        camY += (tcy - camY) * 0.06;
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(uDist, dist);
        gl.uniform2f(uRes, W, H);
        gl.uniform1f(uProj, Math.min(W, H) * 0.5);
        gl.uniform2f(uCam, camX, camY);
        gl.uniform2f(uMouse, mx, my);
        gl.uniform1f(uMouseOn, mx > -9000 ? 1 : 0);
        gl.uniform1f(uMouseR, Math.min(W, H) * smashRadius);
        gl.drawArrays(gl.POINTS, 0, count);
        if (running) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);

      const io = new IntersectionObserver(([e]) => {
        running = e.isIntersecting;
        if (running) { last = performance.now(); raf = requestAnimationFrame(frame); }
        else cancelAnimationFrame(raf);
      });
      io.observe(canvas);

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect(); io.disconnect();
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerout", onOut);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    };

    if (image) {
      const im = new Image();
      im.crossOrigin = "anonymous";
      im.onload = () => {
        const c = document.createElement("canvas");
        const iw = 360, ih = Math.max(1, Math.round((360 * im.height) / im.width));
        c.width = iw; c.height = ih;
        const cx = c.getContext("2d")!;
        cx.drawImage(im, 0, 0, iw, ih);
        build({ data: cx.getImageData(0, 0, iw, ih).data, w: iw, h: ih });
      };
      im.onerror = () => build(null);
      im.src = image;
    } else {
      build(null);
    }

    return () => { cancelled = true; cleanup(); };
  }, [count, color, image, travel, size, opacity, smashRadius]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", pointerEvents: "none", ...style }}
    />
  );
}
