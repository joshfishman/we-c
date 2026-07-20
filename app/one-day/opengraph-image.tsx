import { renderOgCard } from "../../lib/og/card";

export const size = { width: 1200, height: 630 };
export const contentType = "image/jpeg";
export const alt =
  "WE Digital Studio — plan in the morning, go live by sunset, over a golden sunset sky";

export default function Image() {
  return renderOgCard({
    eyebrow: "Websites in a day",
    headline: "Plan in the morning.\nGo live by sunset.",
    background: "og-one-day.jpg",
  });
}
