import Image from "next/image";
import Link from "next/link";
import { VSCO_IMAGES } from "@/lib/images";
import { createPageMetadata } from "@/lib/seo";
import { PERSON_NAME, SITE_NAME, SITE_URL, SOCIAL_PROFILES } from "@/lib/site";
import { ExpandableGallery } from "@/components/ui/gallery-animation";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
export const metadata = createPageMetadata({
  title: "Mi historia",
  description: "El Trovador Errante y Enzo Thome, dos caras de la misma moneda, ¿Dónde comienza la historia?",
  path: "/sobre",
});

const profileStructuredData = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: `${SITE_URL}/sobre`,
  name: `Mi historia | ${PERSON_NAME}`,
  description: "El Trovador Errante y Enzo Thome, dos caras de la misma moneda, ¿Dónde comienza la historia?",
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
          <Image src="/assets/1.jpg" alt="El Mediterráneo visto desde Niza" fill priority sizes="(max-width: 1024px) 100vw, 46vw" className="museum-image object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue/35 via-transparent to-transparent" />
        </div>
        <div className="flex items-center px-6 py-18 sm:px-10 lg:px-[7vw] lg:py-24">
          <div>
            <h1 className="mt-5 text-[clamp(5rem,11vw,10rem)] font-bold uppercase leading-[0.8] tracking-[-0.07em] text-blue">Me llamo<br />Enzo</h1>
            <div className="font-article mt-10 max-w-2xl space-y-6 text-xl leading-8 text-black/72">
              <div>Nací en un ricón del Uruguay, Paysandú, y aprendí a mirar el mundo primero entre historias y libros, y luego en explorarlo. Entre 2021 y 2024 viví en Dublín, los Alpes franceses y en la Côte d'Azur. Cada lugar cambió mi relación con el tiempo y la idea de hogar.</div>
              <div>Mi pasión mas profunda es la historia, que la suelo encontrar en libros, películas, mapas y caminando las calles de una ciudad. Si bien mi profesión se relaciona con tecnología, datos y procesos; este lugar usa esas habilidad para expresar mi lado más cultural y personal.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-[1500px]">
          <h2 className="mb-14 text-5xl font-bold uppercase leading-[0.86] tracking-[-0.06em] text-blue sm:text-7xl">
            Más que mirar, vivir
          </h2>
          <ExpandableGallery
            items={[
              {
                src: "/assets/2.jpg",
                title: "Caminar para pensar",
                description: "Mi manera preferida de conocer una ciudad es comenzar a caminar hasta perderme, entrando en sus callejones y observar cómo muchas veces la historia de siglos convive con la vida cotidiana.",
              },
              {
                src: "/assets/4.jpg",
                title: "Historia y cultura",
                description: "Los viajes, la literatura, el cine y la historia no aparecen como temas separados. Son distintas maneras de volver sobre una misma pregunta: cómo vivimos y qué dejamos detrás.",
              },
              {
                src: "/assets/33.jpg",
                title: "Todo comienza con un punto de partida",
                description: "Me atraen los mapas porque permiten trazar no solo la ruta a seguir, sino saber de donde se viene y como se llegó a ese lugar.",
              },
              {
                src: "/assets/5.jpg",
                title: "La fotografía como ventana para la memoria",
                description: "No soy partidario del perfeccionismo fotográfico, me gustan más las imágenes espontáneas e imperfectas. Son las que mejor intentan captar la escencia de un momento.",
              },
            ]}
          />
        </div>
      </section>

      <section className="grid bg-blue text-white lg:grid-cols-2">
        <div className="relative min-h-[58svh] overflow-hidden">
          <Image src= "/assets/florencia.jpg" alt="Florencia bajo la luz del atardecer" fill sizes="(max-width: 1024px) 100vw, 50vw" className="museum-image object-cover opacity-90" />
        </div>
        <div className="flex items-center px-6 py-20 sm:px-10 lg:px-[7vw]">
          <div>
            <h2 className="text-5xl font-bold uppercase leading-[0.86] tracking-[-0.06em] sm:text-7xl">Un archivo<br />al mundo</h2>
            <div className="font-article mt-8 max-w-xl text-xl leading-8 text-white/72">Aunque nadie nunca encuntre este lugar y se pierda entre los ceros y unos de la internet, es mi forma de marcar mi paso por este lugar, guardando la esperanza que más que ser encontrado, ser leído.</div>
            <Link href="/viajes" className="mt-9 inline-flex min-h-12 items-center text-xs font-semibold uppercase tracking-[0.13em]">Recorrer los viajes</Link>
          </div>
        </div>
      </section>

      <section id="contacto" className="grid px-6 py-20 sm:px-8 md:grid-cols-2 md:py-28">
        <h2 className="text-5xl font-bold uppercase tracking-[-0.06em] text-blue sm:text-7xl">Contacto</h2>
        <div className="mt-8 max-w-lg md:mt-0">
          <div className="font-article text-lg leading-8 text-black/70">Para conversaciones vinculadas al proyecto.</div>
          <CopyEmailButton email="enzothome1@gmail.com" />
        </div>
      </section>
    </div>
  );
}
