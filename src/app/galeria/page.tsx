import { GalleryGrid } from "@/components/GalleryGrid";
import { getGalleryItems } from "@/lib/gallery";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Imágenes",
  description: "Notas visuales de viajes, arte, arquitectura e historia fotografiadas por Enzo Thome.",
  path: "/galeria",
  image: "/images/Firenze/vsco_080126%20(6).jpg",
});

export default function GaleriaPage() {
  const galleryItems = getGalleryItems();
  return (
    <div className="bg-white">
      <header className="px-6 pb-16 pt-18 sm:px-8 md:pb-24 md:pt-24">
        <h1 className="text-[clamp(3.8rem,15vw,13rem)] font-bold uppercase leading-[0.78] tracking-[-0.075em] text-blue">Imágenes</h1>
      </header>
      <section className="px-2 pb-20 sm:px-4 md:pb-28"><GalleryGrid items={galleryItems} /></section>
    </div>
  );
}
