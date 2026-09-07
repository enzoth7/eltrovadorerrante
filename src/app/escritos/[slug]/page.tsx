import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleBody from "@/components/ArticleBody";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { VSCO_IMAGES } from "@/lib/images";
import { PERSON_NAME, SITE_NAME, SITE_URL } from "@/lib/site";
import type { Post } from "@/lib/types";

const categoryImages: Record<string, string> = {
  viajes: VSCO_IMAGES.coast,
  libros: VSCO_IMAGES.postcards,
  arte: VSCO_IMAGES.hercules,
  historia: VSCO_IMAGES.armillary,
  reflexiones: VSCO_IMAGES.statue,
  peliculas: VSCO_IMAGES.night,
};

const postImages: Record<string, string> = {
  "por-que-leemos": VSCO_IMAGES.postcards,
  "perdido-en-roma": VSCO_IMAGES.hercules,
  "paris-y-el-conde-de-montecristo": VSCO_IMAGES.night,
};

function resolvePostImage(post: Post) {
  return post.coverImage || postImages[post.slug] || categoryImages[post.category.toLowerCase()] || VSCO_IMAGES.coast;
}

export async function generateStaticParams() {
  return (await getAllPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);
    if (!post) throw new Error('Not found');
    const image = resolvePostImage(post);
    return {
      title: post.title,
      description: post.description,
      authors: [{ name: PERSON_NAME, url: "/sobre" }],
      keywords: post.tags,
      alternates: { canonical: `/escritos/${post.slug}` },
      openGraph: {
        type: "article",
        locale: "es_UY",
        url: `/escritos/${post.slug}`,
        siteName: SITE_NAME,
        title: post.title,
        description: post.description,
        publishedTime: `${post.date}T12:00:00Z`,
        authors: [PERSON_NAME],
        tags: post.tags,
        images: [{ url: image, alt: post.title }],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.description,
        images: [image],
      },
    };
  } catch {
    return { title: "Escrito no encontrado", robots: { index: false, follow: false } };
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = await getAllPosts();
  const currentIndex = allPosts.findIndex((item) => item.slug === post.slug);
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const image = resolvePostImage(post);
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: `${SITE_URL}${image}`,
    datePublished: `${post.date}T12:00:00Z`,
    inLanguage: "es-UY",
    mainEntityOfPage: `${SITE_URL}/escritos/${post.slug}`,
    author: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: PERSON_NAME },
    publisher: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: PERSON_NAME },
  };

  return (
    <article className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData).replace(/</g, "\\u003c") }} />
      <header className="px-6 pb-14 pt-16 text-center md:px-8 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-5xl font-bold leading-[0.9] tracking-[-0.055em] text-blue md:text-7xl lg:text-8xl">{post.title}</h1>
          <p className="mx-auto mt-6 max-w-2xl font-heading text-xl italic leading-relaxed text-ink/65 md:text-2xl">{post.description}</p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="relative aspect-[16/8] overflow-hidden bg-blue">
          <Image src={image} alt="" fill priority sizes="(max-width: 1200px) 100vw, 1152px" className="museum-image object-cover" />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16 md:px-8 md:py-24">
        <div className="reading-copy font-heading text-xl leading-[1.78] text-ink/82 md:text-[1.42rem]">
          <ArticleBody content={post.content} />
        </div>

        <nav className="mt-16 grid gap-4 border-t border-line pt-10 sm:grid-cols-2" aria-label="Otros escritos">
          {previousPost ? (
            <Link href={`/escritos/${previousPost.slug}`} className="group border border-line p-6 transition-colors hover:bg-blue hover:text-white">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.14em]">Anterior</span>
              <span className="mt-3 block font-heading text-2xl font-semibold leading-tight text-ink">{previousPost.title}</span>
            </Link>
          ) : <div />}
          {nextPost ? (
            <Link href={`/escritos/${nextPost.slug}`} className="group border border-line p-6 text-right transition-colors hover:bg-blue hover:text-white">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.14em]">Siguiente</span>
              <span className="mt-3 block font-heading text-2xl font-semibold leading-tight text-ink">{nextPost.title}</span>
            </Link>
          ) : <div />}
        </nav>
      </div>
    </article>
  );
}
