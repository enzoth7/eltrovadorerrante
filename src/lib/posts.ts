import { createClient } from '@supabase/supabase-js';
import { getAllPosts as getAllLocalPosts, getPostBySlug as getLocalPostBySlug } from './mdx';
import { hasSupabaseConfig, SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from './supabase/config';
import { VSCO_IMAGES } from './images';
import type { Category, Post } from './types';

const categoryImages: Record<string, string> = {
  viajes: VSCO_IMAGES.coast,
  libros: VSCO_IMAGES.postcards,
  arte: VSCO_IMAGES.hercules,
  historia: VSCO_IMAGES.armillary,
  reflexiones: VSCO_IMAGES.statue,
  peliculas: VSCO_IMAGES.night,
};

const postImages: Record<string, string> = {
  "por-que-leemos": VSCO_IMAGES.postcards,
  "perdido-en-roma": VSCO_IMAGES.hercules,
  "paris-y-el-conde-de-montecristo": VSCO_IMAGES.night,
};

export function resolvePostImage(post: { slug?: string; category?: string; coverImage?: string | null }): string {
  return post.coverImage || (post.slug && postImages[post.slug]) || (post.category && categoryImages[post.category.toLowerCase()]) || VSCO_IMAGES.coast;
}

type PostRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: Category;
  tags: string[] | null;
  cover_image: string | null;
  featured: boolean;
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

function toPost(row: PostRow): Post {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    content: row.content,
    category: row.category,
    tags: row.tags ?? [],
    coverImage: row.cover_image ?? undefined,
    featured: row.featured,
    status: row.status,
    date: (row.published_at ?? row.created_at).slice(0, 10),
    updatedAt: row.updated_at,
  };
}

function publicClient() {
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, next: { revalidate: 60, tags: ['posts'] } }),
    },
  });
}

async function getRemotePosts(): Promise<Post[]> {
  if (!hasSupabaseConfig()) return [];
  try {
    const { data, error } = await publicClient()
      .from('posts')
      .select('id, slug, title, description, content, category, tags, cover_image, featured, status, published_at, created_at, updated_at')
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false });
    if (error) {
      console.error('Error fetching Supabase posts:', error);
      return [];
    }
    return (data as PostRow[]).map(toPost);
  } catch (err) {
    console.error('Unexpected error fetching Supabase posts:', err);
    return [];
  }
}

export async function getAllPosts(): Promise<Post[]> {
  if (hasSupabaseConfig()) {
    const remotePosts = await getRemotePosts();
    return remotePosts.sort((a, b) => b.date.localeCompare(a.date));
  }
  return getAllLocalPosts().sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (hasSupabaseConfig()) {
    try {
      const { data, error } = await publicClient()
        .from('posts')
        .select('id, slug, title, description, content, category, tags, cover_image, featured, status, published_at, created_at, updated_at')
        .eq('slug', slug)
        .eq('status', 'published')
        .lte('published_at', new Date().toISOString())
        .maybeSingle();
      if (error) {
        console.error(`Error fetching post by slug "${slug}":`, error);
        return null;
      }
      return data ? toPost(data as PostRow) : null;
    } catch (err) {
      console.error(`Unexpected error fetching post by slug "${slug}":`, err);
      return null;
    }
  }

  try {
    return getLocalPostBySlug(slug);
  } catch {
    return null;
  }
}

