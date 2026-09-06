import type { MetadataRoute } from "next";
import { DEFAULT_TITLE, SITE_DESCRIPTION } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: DEFAULT_TITLE,
    short_name: "El Trovador Errante",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#0F172A",
    lang: "es-UY",
    icons: [
      {
        src: "/brand/logotransp.png",
        sizes: "1138x1138",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
