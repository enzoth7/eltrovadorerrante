import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LIVED_PLACES, VISITED_PLACES } from "@/lib/places";
import { getGalleryItems } from "@/lib/gallery";

const slugify = (text: string) => {
  if (!text) return "";
  return text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

interface PaisPageProps {
  params: Promise<{ pais: string }>;
}

export default async function PaisPage({ params }: PaisPageProps) {
  const { pais } = await params;
  
  const allPlaces = [
    ...LIVED_PLACES.map(p => ({ ...p, status: "Viví" })),
    ...VISITED_PLACES.map(p => ({ ...p, status: "Visité" }))
  ];
  const countryPlaces = allPlaces.filter(p => slugify(p.country) === pais);
  
  if (countryPlaces.length === 0) {
    notFound();
  }
  
  const countryName = countryPlaces[0].country;
  
  // Get all photos for places in this country
  const gallery = getGalleryItems();
  const countryPlaceNames = countryPlaces.map(p => slugify(p.place));
  const countryPhotos = gallery.filter(img => countryPlaceNames.includes(slugify(img.place)));

  return (
    <div className="bg-white">
      <header className="px-6 py-16 sm:px-8 md:py-20 lg:py-24">
        <div className="mx-auto max-w-[1500px]">
          <Link href="/viajes" className="mb-12 inline-flex min-h-8 items-center pb-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-black/50 hover:text-black transition-colors">
            ← Volver a viajes
          </Link>
          <h1 className="text-[clamp(4rem,11vw,10rem)] font-bold uppercase leading-[0.8] tracking-[-0.07em] text-blue">{countryName}</h1>
          <div className="font-article mt-10 max-w-2xl text-2xl leading-9 text-black/72 md:text-3xl md:leading-10">
            {countryPlaces.length} {countryPlaces.length === 1 ? "lugar documentado" : "lugares documentados"} en {countryName}.
          </div>
        </div>
      </header>

      <section className="px-6 pb-20 sm:px-8 md:pb-28">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {countryPlaces.map(place => {
              const placePhotos = countryPhotos.filter(img => slugify(img.place) === slugify(place.place));
              const coverImage = placePhotos.length > 0 ? placePhotos[0].src : null;
              
              return (
                <Link 
                  key={place.place}
                  href={`/lugares/${slugify(place.country)}/${slugify(place.place)}`}
                  className="group block"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-blue">
                    {coverImage ? (
                      <Image 
                        src={coverImage} 
                        alt={place.place} 
                        fill 
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white/20 font-article italic">
                        Sin fotos
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                  <div className="mt-5">
                    <div className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-black/50 mb-2">
                      {place.status}
                    </div>
                    <h3 className="text-2xl font-bold uppercase text-blue">
                      {place.place}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
