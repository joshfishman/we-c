"use client";

import { ParticleField } from "../../components/ui/ParticleField";
import { ParticleFieldGL } from "../../components/ui/ParticleFieldGL";
import { TextCircle } from "../../components/ui/TextCircle";
import { AuroraBackground } from "../../components/ui/AuroraBackground";
import { NoiseBackdrop } from "../../components/ui/NoiseBackdrop";

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
        <NoiseBackdrop
          colors={["#f3ddab", "#e6c27f", "#c49a5c", "#7d6236", "#43331f", "#241a10"]}
          scale={2.2}
          speed={0.08}
          turbulence={0.5}
        />
        <ParticleFieldGL
          image="/media/tree.jpg"
          count={42000}
          travel={0.045}
          size={0.22}
          opacity={0.95}
          smashRadius={0.05}
        />
        <TextCircle
          text="We grow everywhere"
          radius={300}
          fontSize={58}
          speed={26}
          color="#FFF2DE"
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
