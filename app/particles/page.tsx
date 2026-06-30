"use client";

import { ParticleField } from "../../components/ui/ParticleField";

/**
 * Sandbox for the ParticleField component — preview and tune the effect, then
 * drop <ParticleField/> behind any real section. Safe to delete this route.
 */
export default function ParticlesSandbox() {
  return (
    <main style={{ background: "#0a0a0f", color: "#fff" }}>
      {/* SUNSET: gold → pink → blue gradient, loose structure */}
      <section
        style={{
          position: "relative",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background:
            "linear-gradient(180deg,#0c1733 0%,#27305f 30%,#7a4a86 55%,#d76d7e 78%,#f0a35a 100%)",
        }}
      >
        <ParticleField
          count={2400}
          color={["#FFD86B", "#F4A65A", "#E0708A", "#9A5E9E", "#5A86C4"]}
          colorMode="gradientY"
          background="transparent"
          radius={0.5}
          speed={0.05}
          size={2}
          opacity={0.95}
          drift={0.12}
          sway={0.16}
          glow
        />
        <h2
          className="serif"
          style={{
            position: "relative",
            fontSize: "clamp(34px,5vw,64px)",
            textShadow: "0 2px 24px rgba(8,20,40,0.6)",
          }}
        >
          Sunset · gold → pink → blue
        </h2>
      </section>

      {/* White cloud on near-black (Shopify-style) */}
      <section
        style={{
          position: "relative",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <ParticleField count={1800} color="#ffffff" background="#0a0a0f" speed={0.1} />
        <div style={{ position: "relative", textAlign: "center", maxWidth: 680, padding: "0 24px" }}>
          <h1 className="serif" style={{ fontSize: "clamp(40px,7vw,92px)", lineHeight: 0.95 }}>
            We grow <span className="serif--italic">businesses</span> online.
          </h1>
          <p style={{ marginTop: 18, opacity: 0.7 }}>Particle background — fully yours to restyle.</p>
        </div>
      </section>
    </main>
  );
}
