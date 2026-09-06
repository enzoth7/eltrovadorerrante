import Image from "next/image";

import Link from "next/link";

const slugify = (text: string) => {
  if (!text) return "";
  return text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export interface PlaceCard {
  place: string;
  country: string;
  period?: string;
  status: "Viví" | "Visité";
  image?: string;
}

export default function PlacesCarousel({ places }: { places: PlaceCard[] }) {
  if (places.length === 0) return null;

  return (
    <div className="overflow-hidden bg-white py-4" aria-label="Lugares vividos y visitados">
      <div
        className="flex w-max gap-3 sm:gap-5 hover:[animation-play-state:paused]"
        style={{ animation: `photo-marquee-left ${Math.max(40, places.length * 4)}s linear infinite` }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 gap-3 sm:gap-5" aria-hidden={copy === 1}>
            {places.map((item, index) => (
              <Link
                key={`${item.status}-${item.place}`}
                href={`/lugares/${slugify(item.country)}/${slugify(item.place)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block aspect-[3/4] w-[76vw] max-w-[320px] shrink-0 overflow-hidden border border-blue bg-blue text-white sm:w-[310px] group cursor-pointer"
              >
                {item.image ? (
                  <>
                    <Image
                      src={item.image}
                      alt={`Fotografía de ${item.place}`}
                      fill
                      sizes="(max-width: 640px) 76vw, 310px"
                      className="museum-image object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue/90 via-blue/10 to-blue/20" />
                  </>
                ) : (
                  <div className="absolute right-5 top-5 text-7xl font-bold tabular-nums text-white/10 transition-transform duration-700 group-hover:-translate-y-2 group-hover:translate-x-2">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 p-6 transition-transform duration-500 group-hover:-translate-y-2">
                  <h3 className="text-3xl font-bold uppercase leading-[0.9] tracking-[-0.045em] sm:text-4xl">
                    {item.place}
                  </h3>
                  <div className="mt-2 text-xs uppercase tracking-[0.13em] text-white/75">
                    {item.country}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
