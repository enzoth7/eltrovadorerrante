import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-white" aria-labelledby="home-title">
      <div className="grid min-h-[calc(100svh-62px)] lg:grid-cols-[54%_46%]">
        <div className="relative min-h-[58svh] overflow-hidden bg-blue lg:min-h-full">
          <Image
            src="/assets/vsco_073026 (3).jpg"
            alt="Villefranche-sur-Mer vista desde el Mediterráneo"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 54vw"
            className="museum-image object-cover"
          />
        </div>

        <div className="flex items-center px-6 py-16 sm:px-10 lg:px-[6vw] lg:py-20">
          <div className="w-full max-w-[560px]">
            <h1 id="home-title" className="sr-only">El Trovador Errante</h1>
            <div className="relative aspect-[1.456/1] w-full max-w-[460px] overflow-hidden" aria-hidden="true">
              <div className="absolute inset-y-0 left-0 z-10 w-px bg-white" />
              <Image
                src="/assets/el-trovador-wordmark.png"
                alt=""
                fill
                sizes="(max-width: 1024px) 80vw, 40vw"
                className="object-contain"
              />
            </div>
            <p className="mt-8 max-w-lg text-base leading-7 text-black/70 md:text-lg">
              El archivo personal de Enzo Thome: lugares, historia, libros y cosas que merecen quedarse un poco más.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
