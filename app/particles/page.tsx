"use client";

import { ParticleField } from "../../components/ui/ParticleField";
import { TextCircle } from "../../components/ui/TextCircle";
import { AuroraBackground } from "../../components/ui/AuroraBackground";

/**
 * Sandbox for the spatial hero — aurora background + fly-through particle
 * field + standing 3D ring text. Tune here, then drop into a real section.
 * Safe to delete this route.
 */
export default function ParticlesSandbox() {
  return (
    <main style={{ background: "#06121f", color: "#fff" }}>
      {/* DEEP SEA — flying through a pixel field, standing ring text */}
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
        <AuroraBackground preset="forest" speed={26} pulse pulseSpeed={7} />
        <ParticleField
          count={4200}
          color={["#2f4a2c", "#3f6e3a", "#4f8f6a", "#7fc0a8", "#bfe6dd"]}
          colorMode="gradientY"
          background="transparent"
          travel={0.3}
          forest
          pixel
          size={1.7}
          opacity={0.9}
          glow
        />
        <TextCircle
          text="We grow everywhere"
          radius={300}
          fontSize={46}
          speed={26}
          lean={22}
          color="#FCEFE2"
          style={{ position: "relative" }}
        />
      </section>

      {/* NORTHERN LIGHTS variant */}
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
        <AuroraBackground preset="aurora" speed={20} />
        <ParticleField
          count={1800}
          color={["#d9ffe8", "#6fe0b0", "#9a5e9e", "#5a86c4"]}
          background="transparent"
          travel={0.7}
          pixel
          size={2.6}
          glow
        />
        <h2
          className="serif"
          style={{ position: "relative", fontSize: "clamp(34px,5vw,64px)", textShadow: "0 2px 24px rgba(0,0,0,0.5)" }}
        >
          Northern lights · fly-through
        </h2>
      </section>
    </main>
  );
}
