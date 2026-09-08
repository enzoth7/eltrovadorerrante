'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getAllPosts as getLocalPosts } from '@/lib/mdx';
import { findCountry, findPlace } from '@/lib/places';
import { locationContentKey } from '@/lib/location-content';
import type { Category } from '@/lib/types';

const categories: Category[] = ['viajes', 'libros', 'arte', 'historia', 'peliculas', 'reflexiones'];

function messageUrl(path: string, key: 'error' | 'mensaje', message: string) {
  return `${path}?${key}=${encodeURIComponent(message)}`;
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function authenticatedClient() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  if (!email || !password) redirect(messageUrl('/admin/login', 'error', 'Ingresá tu correo y contraseña.'));

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(messageUrl('/admin/login', 'error', 'No pudimos iniciar sesión. Revisá los datos.'));
  redirect('/admin');
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

function resolvePublishedAt(publicationDate: string, status: 'draft' | 'published'): string {
  if (status !== 'published') {
    return `${publicationDate}T00:00:00.000Z`;
  }

  const now = new Date();
  const candidateMidnight = new Date(`${publicationDate}T00:00:00.000Z`);
  const diffHours = (candidateMidnight.getTime() - now.getTime()) / (1000 * 60 * 60);

  // Si la fecha elegida está a más de 24 horas en el futuro, se respeta como programada
  if (diffHours > 24) {
    return `${publicationDate}T00:00:00.000Z`;
  }

  // Si la medianoche UTC ya pasó (caso normal para Uruguay todo el día)
  if (candidateMidnight <= now) {
    return `${publicationDate}T00:00:00.000Z`;
  }

  // Si por diferencia de huso horario queda levemente en el futuro (<= 24h), fijar al momento actual
  // para que Supabase RLS (published_at <= now()) y la query de Next.js no lo bloqueen
  return now.toISOString();
}

export async function savePostAction(formData: FormData) {
  const { supabase, user } = await authenticatedClient();
  if (!user) redirect('/admin/login');

  const id = String(formData.get('id') ?? '').trim();
  const title = String(formData.get('title') ?? '').trim();
  const requestedSlug = String(formData.get('slug') ?? '').trim();
  const slug = slugify(requestedSlug || title);
  const description = String(formData.get('description') ?? '').trim();
  const content = String(formData.get('content') ?? '').trim();
  const category = String(formData.get('category') ?? '') as Category;
  const publicationDate = String(formData.get('publicationDate') ?? '').trim();
  const status = formData.get('publication') === 'published' ? 'published' : 'draft';
  const featured = formData.get('featured') === 'on';
  const tags = String(formData.get('tags') ?? '').split(',').map((tag) => tag.trim().toLowerCase()).filter(Boolean);
  const editorPath = id ? `/admin/escritos/${id}/editar` : '/admin/escritos/nuevo';

  if (!title || !slug || !description || !content || !categories.includes(category) || !/^\d{4}-\d{2}-\d{2}$/.test(publicationDate)) {
    redirect(messageUrl(editorPath, 'error', 'Completá título, descripción, tema, fecha y texto.'));
  }

  let coverImage = String(formData.get('currentCoverImage') ?? '').trim() || null;
  const file = formData.get('coverImage');
  if (file instanceof File && file.size > 0) {
    if (file.size > 6 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      redirect(messageUrl(editorPath, 'error', 'La imagen debe ser JPG, PNG, WEBP o GIF y pesar menos de 6 MB.'));
    }
    const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const storagePath = `${user.id}/${Date.now()}-${slug}.${extension}`;
    const { error: uploadError } = await supabase.storage.from('post-images').upload(storagePath, file, { contentType: file.type, upsert: false });
    if (uploadError) redirect(messageUrl(editorPath, 'error', 'No se pudo subir la imagen. Verificá que la migración de Supabase esté aplicada.'));
    coverImage = supabase.storage.from('post-images').getPublicUrl(storagePath).data.publicUrl;
  }

  const payload = {
    slug,
    title,
    description,
    content,
    category,
    tags,
    cover_image: coverImage,
    featured,
    status,
    published_at: resolvePublishedAt(publicationDate, status),
    created_by: user.id,
  };

  const result = id
    ? await supabase.from('posts').update(payload).eq('id', id).eq('created_by', user.id).select('id').single()
    : await supabase.from('posts').insert(payload).select('id').single();

  if (result.error) {
    const message = result.error.code === '23505' ? 'Ya existe un escrito con ese enlace.' : 'No se pudo guardar el escrito.';
    redirect(messageUrl(editorPath, 'error', message));
  }

  revalidatePath('/');
  revalidatePath('/escritos');
  revalidatePath(`/escritos/${slug}`);
  revalidatePath('/sitemap.xml');
  redirect(messageUrl('/admin', 'mensaje', status === 'published' ? 'Escrito publicado.' : 'Borrador guardado.'));
}

export async function deletePostAction(id: string, slug: string) {
  const { supabase, user } = await authenticatedClient();
  if (!user) redirect('/admin/login');
  await supabase.from('posts').delete().eq('id', id).eq('created_by', user.id);
  revalidatePath('/escritos');
  revalidatePath(`/escritos/${slug}`);
  revalidatePath('/sitemap.xml');
  redirect(messageUrl('/admin', 'mensaje', 'Escrito eliminado.'));
}

export async function importLocalPostsAction() {
  const { supabase, user } = await authenticatedClient();
  if (!user) redirect('/admin/login');
  const rows = getLocalPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    content: post.content,
    category: post.category,
    tags: post.tags,
    cover_image: post.coverImage ?? null,
    featured: post.featured ?? false,
    status: 'published',
    published_at: resolvePublishedAt(post.date, 'published'),
    created_by: user.id,
  }));
  const { error } = await supabase.from('posts').upsert(rows, { onConflict: 'slug' });
  if (error) redirect(messageUrl('/admin', 'error', 'No se pudieron importar los escritos. Aplicá primero la migración de Supabase.'));
  revalidatePath('/escritos');
  revalidatePath('/sitemap.xml');
  redirect(messageUrl('/admin', 'mensaje', 'Los escritos actuales ya están en el panel.'));
}

