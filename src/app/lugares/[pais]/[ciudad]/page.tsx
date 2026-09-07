import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { findPlace, slugifyPlace } from "@/lib/places";
import { getGalleryItems } from "@/lib/gallery";
import { GalleryGrid } from "@/components/GalleryGrid";
import { getLocationContent } from "@/lib/location-content";
import { createPageMetadata } from "@/lib/seo";
import ThumbnailCarousel from "@/components/ui/thumbnail-carousel";

interface CiudadPageProps {
  params: Promise<{ pais: string; ciudad: string }>;
}

export async function generateMetadata({ params }: CiudadPageProps): Promise<Metadata> {
  const { pais, ciudad } = await params;
  const place = findPlace(pais, ciudad);

  if (!place) {
    return { title: "Lugar no encontrado", robots: { index: false, follow: false } };
  }

  const locationContent = await getLocationContent(pais, ciudad);
  const gallery = getGalleryItems();
  const cityPhotos = gallery.filter((img) => slugifyPlace(img.place) === ciudad);
  const coverImage = cityPhotos[0]?.src;
  const description = locationContent?.description
    ? locationContent.description.replace(/\s+/g, " ").trim().slice(0, 160)
    : `Fotografías y memorias de ${place.place}, ${place.country}.`;

  return createPageMetadata({
    title: place.place,
    description,
    path: `/lugares/${pais}/${ciudad}`,
    ...(coverImage ? { image: coverImage } : {}),
  });
}

export default async function CiudadPage({ params }: CiudadPageProps) {
  const { pais, ciudad } = await params;
  
  const place = findPlace(pais, ciudad);
  
  if (!place) {
    notFound();
  }
  
  // Get photos for this specific city
  const gallery = getGalleryItems();
  const cityPhotos = gallery.filter(img => slugifyPlace(img.place) === ciudad);
  const locationContent = await getLocationContent(pais, ciudad);

  return (
    <div className="bg-white">
      <header className="px-6 py-16 sm:px-8 md:py-20 lg:py-24">
        <div className="mx-auto max-w-[1500px]">
          <Link href={`/lugares/${pais}`} className="mb-12 inline-flex min-h-8 items-center pb-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-black/50 hover:text-black transition-colors">
            Volver a {place.country}
          </Link>
          <h1 className="text-[clamp(4rem,11vw,10rem)] font-bold uppercase leading-[0.8] tracking-[-0.07em] text-blue">{place.place}</h1>
          {locationContent?.description && (
            <p className="mt-10 max-w-3xl whitespace-pre-line font-article text-2xl leading-9 text-black/72 md:text-3xl md:leading-10">
              {locationContent.description}
            </p>
          )}
        </div>
      </header>

      <section className="px-6 pb-20 sm:px-8 md:pb-28">
        <div className="mx-auto max-w-[1500px]">
          {cityPhotos.length > 0 ? (
            <ThumbnailCarousel 
              items={cityPhotos.map(photo => ({
                id: photo.id,
                url: photo.src,
                title: photo.alt || place.place
              }))}
            />
          ) : (
            <div className="py-20"><h2 className="text-4xl font-bold text-blue">Todavía no hay fotos de este lugar.</h2></div>
          )}
        </div>
      </section>
    </div>
  );
}
