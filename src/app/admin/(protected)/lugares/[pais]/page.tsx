import { notFound } from 'next/navigation';
import LocationEditor from '@/components/admin/LocationEditor';
import { createClient } from '@/lib/supabase/server';
import { findCountry } from '@/lib/places';
import { locationContentKey } from '@/lib/location-content';

export const metadata = { title: 'Editar país', robots: { index: false, follow: false } };

export default async function EditCountryPage({
  params,
  searchParams,
}: {
  params: Promise<{ pais: string }>;
  searchParams: Promise<{ error?: string; mensaje?: string }>;
}) {
  const { pais } = await params;
  const { error, mensaje } = await searchParams;
  const countryName = findCountry(pais);
  if (!countryName) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from('location_content')
    .select('description')
    .eq('content_key', locationContentKey(pais))
    .maybeSingle();

  return (
    <LocationEditor
      countrySlug={pais}
      countryName={countryName}
      description={data?.description ?? ''}
      error={error}
      mensaje={mensaje}
    />
  );
}