export async function saveLocationContentAction(formData: FormData) {
  const { supabase, user } = await authenticatedClient();
  if (!user) redirect('/admin/login');

  const countrySlug = String(formData.get('countrySlug') ?? '').trim();
  const placeSlug = String(formData.get('placeSlug') ?? '').trim() || null;
  const description = String(formData.get('description') ?? '').trim();
  const editorPath = placeSlug
    ? `/admin/lugares/${countrySlug}/${placeSlug}`
    : `/admin/lugares/${countrySlug}`;

  const place = placeSlug ? findPlace(countrySlug, placeSlug) : null;
  const countryName = place?.country ?? findCountry(countrySlug);
  if (!countryName || (placeSlug && !place)) redirect('/admin/lugares');

  if (description.length > 4000) {
    redirect(messageUrl(editorPath, 'error', 'La descripción no puede superar los 4000 caracteres.'));
  }

  const { error } = await supabase.from('location_content').upsert({
    content_key: locationContentKey(countrySlug, placeSlug),
    country_slug: countrySlug,
    place_slug: placeSlug,
    country_name: countryName,
    place_name: place?.place ?? null,
    description,
    created_by: user.id,
  }, { onConflict: 'content_key' });

  if (error) {
    redirect(messageUrl(editorPath, 'error', 'No se pudo guardar la descripción. Verificá que la nueva migración esté aplicada.'));
  }

  revalidatePath('/admin');
  revalidatePath('/admin/lugares');
  revalidatePath(`/lugares/${countrySlug}`);
  if (placeSlug) revalidatePath(`/lugares/${countrySlug}/${placeSlug}`);
  redirect(messageUrl(editorPath, 'mensaje', 'Descripción guardada.'));
}
