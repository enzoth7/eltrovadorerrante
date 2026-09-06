"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

interface LightboxProps { src: string; alt: string; place: string; year?: string; onClose: () => void; }

export function Lightbox({ src, alt, place, year, onClose }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    closeRef.current?.focus();
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", handleKeyDown); };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-blue/98 p-4 text-white md:p-10" role="dialog" aria-modal="true" aria-label={alt} onClick={onClose}>
      <button ref={closeRef} type="button" onClick={onClose} className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/45 text-white hover:bg-white hover:text-blue md:right-8 md:top-8" aria-label="Cerrar imagen">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" /></svg>
      </button>
      <figure className="flex max-h-[90vh] max-w-6xl flex-col items-center" onClick={(event) => event.stopPropagation()}>
        <div className="relative h-[76vh] w-[88vw] max-w-5xl"><Image src={src} alt={alt} fill sizes="88vw" className="object-contain" priority /></div>
        <figcaption className="mt-4 flex w-full max-w-3xl justify-between gap-4 border-t border-white/35 pt-3 text-[0.66rem] font-bold uppercase tracking-[0.14em] text-white/70"><div>{place}</div>{year && <div>{year}</div>}</figcaption>
      </figure>
    </div>
  );
}
