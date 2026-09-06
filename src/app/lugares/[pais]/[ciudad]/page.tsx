import { notFound } from "next/navigation";
import Link from "next/link";
import { LIVED_PLACES, VISITED_PLACES } from "@/lib/places";
import { getGalleryItems } from "@/lib/gallery";
import { GalleryGrid } from "@/components/GalleryGrid";

const slugify = (text: string) => {
  if (!text) return "";
  return text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

interface CiudadPageProps {
  params: Promise<{ pais: string; ciudad: string }>;
}

export default async function CiudadPage({ params }: CiudadPageProps) {
  const { pais, ciudad } = await params;
  
  const allPlaces = [
    ...LIVED_PLACES.map(p => ({ ...p, status: "Viví" })),
    ...VISITED_PLACES.map(p => ({ ...p, status: "Visité" }))
  ];
  const place = allPlaces.find(
    p => slugify(p.country) === pais && slugify(p.place) === ciudad
  );
  
  if (!place) {
    notFound();
  }
  
  // Get photos for this specific city
  const gallery = getGalleryItems();
  const cityPhotos = gallery.filter(img => slugify(img.place) === ciudad);

  return (
    <div className="bg-white">
      <header className="px-6 py-16 sm:px-8 md:py-20 lg:py-24">
        <div className="mx-auto max-w-[1500px]">
          <Link href={`/lugares/${pais}`} className="mb-12 inline-flex min-h-8 items-center pb-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-black/50 hover:text-black transition-colors">
            ← Volver a {place.country}
          </Link>
          <div className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-black/45 mb-4">{place.status} en {place.country}</div>
          <h1 className="text-[clamp(4rem,11vw,10rem)] font-bold uppercase leading-[0.8] tracking-[-0.07em] text-blue">{place.place}</h1>
          <div className="font-article mt-10 max-w-2xl text-2xl leading-9 text-black/72 md:text-3xl md:leading-10">
            {cityPhotos.length} {cityPhotos.length === 1 ? "fotografía documentada" : "fotografías documentadas"}.
          </div>
        </div>
      </header>

      <section className="px-6 pb-20 sm:px-8 md:pb-28">
        <div className="mx-auto max-w-[1500px]">
           {cityPhotos.length > 0 ? (
             <GalleryGrid items={cityPhotos} />
           ) : (
             <div className="py-20"><h2 className="text-4xl font-bold text-blue">Todavía no hay fotos de este lugar.</h2></div>
           )}
        </div>
      </section>
    </div>
  );
}
