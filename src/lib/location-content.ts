import { createClient } from '@supabase/supabase-js';
import { hasSupabaseConfig, SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from './supabase/config';

export type LocationContent = {
  content_key: string;
  country_slug: string;
  place_slug: string | null;
  country_name: string;
  place_name: string | null;
  description: string;
  updated_at: string;
};

function publicClient() {
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }) },
  });
}

export function locationContentKey(countrySlug: string, placeSlug?: string | null) {
  return placeSlug ? `place:${countrySlug}:${placeSlug}` : `country:${countrySlug}`;
}

export async function getLocationContent(countrySlug: string, placeSlug?: string | null) {
  if (!hasSupabaseConfig()) return null;

  try {
    const { data, error } = await publicClient()
      .from('location_content')
      .select('content_key, country_slug, place_slug, country_name, place_name, description, updated_at')
      .eq('content_key', locationContentKey(countrySlug, placeSlug))
      .maybeSingle();

    if (error || !data) return null;
    return data as LocationContent;
  } catch {
    return null;
  }
}
