import type { Metadata } from "next";
import { PERSON_NAME, SITE_NAME } from "@/lib/site";

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
}

export function createPageMetadata({ title, description, path, image = "/images/Villefranche-sur-mer/vsco_073026%20(3).jpg" }: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    authors: [{ name: PERSON_NAME, url: "/sobre" }],
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "es_UY",
      url: path,
      siteName: SITE_NAME,
      title: `${PERSON_NAME} | ${title}`,
      description,
      images: [{ url: image, alt: `${SITE_NAME} por ${PERSON_NAME}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${PERSON_NAME} | ${title}`,
      description,
      images: [image],
    },
  };
}
