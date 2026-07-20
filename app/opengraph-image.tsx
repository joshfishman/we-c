import { renderOgCard } from "../lib/og/card";

export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";
export const alt =
  "WE Digital Studio — grow your brand online, over a sunlit forest canopy";

export default function Image() {
  return renderOgCard({
    eyebrow: "For ecommerce and lifestyle brands",
    headline: "Grow your Brand Online",
    background: "og-home.jpg",
  });
}
