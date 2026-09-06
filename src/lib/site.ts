const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.VERCEL_URL ||
  "http://localhost:3000";

export const SITE_URL = `${rawSiteUrl.startsWith("http") ? rawSiteUrl : `https://${rawSiteUrl}`}`.replace(/\/$/, "");

export const SITE_NAME = "El Trovador Errante";
export const PERSON_NAME = "Enzo Thome";
export const DEFAULT_TITLE = `${SITE_NAME} | ${PERSON_NAME}`;
export const SITE_DESCRIPTION = "El Trovador Errante es una mirada a la vida y su significado a través de palabras, imágenes y relatos orales. Enzo Thome, uruguayo nativo de Paysandú, es quién comparte sus experiencias y reflexiones. Se encontrarán viajes, historias, libros, películas y música, entre otras cosas.";

export const SOCIAL_PROFILES = [
  "https://www.instagram.com/enzo.th/",
  "https://www.tiktok.com/@eltrovadorerrante7",
  "https://open.spotify.com/show/5FZAP7k9Z1w2d5atm4vJfb",
  "https://vsco.co/enzo7h/gallery",
  "https://es.pinterest.com/enzoth7/",
  "https://www.goodreads.com/user/show/193998839-enzo",
  "https://letterboxd.com/enzo7h/",
] as const;
