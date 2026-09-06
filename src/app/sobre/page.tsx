import Image from "next/image";
import Link from "next/link";
import { VSCO_IMAGES } from "@/lib/images";
import { createPageMetadata } from "@/lib/seo";
import { PERSON_NAME, SITE_DESCRIPTION, SITE_NAME, SITE_URL, SOCIAL_PROFILES } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Sobre mí",
  description: "Conocé a Enzo Thome, autor de El Trovador Errante: lugares vividos, intereses culturales y una forma personal de mirar el mundo.",
  path: "/sobre",
});

const profileStructuredData = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: `${SITE_URL}/sobre`,
  name: `Sobre ${PERSON_NAME}`,
  description: SITE_DESCRIPTION,
  mainEntity: {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: PERSON_NAME,
    alternateName: SITE_NAME,
    url: `${SITE_URL}/sobre`,
    image: `${SITE_URL}/brand/logotransp.png`,
    sameAs: SOCIAL_PROFILES,
  },
};

export default function SobrePage() {
  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileStructuredData).replace(/</g, "\\u003c") }} />
      <section className="grid min-h-[calc(100svh-5rem)] lg:grid-cols-[.92fr_1.08fr]">
        <div className="relative min-h-[68svh] bg-blue lg:min-h-full">
          <Image src={VSCO_IMAGES.about} alt="El Mediterráneo visto desde Niza" fill priority sizes="(max-width: 1024px) 100vw, 46vw" className="museum-image object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue/35 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white sm:bottom-8 sm:left-8">Niza · 2024</div>
        </div>
        <div className="flex items-center px-6 py-18 sm:px-10 lg:px-[7vw] lg:py-24">
          <div>
            <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-black/45">Detrás del archivo</div>
            <h1 className="mt-5 text-[clamp(5rem,11vw,10rem)] font-bold uppercase leading-[0.8] tracking-[-0.07em] text-blue">Soy<br />Enzo</h1>
            <div className="font-article mt-10 max-w-2xl space-y-6 text-xl leading-8 text-black/72">
              <div>Nací en Paysandú y aprendí a mirar el mundo caminando ciudades. Entre 2021 y 2024 viví en Dublín, en los Alpes franceses y en Niza. Cada lugar cambió mi relación con el tiempo, el paisaje y la idea de hogar.</div>
              <div>Me interesan la historia, los libros, el cine, los mapas y la arquitectura. Trabajo con tecnología, datos y procesos; este sitio reúne la parte cultural y personal que no entra en una presentación profesional.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-8 md:py-28">
        <div className="mx-auto grid max-w-[1500px] gap-14 lg:grid-cols-[.8fr_1.2fr]">
          <h2 className="text-5xl font-bold uppercase leading-[0.86] tracking-[-0.06em] text-blue sm:text-7xl">Una forma<br />de mirar</h2>
          <div className="grid gap-10 md:grid-cols-2">
            <article className="pt-5">
              <h3 className="text-xl font-bold uppercase text-blue">Caminar para entender</h3>
              <div className="font-article mt-4 text-lg leading-8 text-black/68">Mi manera preferida de conocer una ciudad es recorrerla sin apuro, entrar en sus calles laterales y observar cómo la historia convive con la vida cotidiana.</div>
            </article>
            <article className="pt-5">
              <h3 className="text-xl font-bold uppercase text-blue">Cultura como hilo</h3>
              <div className="font-article mt-4 text-lg leading-8 text-black/68">Los viajes, la literatura, el cine y la historia no aparecen como temas separados. Son distintas maneras de volver sobre una misma pregunta: cómo vivimos y qué dejamos detrás.</div>
            </article>
            <article className="pt-5">
              <h3 className="text-xl font-bold uppercase text-blue">Orden e independencia</h3>
              <div className="font-article mt-4 text-lg leading-8 text-black/68">Me atraen los sistemas, los mapas y las estructuras porque permiten transformar ideas dispersas en algo legible, útil y duradero.</div>
            </article>
            <article className="pt-5">
              <h3 className="text-xl font-bold uppercase text-blue">Fotografía con memoria</h3>
              <div className="font-article mt-4 text-lg leading-8 text-black/68">Prefiero imágenes espontáneas, imperfectas y con textura. No están para exhibir una vida: acompañan el recuerdo de un lugar y el clima de una historia.</div>
            </article>
          </div>
        </div>
      </section>

      <section className="grid bg-blue text-white lg:grid-cols-2">
        <div className="relative min-h-[58svh] overflow-hidden">
          <Image src={VSCO_IMAGES.armillary} alt="Florencia bajo la luz del atardecer" fill sizes="(max-width: 1024px) 100vw, 50vw" className="museum-image object-cover opacity-90" />
        </div>
        <div className="flex items-center px-6 py-20 sm:px-10 lg:px-[7vw]">
          <div>
            <h2 className="text-5xl font-bold uppercase leading-[0.86] tracking-[-0.06em] sm:text-7xl">Un archivo<br />público</h2>
            <div className="font-article mt-8 max-w-xl text-xl leading-8 text-white/72">Esto no es un currículum ni un diario íntimo. Es una selección de escritos, lugares e imágenes que tienen algo para decir fuera de su momento original.</div>
            <Link href="/viajes" className="mt-9 inline-flex min-h-12 items-center text-xs font-semibold uppercase tracking-[0.13em]">Recorrer los viajes</Link>
          </div>
        </div>
      </section>

      <section id="contacto" className="grid px-6 py-20 sm:px-8 md:grid-cols-2 md:py-28">
        <h2 className="text-5xl font-bold uppercase tracking-[-0.06em] text-blue sm:text-7xl">Contacto</h2>
        <div className="mt-8 max-w-lg md:mt-0">
          <div className="font-article text-lg leading-8 text-black/70">Para propuestas, colaboraciones o conversaciones vinculadas al proyecto.</div>
          <a href="mailto:enzothome1@gmail.com" className="mt-8 inline-flex min-h-12 items-center rounded-full bg-blue px-6 text-xs font-semibold uppercase tracking-[0.13em] text-white transition-colors hover:bg-black">Escribirme</a>
        </div>
      </section>
    </div>
  );
}
