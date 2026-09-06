import fs from "fs";
import path from "path";
import { createHash } from "crypto";
import type { GalleryItem } from "@/components/GalleryGrid";

const imagesDirectory = path.join(process.cwd(), "public", "images");
const imageExtensions = new Set([".avif", ".jpeg", ".jpg", ".png", ".webp"]);

const cityNames: Record<string, string> = {};

const imageDescriptions: Record<string, string> = {
  "villefranche-coast": "Costa mediterránea desde la cornisa",
  "nice-postcards": "Álbumes de postales antiguas",
  "nice-night": "La ciudad al anochecer",
  "firenze-armillary": "Instrumento astronómico histórico",
  "firenze-hercules": "Hércules en el patio",
  "firenze-statue": "Escultura clásica",
  "firenze-wine-shop": "Una pequeña enoteca",
};

export function getGalleryItems(): GalleryItem[] {
  if (!fs.existsSync(imagesDirectory)) return [];

  const files = walkImageFiles(imagesDirectory);
  const seenFiles = new Set<string>();

  return files
    .sort((first, second) => second.localeCompare(first, "es"))
    .flatMap((filePath) => {
      const hash = createHash("sha1").update(fs.readFileSync(filePath)).digest("hex");
      if (seenFiles.has(hash)) return [];
      seenFiles.add(hash);

      const relativePath = path.relative(imagesDirectory, filePath);
      const segments = relativePath.split(path.sep);
      const folder = segments.length > 1 ? segments[0] : "Archivo";
      const fileName = segments.at(-1) || relativePath;
      const imageName = path.basename(fileName, path.extname(fileName));
      const place = cityNames[folder] || folder;
      const src = `/images/${segments.map(encodeURIComponent).join("/")}`;

      return [{
        id: relativePath,
        src,
        alt: imageDescriptions[imageName] || `Fotografía de ${place} por Enzo Thome`,
        place,
      }];
    });
}

function walkImageFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) return walkImageFiles(entryPath);
    if (!entry.isFile() || !imageExtensions.has(path.extname(entry.name).toLowerCase())) return [];

    return [entryPath];
  });
}
