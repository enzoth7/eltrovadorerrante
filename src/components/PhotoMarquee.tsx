"use client";

import { useSyncExternalStore, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";

interface MarqueePhoto {
  id: string;
  src: string;
}

interface PhotoMarqueeProps {
  photos: MarqueePhoto[];
  heading?: string;
  linkHref?: string;
}

const rowSpeeds = [120, 140, 130, 150];
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPreference(onChange: () => void) {
  const mediaQuery = window.matchMedia(reducedMotionQuery);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
}

function getMotionPreference() {
  return window.matchMedia(reducedMotionQuery).matches;
}

export default function PhotoMarquee({ photos, heading, linkHref }: PhotoMarqueeProps) {
  const reducedMotion = useSyncExternalStore(subscribeToMotionPreference, getMotionPreference, () => false);

  if (photos.length === 0) return null;

  const rows = Array.from({ length: 4 }, (_, rowIndex) =>
    photos.filter((_, photoIndex) => photoIndex % 4 === rowIndex),
  ).filter((row) => row.length > 0);

  return (
    <section
      id="archivo-visual"
      className="relative h-[72svh] min-h-[620px] overflow-hidden bg-white md:h-[86svh]"
      aria-label="Archivo fotográfico en movimiento"
      data-paused={reducedMotion}
    >
      <div className="photo-marquee-plane absolute flex flex-col justify-center gap-3 md:gap-5">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="overflow-hidden">
            <div
              className="photo-marquee-track flex w-max gap-3 md:gap-5"
              data-direction={rowIndex % 2 === 0 ? "left" : "right"}
              style={{ "--marquee-duration": `${rowSpeeds[rowIndex]}s` } as CSSProperties}
            >
              {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0 gap-3 md:gap-5" aria-hidden={copy === 1}>
                  {row.map((photo) => (
                    <figure
                      key={`${photo.id}-${copy}`}
                      className="relative h-36 w-52 shrink-0 overflow-hidden bg-black md:h-52 md:w-72"
                    >
                      <Image
                        src={photo.src}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 208px, 288px"
                        className="museum-image object-cover"
                      />
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-white/10" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
      {heading ? (
        linkHref ? (
          <Link href={linkHref} className="story-title pointer-events-auto absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 px-5 py-3 text-center transition-transform hover:scale-105">
            <h2 className="text-[clamp(2.25rem,5vw,5.5rem)] font-bold leading-none tracking-[-0.055em] text-blue">
              {heading}
            </h2>
          </Link>
        ) : (
          <h2 className="story-title pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 px-5 py-3 text-center text-[clamp(2.25rem,5vw,5.5rem)] font-bold leading-none tracking-[-0.055em] text-blue">
            {heading}
          </h2>
        )
      ) : null}
    </section>
  );
}
