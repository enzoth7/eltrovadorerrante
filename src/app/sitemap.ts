import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1, images: [`${SITE_URL}/images/Villefranche-sur-mer/vsco_073026%20(3).jpg`] },
    { url: `${SITE_URL}/escritos`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/lugares`, lastModified: now, changeFrequency: "monthly", priority: 0.8, images: [`${SITE_URL}/images/Villefranche-sur-mer/vsco_080126%20(7).jpg`] },
    { url: `${SITE_URL}/podcast`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/sobre`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/galeria`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const posts: MetadataRoute.Sitemap = (await getAllPosts()).map((post) => ({
    url: `${SITE_URL}/escritos/${post.slug}`,
    lastModified: new Date(`${post.date}T12:00:00Z`),
    changeFrequency: "yearly",
    priority: post.featured ? 0.8 : 0.7,
  }));

  return [...staticPages, ...posts];
}
