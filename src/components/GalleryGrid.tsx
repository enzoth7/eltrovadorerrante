"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox } from "./Lightbox";

export interface GalleryItem { id: string; src: string; alt: string; place: string; year?: string; }

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  return (
    <>
      <div className="columns-1 gap-2 sm:columns-2 lg:columns-3">
        {items.map((item, index) => (
          <figure key={item.id} className="mb-10 break-inside-avoid">
            <button type="button" onClick={() => setSelectedItem(item)} className="group relative block w-full overflow-hidden bg-blue text-left" aria-label={`Ampliar: ${item.alt}`}>
              <Image src={item.src} alt={item.alt} width={900} height={index % 3 === 1 ? 1180 : 980} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className={`museum-image w-full object-cover transition-transform duration-500 group-hover:scale-[1.015] ${index % 3 === 1 ? "aspect-[4/5]" : "aspect-[3/4]"}`} />
              <div className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-blue opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">＋</div>
            </button>
            <figcaption className="flex justify-between gap-4 pt-3 text-[0.65rem] font-bold uppercase tracking-[0.13em] text-black/60">
              <div>{item.place}</div>{item.year && <div>{item.year}</div>}
            </figcaption>
          </figure>
        ))}
      </div>
      {selectedItem && <Lightbox {...selectedItem} onClose={() => setSelectedItem(null)} />}
    </>
  );
}
