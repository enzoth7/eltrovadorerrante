import { notFound } from 'next/navigation';
import PostEditor, { type EditablePost } from '@/components/admin/PostEditor';
import DeletePostButton from '@/components/admin/DeletePostButton';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Editar escrito', robots: { index: false, follow: false } };

export default async function EditPostPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const supabase = await createClient();
  const { data } = await supabase.from('posts').select('id, title, slug, description, content, category, tags, cover_image, featured, status, published_at').eq('id', id).maybeSingle();
  if (!data) notFound();
  const post = data as EditablePost;

  return (
    <>
      <PostEditor post={post} error={error} />
      <div className="mx-auto max-w-7xl px-6 pb-16 sm:px-8"><div className="border-t border-black pt-7"><DeletePostButton id={id} slug={post.slug ?? ''} /></div></div>
    </>
  );
}
