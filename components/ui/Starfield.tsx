import styles from "./starfield.module.css";

/**
 * Decorative twinkling starfield for the day→night panels.
 *
 * Positions are a fixed set (never random) so server and client render the
 * same markup. Visibility is theme-driven: --t-stars is 0 on palettes with
 * no night sky, 1 on the sunset/dusk palette, so this can sit in a shared
 * panel and simply not show where it doesn't belong.
 */
const STARS = [
  { left: "6%", top: "12%", size: 3, dur: "3.4s", delay: "0s" },
  { left: "14%", top: "34%", size: 2, dur: "2.8s", delay: ".5s" },
  { left: "22%", top: "8%", size: 2.5, dur: "4.1s", delay: ".2s" },
  { left: "31%", top: "26%", size: 2, dur: "3.1s", delay: "1.1s" },
  { left: "39%", top: "6%", size: 3, dur: "3.7s", delay: ".8s" },
  { left: "47%", top: "20%", size: 2, dur: "2.6s", delay: "1.4s" },
  { left: "55%", top: "9%", size: 2.5, dur: "4.4s", delay: ".3s" },
  { left: "63%", top: "28%", size: 2, dur: "3.3s", delay: ".9s" },
  { left: "71%", top: "5%", size: 3, dur: "3.9s", delay: ".6s" },
  { left: "78%", top: "22%", size: 2, dur: "2.9s", delay: "1.7s" },
  { left: "86%", top: "11%", size: 2.5, dur: "3.6s", delay: ".4s" },
  { left: "93%", top: "30%", size: 2, dur: "4.2s", delay: "1.2s" },
  { left: "10%", top: "52%", size: 2, dur: "3.2s", delay: "1.5s" },
  { left: "35%", top: "44%", size: 2.5, dur: "4.0s", delay: ".7s" },
  { left: "68%", top: "48%", size: 2, dur: "3.5s", delay: "1.0s" },
  { left: "89%", top: "56%", size: 2.5, dur: "2.7s", delay: ".1s" },
];

/** `flip` mirrors the field vertically, for panels whose night sky is at the
 *  foot rather than the head. */
export function Starfield({ flip }: { flip?: boolean } = {}) {
  return (
    <div
      className={`${styles.stars}${flip ? ` ${styles.flip}` : ""}`}
      aria-hidden="true"
    >
      {STARS.map((star, i) => (
        <span
          key={i}
          className={styles.star}
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDuration: star.dur,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  );
}
