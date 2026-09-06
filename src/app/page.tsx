import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import PhotoMarquee from "@/components/PhotoMarquee";
import { getGalleryItems } from "@/lib/gallery";

const spotifyUrl = "https://open.spotify.com/show/5FZAP7k9Z1w2d5atm4vJfb";

export default function HomePage() {
  const photos = getGalleryItems();

  return (
    <>
      <Hero />

      <section className="bg-white px-5 py-20 sm:px-8 lg:pb-[6.25rem] lg:pt-10">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="mb-10 text-center lg:mb-[2.9rem]">
            <h2 className="text-5xl font-bold uppercase tracking-[-0.06em] text-blue lg:text-[55px]">Escritos</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-black/65 lg:mt-4 lg:text-xs lg:leading-normal">
              Una colección de reflexiones, pensamientos y formas de mirar el mundo, la vida y la cultura.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:grid-rows-[22rem_13rem] lg:hidden">
            <Link href="/escritos" className="group relative min-h-[32rem] overflow-hidden bg-blue md:row-span-2 md:min-h-0" aria-label="Ver escritos">
              <Image src="/assets/vsco_080226 (5).jpg" alt="Grabados y periódicos antiguos en un mercado de Niza" fill sizes="(max-width: 768px) 100vw, 45vw" className="museum-image object-cover transition-transform duration-700 group-hover:scale-[1.015]" />
            </Link>
            <Link href="/escritos" className="group relative min-h-72 overflow-hidden bg-blue md:min-h-0" aria-label="Explorar el archivo de escritos">
              <Image src="/assets/vsco_073026.jpg" alt="Costa mediterránea desde Villefranche-sur-Mer" fill sizes="(max-width: 768px) 100vw, 55vw" className="museum-image object-cover transition-transform duration-700 group-hover:scale-[1.015]" />
            </Link>
            <div className="grid min-h-72 grid-cols-2 gap-5 md:min-h-0">
              <Link href="/escritos" className="group relative overflow-hidden bg-blue" aria-label="Leer el archivo cultural">
                <Image src="/assets/nice-postcards.jpg" alt="Postales mediterráneas" fill sizes="(max-width: 768px) 50vw, 28vw" className="museum-image object-cover transition-transform duration-700 group-hover:scale-[1.015]" />
              </Link>
              <Link href="/escritos" className="group relative overflow-hidden bg-blue" aria-label="Ver más escritos">
                <Image src="/assets/vsco_072726 (2).jpg" alt="Cámaras antiguas en un mercado de Niza" fill sizes="(max-width: 768px) 50vw, 28vw" className="museum-image object-cover transition-transform duration-700 group-hover:scale-[1.015]" />
              </Link>
            </div>
          </div>

          <div className="relative hidden aspect-[1082/545] lg:block">
            <Link href="/escritos" className="group absolute inset-y-0 left-0 w-[44.27%] overflow-hidden bg-blue" aria-label="Ver escritos">
              <Image src="/assets/vsco_080226 (5).jpg" alt="Grabados y periódicos antiguos en un mercado de Niza" fill sizes="479px" className="museum-image object-cover transition-transform duration-700 group-hover:scale-[1.015]" />
            </Link>
            <Link href="/escritos" className="group absolute left-[46.95%] top-0 h-[59.27%] w-[53.05%] overflow-hidden bg-blue" aria-label="Explorar el archivo de escritos">
              <Image src="/assets/vsco_073026.jpg" alt="Costa mediterránea desde Villefranche-sur-Mer" fill sizes="574px" className="museum-image object-cover transition-transform duration-700 group-hover:scale-[1.015]" />
            </Link>
            <Link href="/escritos" className="group absolute left-[47.04%] top-[62.2%] h-[37.8%] w-[15.9%] overflow-hidden bg-blue" aria-label="Leer el archivo cultural">
              <Image src="/assets/nice-postcards.jpg" alt="Postales mediterráneas" fill sizes="172px" className="museum-image object-cover transition-transform duration-700 group-hover:scale-[1.015]" />
            </Link>
            <Link href="/escritos" className="group absolute left-[65.62%] top-[62.2%] h-[37.8%] w-[14.23%] overflow-hidden bg-blue" aria-label="Ver más escritos">
              <Image src="/assets/vsco_072726 (2).jpg" alt="Cámaras antiguas en un mercado de Niza" fill sizes="154px" className="museum-image object-cover transition-transform duration-700 group-hover:scale-[1.015]" />
            </Link>
            <Link
              href="/escritos"
              className="absolute left-[86.14%] top-[77.6%] inline-flex h-[38px] w-[113px] items-center justify-center bg-blue text-[15px] font-normal normal-case text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
            >
              Ver más
            </Link>
          </div>

          <div className="mt-8 flex justify-end lg:hidden">
            <Link
              href="/escritos"
              className="inline-flex min-h-12 min-w-[8.75rem] items-center justify-center bg-blue px-7 py-3 text-base font-normal normal-case text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
            >
              Ver más
            </Link>
          </div>
        </div>
      </section>

      <section className="flex flex-col bg-blue text-white md:flex-row">
        <div className="flex min-h-[420px] w-full items-center justify-center px-8 py-20 md:w-[50%] md:min-h-[600px] md:px-[7vw]">
          <div className="w-full max-w-md">
            <h2 className="text-center text-[clamp(3.5rem,5vw,4.5rem)] font-bold uppercase leading-none tracking-[-0.05em] sm:text-left">
              Podcast
            </h2>
            <p className="mt-6 text-left text-sm leading-6 text-white/75 sm:text-base">
              Historias, ideas y conversaciones para escuchar con otro ritmo, más allá de la página.
            </p>
            <div className="mt-10 flex justify-center sm:justify-start">
              <a
                href={spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-3 bg-white px-5 py-2.5 text-base font-medium normal-case text-blue transition-opacity hover:opacity-90"
              >
                <Image src="/icons/spotify.svg" alt="" width={24} height={24} aria-hidden="true" />
                Escuchar
              </a>
            </div>
          </div>
        </div>
        <div className="relative min-h-[420px] w-full overflow-hidden md:w-[42%] md:min-h-[600px]">
          <Image src="/assets/descarga.jpg" alt="Mesa de edición de audio y video" fill sizes="(max-width: 768px) 100vw, 42vw" className="museum-image object-cover" />
        </div>
        <div className="hidden bg-blue md:block md:w-[8%]" aria-hidden="true" />
      </section>

      <section className="bg-white px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-[1440px]">
          <h2 className="mb-12 text-center text-[clamp(2.4rem,5vw,4.5rem)] font-bold leading-none tracking-[-0.055em] text-blue">
            Una biblioteca de libros y más
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            <a href="https://www.goodreads.com/user/show/193998839-enzo" target="_blank" rel="noopener noreferrer" className="group relative min-h-[34rem] cursor-pointer overflow-hidden bg-blue md:min-h-[44rem]">
              <Image src="/assets/descarga (2).jpg" alt="Biblioteca con libros, objetos y una maqueta de barco" fill sizes="(max-width: 768px) 100vw, 33vw" className="museum-image object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
            </a>
            <a href="https://letterboxd.com/enzo7h/" target="_blank" rel="noopener noreferrer" className="group relative min-h-[34rem] cursor-pointer overflow-hidden bg-blue md:min-h-[44rem]">
              <Image src="/assets/Movie Room Aesthetic_Retro Cinema Vibes_Vintage Movie Corner_80s movie aesthetic, 90s aesthetic.jpg" alt="Archivo doméstico de cine clásico" fill sizes="(max-width: 768px) 100vw, 33vw" className="museum-image object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
            </a>
            <a href="https://open.spotify.com/user/22joqftlhesjppfrgubk4f2li?si=5467e051c038486c" target="_blank" rel="noopener noreferrer" className="group relative min-h-[34rem] cursor-pointer overflow-hidden bg-blue md:min-h-[44rem]">
              <Image src="/assets/descarga (1).jpg" alt="Tocadiscos y colección de vinilos" fill sizes="(max-width: 768px) 100vw, 33vw" className="museum-image object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
            </a>
          </div>
        </div>
      </section>

      <section className="relative min-h-[34rem] overflow-hidden bg-blue text-white md:min-h-[28rem]">
        <Image src="/assets/vsco_072626 (3).jpg" alt="Enzo ante un paisaje de montaña" fill sizes="100vw" className="museum-image object-cover object-center md:object-[center_42%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-blue/55" />
        <div className="relative min-h-[34rem] md:min-h-[28rem]">
          <h2 className="absolute right-[6vw] top-12 text-right text-[clamp(2.6rem,4.3vw,4.2rem)] font-bold uppercase leading-[0.9] tracking-[-0.06em] text-blue md:top-8">
            <Link href="/viajes" className="transition-opacity hover:opacity-80">
              Viajes y <br className="md:hidden" />anécdotas
            </Link>
          </h2>
          <p className="absolute bottom-12 left-[5vw] max-w-lg text-base leading-7 text-white/90 md:bottom-8">
            Lugares que dejaron una marca, escenas que todavía vuelven y relatos nacidos de estar lejos de casa.
          </p>
        </div>
      </section>

      <PhotoMarquee photos={photos} heading="Esta es mi historia" linkHref="/sobre" />
    </>
  );
}
