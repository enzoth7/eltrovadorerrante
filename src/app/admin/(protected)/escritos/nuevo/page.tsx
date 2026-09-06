import PostEditor from '@/components/admin/PostEditor';

export const metadata = { title: 'Nuevo escrito', robots: { index: false, follow: false } };

export default async function NewPostPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <PostEditor error={error} />;
}

