import type { GalleryItem } from "@/components/GalleryGrid";
import { getAllPlaces, slugifyPlace, type PlaceEntry } from "./places";

export type Coordinates = [longitude: number, latitude: number];

export interface MapPlace {
  place: string;
  country: string;
  status: "Viví" | "Visité";
  coordinates: Coordinates;
  image: string;
  alt: string;
}

// Public town/landmark centres, not personal addresses. WGS84 [longitude, latitude].
// The exhaustive record deliberately fails typechecking when a new place is added.
export const PLACE_COORDINATES = {
  "Paysandú": [-58.0800, -32.3214],
  "Dublin": [-6.2603, 53.3498],
  "Saint-Gervais-Les-Bains": [6.7131, 45.8929],
  "Avoriaz": [6.7750, 46.1917],
  "Nice": [7.2620, 43.7102],
  "Madrid": [-3.7038, 40.4168],
  "Edinburgh": [-3.1883, 55.9533],
  "Paris": [2.3522, 48.8566],
  "Roma": [12.4964, 41.9028],
  "Palma de Mallorca": [2.6502, 39.5696],
  "Ibiza": [1.4328, 38.9067],
  "Barcelona": [2.1734, 41.3851],
  "London": [-0.1276, 51.5072],
  "Alicante": [-0.4907, 38.3452],
  "Valencia": [-0.3763, 39.4699],
  "Toledo": [-4.0273, 39.8628],
  "Buenos Aires": [-58.3816, -34.6037],
  "Annecy": [6.1294, 45.8992],
  "Chamonix": [6.8694, 45.9237],
  "Genève": [6.1432, 46.2044],
  "Firenze": [11.2558, 43.7696],
  "Mónaco": [7.4246, 43.7384],
  "Murcia": [-1.1307, 37.9922],
  "Granada": [-3.5986, 37.1773],
  "Piriápolis": [-55.2747, -34.8682],
  "Alcúdia": [3.1214, 39.8533],
  "Vaticano": [12.4534, 41.9029],
  "Sant Elm": [2.3518, 39.5789],
  "Cala Saladeta": [1.2970, 39.0109],
  "S'Arenal": [2.7512, 39.5027],
  "Punta Ballena": [-55.0289, -34.9082],
  "Punta del Diablo": [-53.5384, -34.0458],
  "Montevideo": [-56.1645, -34.9011],
  "Barra del Chuy": [-53.3899, -33.7529],
  "Atlántida": [-55.7595, -34.7719],
  "Manantiales": [-54.8267, -34.9056],
  "Magaluf": [2.5333, 39.5097],
  "Ribarroja de Turia": [-0.5654, 39.5451],
  "Lyon": [4.8357, 45.7640],
  "La Paloma": [-54.1642, -34.6627],
  "La Pedrera": [-54.1258, -34.5936],
  "Chuí": [-53.4594, -33.6911],
  "Punta del Este": [-54.9410, -34.9369],
  "Meseta de Artigas": [-57.9669, -31.6160],
  "Casapueblo": [-55.0285, -34.9084],
  "Cabo Polonio": [-53.7798, -34.4031],
  "Pan de Azúcar": [-55.2358, -34.7782],
  "José Ignacio": [-54.6358, -34.8406],
  "Howth": [-6.0652, 53.3878],
  "Bray": [-6.1111, 53.2028],
  "Es Colomer": [3.1112, 39.9317],
  // Exact public landmark location supplied by Enzo.
  "Cabo Cocinillo": [2.5923257382790865, 39.53217015282313],
  "Benidorm": [-0.1316, 38.5411],
  "Burrow Beach": [-6.1056, 53.3941],
  "Dun Laoghaire": [-6.1359, 53.2944],
  "Colón": [-58.1420, -32.2233],
  "Altea": [-0.0514, 38.5989],
  "Èze": [7.3619, 43.7278],
  "Villefranche-sur-mer": [7.3113, 43.7034],
  "Saint-Jean-Cap-Ferrat": [7.3330, 43.6892],
} satisfies Record<PlaceEntry["place"], Coordinates>;

export function createMapPlaces(gallery: GalleryItem[]): MapPlace[] {
  const firstPhotos = new Map<string, GalleryItem>();
  for (const photo of gallery) {
    const key = slugifyPlace(photo.place);
    if (!firstPhotos.has(key)) firstPhotos.set(key, photo);
  }

  return getAllPlaces().map((entry) => {
    const photo = firstPhotos.get(slugifyPlace(entry.place));
    if (!photo) throw new Error(`Falta la fotografía del mapa: ${entry.place}`);
    return {
      place: entry.place,
      country: entry.country,
      status: "period" in entry ? "Viví" : "Visité",
      coordinates: PLACE_COORDINATES[entry.place],
      image: photo.src,
      alt: photo.alt,
    };
  });
}
