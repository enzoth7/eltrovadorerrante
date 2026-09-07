export const LIVED_PLACES = [
  {
    place: "Paysandú",
    country: "Uruguay",
    period: "1998–2021 · 2023 · desde 2024",
    note: "La raíz y el punto de regreso. El ritmo del litoral, la cercanía del río y una identidad construida lejos del ruido de las grandes capitales.",
  },
  {
    place: "Dublin",
    country: "Irlanda",
    period: "2021–2023",
    note: "La primera vida larga en el exterior: otro idioma, otra escala de ciudad y el aprendizaje cotidiano de empezar desde cero.",
  },
  {
    place: "Saint-Gervais-Les-Bains",
    country: "Francia",
    period: "2023",
    note: "Una entrada breve pero decisiva a los Alpes: montaña, pueblos pequeños y una relación nueva con el paisaje.",
  },
  {
    place: "Avoriaz",
    country: "Francia",
    period: "2023–2024",
    note: "Un invierno vivido en altura. La nieve, el snowboard y el tiempo medido por la temporada en lugar del calendario.",
  },
  {
    place: "Nice",
    country: "Francia",
    period: "2024",
    note: "La síntesis mediterránea: mar, historia, arquitectura, caminatas y una forma más luminosa de habitar la ciudad.",
  },
] as const;

export const VISITED_PLACES = [
  { place: "Madrid", country: "España" },
  { place: "Edinburgh", country: "Escocia" },
  { place: "Paris", country: "Francia" },
  { place: "Roma", country: "Italia" },
  { place: "Palma de Mallorca", country: "España" },
  { place: "Ibiza", country: "España" },
  { place: "Barcelona", country: "España" },
  { place: "London", country: "Inglaterra" },
  { place: "Alicante", country: "España" },
  { place: "Valencia", country: "España" },
  { place: "Toledo", country: "España" },
  { place: "Buenos Aires", country: "Argentina" },
  { place: "Annecy", country: "Francia" },
  { place: "Chamonix", country: "Francia" },
  { place: "Genève", country: "Suiza" },
  { place: "Firenze", country: "Italia" },
  { place: "Mónaco", country: "Mónaco" },
  { place: "Murcia", country: "España" },
  { place: "Granada", country: "España" },
  { place: "Piriápolis", country: "Uruguay" },
  { place: "Alcúdia", country: "España" },
  { place: "Vaticano", country: "Vaticano" },
  { place: "Sant Elm", country: "España" },
  { place: "Cala Saladeta", country: "España" },
  { place: "S'Arenal", country: "España" },
  { place: "Punta Ballena", country: "Uruguay" },
  { place: "Punta del Diablo", country: "Uruguay" },
  { place: "Montevideo", country: "Uruguay" },
  { place: "Barra del Chuy", country: "Uruguay" },
  { place: "Atlántida", country: "Uruguay" },
  { place: "Manantiales", country: "Uruguay" },
  { place: "Magaluf", country: "España" },
  { place: "Ribarroja de Turia", country: "España" },
  { place: "Lyon", country: "Francia" },
  { place: "La Paloma", country: "Uruguay" },
  { place: "La Pedrera", country: "Uruguay" },
  { place: "Chuí", country: "Uruguay" },
  { place: "Punta del Este", country: "Uruguay" },
  { place: "Meseta de Artigas", country: "Uruguay" },
  { place: "Casapueblo", country: "Uruguay" },
  { place: "Cabo Polonio", country: "Uruguay" },
  { place: "Pan de Azúcar", country: "Uruguay" },
  { place: "José Ignacio", country: "Uruguay" },                     
  { place: "Howth", country: "Irlanda" },
  { place: "Bray", country: "Irlanda" },
  { place: "Es Colomer", country: "España" },
  { place: "Cabo Cocinillo", country: "España" },
  { place: "Benidorm", country: "España" },
  { place: "Burrow Beach", country: "Irlanda" },
  { place: "Dun Laoghaire", country: "Irlanda" },
  { place: "Colón", country: "Argentina" },
  { place: "Altea", country: "España" },
  { place: "Èze", country: "Francia" },
  { place: "Villefranche-sur-mer", country: "Francia" },
  { place: "Saint-Jean-Cap-Ferrat", country: "Francia" },
] as const;

export type PlaceEntry = (typeof LIVED_PLACES)[number] | (typeof VISITED_PLACES)[number];

export function slugifyPlace(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getAllPlaces(): PlaceEntry[] {
  return [...LIVED_PLACES, ...VISITED_PLACES];
}

export function findCountry(countrySlug: string) {
  const place = getAllPlaces().find((entry) => slugifyPlace(entry.country) === countrySlug);
  return place?.country ?? null;
}

export function findPlace(countrySlug: string, placeSlug: string) {
  return getAllPlaces().find(
    (entry) => slugifyPlace(entry.country) === countrySlug && slugifyPlace(entry.place) === placeSlug,
  ) ?? null;
}
