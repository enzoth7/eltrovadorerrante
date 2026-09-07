import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { getAllPlaces, slugifyPlace } from "@/lib/places";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 1. Páginas estáticas principales
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
      images: [`${SITE_URL}/images/Villefranche-sur-mer/vsco_073026%20(3).jpg`],
    },
    {
      url: `${SITE_URL}/escritos`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/viajes`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      images: [`${SITE_URL}/assets/villefranche.jpg`],
    },
    {
      url: `${SITE_URL}/podcast`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/sobre`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // 2. Lugares por país y por ciudad
  const allPlaces = getAllPlaces();

  const seenCountries = new Set<string>();
  const countryPages: MetadataRoute.Sitemap = [];

  const seenCities = new Set<string>();
  const cityPages: MetadataRoute.Sitemap = [];

  for (const p of allPlaces) {
    const countrySlug = slugifyPlace(p.country);
    const placeSlug = slugifyPlace(p.place);

    if (countrySlug && !seenCountries.has(countrySlug)) {
      seenCountries.add(countrySlug);
      countryPages.push({
        url: `${SITE_URL}/lugares/${countrySlug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }

    if (countrySlug && placeSlug) {
      const cityKey = `${countrySlug}/${placeSlug}`;
      if (!seenCities.has(cityKey)) {
        seenCities.add(cityKey);
        cityPages.push({
          url: `${SITE_URL}/lugares/${countrySlug}/${placeSlug}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }
  }

  // 3. Artículos / Escritos
  const posts: MetadataRoute.Sitemap = (await getAllPosts()).map((post) => ({
    url: `${SITE_URL}/escritos/${post.slug}`,
    lastModified: new Date(`${post.date}T12:00:00Z`),
    changeFrequency: "yearly",
    priority: post.featured ? 0.8 : 0.7,
  }));

  return [...staticPages, ...countryPages, ...cityPages, ...posts];
}
