import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAllPlaces, slugifyPlace } from "@/lib/places";
import { getGalleryItems } from "@/lib/gallery";
import { getLocationContent } from "@/lib/location-content";
import MasonryGrid from "@/components/ui/masonry-grid";

interface PaisPageProps {
  params: Promise<{ pais: string }>;
}

export default async function PaisPage({ params }: PaisPageProps) {
  const { pais } = await params;
  
  const allPlaces = getAllPlaces();
  const countryPlaces = allPlaces.filter(p => slugifyPlace(p.country) === pais);
  
  if (countryPlaces.length === 0) {
    notFound();
  }
  
  const countryName = countryPlaces[0].country;
  const locationContent = await getLocationContent(pais);
  
  // Get all photos for places in this country
  const gallery = getGalleryItems();
  const countryPlaceNames = countryPlaces.map(p => slugifyPlace(p.place));
  const countryPhotos = gallery.filter(img => countryPlaceNames.includes(slugifyPlace(img.place)));

  return (
    <div className="bg-white">
      <header className="px-6 py-16 sm:px-8 md:py-20 lg:py-24">
        <div className="mx-auto max-w-[1500px]">
          <Link href="/viajes" className="mb-12 inline-flex min-h-8 items-center pb-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-black/50 hover:text-black transition-colors">
            Volver a viajes
          </Link>
          <h1 className="text-[clamp(4rem,11vw,10rem)] font-bold uppercase leading-[0.8] tracking-[-0.07em] text-blue">{countryName}</h1>
          {locationContent?.description && (
            <p className="mt-10 max-w-3xl whitespace-pre-line font-article text-2xl leading-9 text-black/72 md:text-3xl md:leading-10">
              {locationContent.description}
            </p>
          )}
        </div>
      </header>

      <section className="px-6 pb-20 sm:px-8 md:pb-28">
        <div className="mx-auto max-w-[1500px]">
          <MasonryGrid
            className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4"
            gap="3rem"
          >
            {countryPlaces.map((place, index) => {
              const placePhotos = countryPhotos.filter(img => slugifyPlace(img.place) === slugifyPlace(place.place));
              const coverImage = placePhotos.length > 0 ? placePhotos[0].src : null;
              
              // Alternar aspect ratios para crear un efecto masonry asimétrico real
              const aspectRatios = [
                "aspect-[3/4]",
                "aspect-[4/5]",
                "aspect-square",
                "aspect-[2/3]",
                "aspect-[3/5]"
              ];
              const aspectClass = aspectRatios[index % aspectRatios.length];
              
              return (
                <Link 
                  key={place.place}
                  href={`/lugares/${slugifyPlace(place.country)}/${slugifyPlace(place.place)}`}
                  className="group block"
                >
                  <div className={`relative ${aspectClass} w-full overflow-hidden bg-blue`}>
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
                    <h3 className="text-2xl font-bold uppercase text-blue">
                      {place.place}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </MasonryGrid>
        </div>
      </section>
    </div>
  );
}
