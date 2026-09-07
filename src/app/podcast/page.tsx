import Image from "next/image";
import { VSCO_IMAGES } from "@/lib/images";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Podcast",
  description: "El podcast de Enzo Thome y El Trovador Errante en Spotify: historias, ideas y conversaciones.",
  path: "/podcast",
  image: "/images/Nice/vsco_080226%20(3).jpg",
});

const spotifyUrl = "https://open.spotify.com/show/5FZAP7k9Z1w2d5atm4vJfb";

export default function PodcastPage() {
  return (
    <div className="bg-white">
      <section className="grid min-h-[calc(100vh-62px)] w-full bg-blue text-white lg:grid-cols-2">
        <div className="flex flex-col justify-between px-6 py-16 sm:px-10 md:py-20 lg:px-[7vw]">
          <h1 className="text-[clamp(4.4rem,12vw,11rem)] font-bold uppercase leading-[0.78] tracking-[-0.075em]">Podcast</h1>
          <div className="mt-20 max-w-2xl">
            <div className="font-article text-2xl leading-9 text-white/78 md:text-3xl md:leading-10">Historias, ideas y conversaciones para escuchar con tiempo. La página abre la puerta; el podcast vive en Spotify.</div>
            <a href={spotifyUrl} target="_blank" rel="noopener noreferrer" className="mt-9 inline-flex min-h-12 items-center rounded-full bg-white px-7 text-xs font-semibold uppercase tracking-[0.13em] text-blue">Escuchar en Spotify</a>
          </div>
        </div>
        <div className="relative min-h-[60vh] w-full overflow-hidden border-t border-white/25 lg:min-h-full lg:border-l lg:border-t-0">
          <Image src={VSCO_IMAGES.wineShop} alt="Un café mediterráneo en Niza" fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="museum-image object-cover opacity-85" />
          <div className="absolute inset-0 bg-blue/20" />
        </div>
      </section>
    </div>
  );
}
