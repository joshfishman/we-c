"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

/**
 * Full-bleed background video with a hardened autoplay/mobile story:
 *
 * - Always renders the poster as an <img> layer BEHIND the video, so a still
 *   frame shows on every browser even when autoplay is blocked (iOS Low Power
 *   Mode, data-saver, decode failure) — fixes "bg didn't show on all browsers".
 * - `muted` is set as a DOM property (not just the attribute, which some
 *   browsers ignore) and play() is (re)called on mount + when the media is
 *   ready, so it autoplays on mobile.
 * - `loop`, `playsInline`, no `controls`, no PiP/remote-playback → it never
 *   shows a play button and never pauses on its own.
 *
 * There is deliberately no error handling: the `poster` attribute is what the
 * element paints whenever the media can't play — verified against a 404, an
 * undecodable body, an aborted request, and blocked autoplay, all of which
 * render the still frame and no play button. Detecting the failure wouldn't
 * change what's on screen, and a <source> child's error fires before hydration
 * (leaving video.error null), so a listener here would never even run.
 *
 * The poster must be a frame of the video it backs, or the fallback shows a
 * different scene than the one that plays.
 */
export function BgVideo({
  src,
  mobileSrc,
  poster,
  className,
}: {
  src?: string;
  mobileSrc?: string;
  poster?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  const isMobile = useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(max-width: 768px)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(max-width: 768px)").matches,
    () => false // desktop on the server → matches SSR
  );

  const chosen = mobileSrc && isMobile ? mobileSrc : src;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true; // property, not just attribute — required for iOS autoplay
    const play = () => {
      const p = v.play();
      // A rejection is autoplay policy (Low Power Mode, data saver), not a
      // broken file: the element keeps showing its poster frame.
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    play();
    v.addEventListener("loadeddata", play);
    v.addEventListener("canplay", play);
    return () => {
      v.removeEventListener("loadeddata", play);
      v.removeEventListener("canplay", play);
    };
  }, [chosen]);

  return (
    <>
      {poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={className} src={poster} alt="" aria-hidden="true" />
      ) : null}
      {chosen ? (
        <video
          key={chosen}
          ref={ref}
          className={className}
          aria-hidden="true"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={poster || undefined}
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
        >
          <source src={chosen} type="video/mp4" />
        </video>
      ) : null}
    </>
  );
}
