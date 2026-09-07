import Image from "next/image";
import MapWrapper from "@/components/MapWrapper";
import PlacesCarousel from "@/components/PlacesCarousel";
import { getGalleryItems } from "@/lib/gallery";
import { VSCO_IMAGES } from "@/lib/images";
import { LIVED_PLACES, VISITED_PLACES } from "@/lib/places";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Viajes",
  description: "Las geografías que formaron la mirada de El Trovador Errante.",
  path: "/viajes",
});

const placeKey = (place: string) =>
  place.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");

import { createClient } from "@/lib/supabase/server";

export default async function ViajesPage() {
  const supabase = await createClient();
  const { data: locationData } = await supabase
    .from("location_content")
    .select("country_name, description")
    .is("place_slug", null);

  const countryDescriptions = Object.fromEntries(
    (locationData || []).map((row) => [row.country_name, row.description])
  );

  const gallery = getGalleryItems();
  const imageByPlace = new Map(gallery.map((image) => [placeKey(image.place), image.src]));
  const uniquePlaces = Array.from(new Set(gallery.map((img) => img.place)));
  const places = uniquePlaces.map((placeName) => {
    const lived = LIVED_PLACES.find((p) => p.place === placeName);
    const visited = VISITED_PLACES.find((p) => p.place === placeName);
    const image = imageByPlace.get(placeKey(placeName));

    if (lived) {
      return { place: lived.place, country: lived.country, period: lived.period, status: "Viví" as const, image };
    } else if (visited) {
      return { place: visited.place, country: visited.country, status: "Visité" as const, image };
    } else {
      return { place: placeName, country: "", status: "Visité" as const, image };
    }
  });


  return (
    <div className="bg-white">
      <header className="grid min-h-[calc(100vh-62px)] lg:grid-cols-[1.05fr_.95fr]">
        <div className="flex flex-col justify-between px-6 py-16 sm:px-8 md:py-20 pb-12 lg:pb-20">
          <h1 className="text-[clamp(4.6rem,13vw,12rem)] font-bold uppercase leading-[0.78] tracking-[-0.075em] text-blue">Viajes</h1>
          <div className="font-article mt-16 max-w-2xl text-2xl leading-9 text-black/72 md:text-3xl md:leading-10">Hay ciudades que se visitan y otras que cambian el modo en que uno entiende el tiempo, la distancia y la idea de hogar.</div>
        </div>
        <div className="relative h-full min-h-[62vh] lg:min-h-[calc(100vh-62px)] overflow-hidden bg-blue">
          <Image src={VSCO_IMAGES.placesCoast} alt="Costa mediterránea de Villefranche-sur-Mer" fill priority sizes="(max-width: 1024px) 100vw, 48vw" className="museum-image object-cover" />
        </div>
      </header>

      <section id="mapa-paises" aria-label="Mapa interactivo de viajes" className="w-full mt-24 lg:mt-32">
        <MapWrapper countryDescriptions={countryDescriptions} />
      </section>

      <section id="mapa-personal" className="overflow-hidden px-6 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-14 grid gap-6 pb-6 md:grid-cols-[1fr_1fr] md:items-end">
            <h2 className="text-5xl font-bold uppercase tracking-[-0.06em] text-blue sm:text-7xl">Una vida<br />entre lugares</h2>
            <div className="font-article max-w-xl text-lg leading-8 text-black/65 md:justify-self-end">Los lugares que viví o visité, reunidos como un mapa personal. Algunos fueron hogar; otros dejaron una imagen, una historia o una forma nueva de mirar.</div>
          </div>
          <PlacesCarousel places={places} />
        </div>
      </section>
    </div>
  );
}
