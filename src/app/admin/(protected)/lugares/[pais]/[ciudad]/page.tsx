import { notFound } from 'next/navigation';
import LocationEditor from '@/components/admin/LocationEditor';
import { createClient } from '@/lib/supabase/server';
import { findPlace } from '@/lib/places';
import { locationContentKey } from '@/lib/location-content';

export const metadata = { title: 'Editar lugar', robots: { index: false, follow: false } };

export default async function EditPlacePage({
  params,
  searchParams,
}: {
  params: Promise<{ pais: string; ciudad: string }>;
  searchParams: Promise<{ error?: string; mensaje?: string }>;
}) {
  const { pais, ciudad } = await params;
  const { error, mensaje } = await searchParams;
  const place = findPlace(pais, ciudad);
  if (!place) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from('location_content')
    .select('description')
    .eq('content_key', locationContentKey(pais, ciudad))
    .maybeSingle();

  return (
    <LocationEditor
      countrySlug={pais}
      countryName={place.country}
      placeSlug={ciudad}
      placeName={place.place}
      description={data?.description ?? ''}
      error={error}
      mensaje={mensaje}
    />
  );
}
