import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

type AdminPost = { id: string; slug: string; title: string; status: 'draft' | 'published'; category: string; updated_at: string };

export const metadata = { title: 'Mesa editorial', robots: { index: false, follow: false } };

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ mensaje?: string; error?: string }> }) {
  const { mensaje, error: queryError } = await searchParams;
  const supabase = await createClient();

  // Auto-corrección: si hay escritos marcados como 'published' con fecha futura (por el desfase horario anterior),
  // ajustarlos automáticamente para que queden visibles de inmediato para el público.
  try {
    const { data: futurePosts } = await supabase
      .from('posts')
      .select('id, slug')
      .eq('status', 'published')
      .gt('published_at', new Date().toISOString());

    if (futurePosts && futurePosts.length > 0) {
      await supabase
        .from('posts')
        .update({ published_at: new Date().toISOString() })
        .in('id', futurePosts.map((p) => p.id));

      revalidatePath('/');
      revalidatePath('/escritos');
      for (const post of futurePosts) {
        revalidatePath(`/escritos/${post.slug}`);
      }
    }
  } catch (healError) {
    console.error('Error auto-healing future published posts:', healError);
  }

  const { data, error } = await supabase.from('posts').select('id, slug, title, status, category, updated_at').order('updated_at', { ascending: false });
  const posts = (data ?? []) as AdminPost[];
  const databaseReady = !error;

  return (
    <main className="px-6 py-14 sm:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-8 border-b border-black pb-10">
          <div>
            <h1 className="text-5xl font-bold uppercase leading-none tracking-[-0.045em] text-blue md:text-7xl">Tus escritos</h1>
          </div>
          <Link className="bg-blue px-7 py-4 text-xs font-bold uppercase tracking-[0.13em] text-white hover:bg-black" href="/admin/escritos/nuevo">Crear escrito</Link>
        </div>

        {(mensaje || queryError) && <p className="mt-8 border-l-2 border-blue pl-4" role={queryError ? 'alert' : 'status'}>{queryError ?? mensaje}</p>}

        {!databaseReady ? (
          <section className="mt-12 max-w-3xl border border-black p-7 sm:p-10">
            <h2 className="text-2xl font-bold uppercase text-blue">Falta activar la base de datos</h2>
            <p className="mt-4 font-article text-lg leading-relaxed">El panel ya está construido. Ejecutá la migración incluida en el proyecto desde Supabase y creá tu usuario privado para empezar a publicar.</p>
          </section>
        ) : (
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <thead><tr className="border-b border-black text-xs font-semibold uppercase tracking-[0.12em]"><th className="py-4 pr-6">Título</th><th className="px-6 py-4">Estado</th><th className="px-6 py-4">Tema</th><th className="py-4 pl-6 text-right">Editar</th></tr></thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-black/20">
                    <td className="py-6 pr-6"><span className="block text-xl font-bold text-blue">{post.title}</span><span className="mt-1 block text-xs text-black/50">Actualizado {new Date(post.updated_at).toLocaleDateString('es-UY')}</span></td>
                    <td className="px-6 py-6 text-xs font-semibold uppercase tracking-[0.1em]">{post.status === 'published' ? 'Publicado' : 'Borrador'}</td>
                    <td className="px-6 py-6 text-xs uppercase">{post.category}</td>
                    <td className="py-6 pl-6 text-right"><Link className="text-xs font-bold uppercase tracking-[0.1em] underline underline-offset-4" href={`/admin/escritos/${post.id}/editar`}>Abrir</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {posts.length === 0 && <p className="py-16 font-article text-xl">Todavía no hay escritos en el panel.</p>}
          </div>
        )}

        <section className="mt-20 border-t border-black pt-10">
          <div className="flex flex-wrap items-end justify-between gap-7">
            <div>
              <h2 className="text-4xl font-bold leading-none tracking-[-0.035em] text-blue md:text-5xl">Países y lugares</h2>
              <p className="mt-4 max-w-2xl font-article text-lg leading-relaxed text-black/65">
                Escribí o corregí la descripción que acompaña cada país y cada ciudad en la web.
              </p>
            </div>
            <Link className="bg-blue px-7 py-4 text-xs font-bold uppercase tracking-[0.13em] text-white hover:bg-black" href="/admin/lugares">
              Editar lugares
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
