import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getAllPlaces, slugifyPlace } from '@/lib/places';

type SavedLocation = { content_key: string; description: string };

export const metadata = { title: 'Editar lugares', robots: { index: false, follow: false } };

export default async function AdminPlacesPage() {
  const allPlaces = getAllPlaces();
  const supabase = await createClient();
  const { data } = await supabase.from('location_content').select('content_key, description');
  const saved = new Map(((data ?? []) as SavedLocation[]).map((item) => [item.content_key, item.description.trim()]));

  const countries = Array.from(new Set(allPlaces.map((place) => place.country)))
    .sort((a, b) => a.localeCompare(b, 'es'));

  return (
    <main className="px-6 py-14 sm:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-black pb-9">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/55">Contenido editorial</p>
            <h1 className="mt-3 text-5xl font-bold leading-none tracking-[-0.045em] text-blue md:text-7xl">Lugares</h1>
          </div>
          <Link className="text-xs font-bold uppercase tracking-[0.12em] underline underline-offset-4" href="/admin">Volver a escritos</Link>
        </div>

        <div className="mt-12 grid gap-x-12 gap-y-16 md:grid-cols-2">
          {countries.map((country) => {
            const countrySlug = slugifyPlace(country);
            const countryKey = `country:${countrySlug}`;
            const places = allPlaces
              .filter((place) => place.country === country)
              .sort((a, b) => a.place.localeCompare(b.place, 'es'));

            return (
              <section key={country}>
                <div className="flex items-baseline justify-between gap-5 border-b border-black pb-4">
                  <h2 className="text-3xl font-bold text-blue">{country}</h2>
                  <Link className="shrink-0 text-xs font-bold uppercase tracking-[0.1em] underline underline-offset-4" href={`/admin/lugares/${countrySlug}`}>
                    {saved.get(countryKey) ? 'Editar país' : 'Describir país'}
                  </Link>
                </div>
                <ul className="divide-y divide-black/20">
                  {places.map((place) => {
                    const placeSlug = slugifyPlace(place.place);
                    const placeKey = `place:${countrySlug}:${placeSlug}`;
                    return (
                      <li key={place.place}>
                        <Link className="flex min-h-14 items-center justify-between gap-4 py-3 hover:text-blue" href={`/admin/lugares/${countrySlug}/${placeSlug}`}>
                          <span className="text-lg">{place.place}</span>
                          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-black/45">
                            {saved.get(placeKey) ? 'Con descripción' : 'Sin descripción'}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
