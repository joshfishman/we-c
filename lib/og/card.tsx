import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";

/**
 * Shared renderer for the 1200×630 social share cards.
 *
 * Cards are generated at build time by the `opengraph-image` / `twitter-image`
 * file conventions, so the wordmark and headline always match what's on the
 * page — no hand-exported JPEGs to keep in sync.
 *
 * Fonts are vendored under lib/og/fonts as raw TrueType: Satori cannot read the
 * woff2 that next/font caches, and downloading at build time would put the
 * build at the mercy of the network.
 */

const root = process.cwd();
const readAsset = (rel: string) => fs.readFileSync(path.join(root, rel));

const GOLD = "#F0C070";
const INK = "#06121E";

type Font = {
  name: string;
  data: Buffer;
  weight: 400 | 700;
  style: "normal" | "italic";
};

let cachedFonts: Font[] | null = null;
function brandFonts(): Font[] {
  if (!cachedFonts) {
    cachedFonts = [
      {
        name: "Bricolage",
        data: readAsset("lib/og/fonts/Bricolage-Bold.ttf"),
        weight: 700,
        style: "normal",
      },
      {
        name: "Spectral",
        data: readAsset("lib/og/fonts/Spectral-Italic.ttf"),
        weight: 400,
        style: "italic",
      },
    ];
  }
  return cachedFonts;
}

export async function renderOgCard({
  eyebrow,
  headline,
  background,
}: {
  eyebrow: string;
  /** Rendered in Spectral italic — the brand's headline voice. */
  headline: string;
  /** Filename under public/media, pre-cropped to 1200×630. */
  background: string;
}) {
  const bg = `data:image/jpeg;base64,${readAsset(
    `public/media/${background}`,
  ).toString("base64")}`;

  const png = await new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          position: "relative",
          fontFamily: "Bricolage",
          backgroundColor: INK,
        }}
      >
        <img
          src={bg}
          width={1200}
          height={630}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            objectFit: "cover",
          }}
        />
        {/* Left-weighted scrim so the copy reads over a bright canopy/sky. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            background:
              "linear-gradient(90deg, rgba(6,18,30,0.92) 0%, rgba(6,18,30,0.74) 48%, rgba(6,18,30,0.34) 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 1200,
            height: 630,
            padding: 68,
          }}
        >
          {/* Brand lockup — mirrors the site header: WE + DIGITAL/STUDIO */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: 62, color: GOLD, letterSpacing: -2 }}>
              WE
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: 16,
                color: GOLD,
                fontSize: 19,
                letterSpacing: 5,
                lineHeight: 1.15,
              }}
            >
              <span>DIGITAL</span>
              <span>STUDIO</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 21,
                letterSpacing: 6,
                color: GOLD,
                marginBottom: 18,
              }}
            >
              {eyebrow.toUpperCase()}
            </span>
            <span
              style={{
                fontFamily: "Spectral",
                fontStyle: "italic",
                fontSize: 66,
                lineHeight: 1.14,
                color: "#FFFFFF",
                maxWidth: 880,
                // Honour the explicit \n line breaks in headlines.
                whiteSpace: "pre-line",
              }}
            >
              {headline}
            </span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: brandFonts() },
  ).arrayBuffer();

  // next/og only emits RGBA PNG, which cannot compress the canopy's fine branch
  // detail — that lands around 2MB, past the point where WhatsApp and some
  // scrapers quietly drop the preview. Re-encoding to JPEG keeps the same
  // artwork at a fraction of the weight.
  const jpeg = await sharp(Buffer.from(png))
    .jpeg({ quality: 82, progressive: true, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
