import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { importLocalPostsAction } from '../actions';

type AdminPost = { id: string; slug: string; title: string; status: 'draft' | 'published'; category: string; updated_at: string };

export const metadata = { title: 'Mesa editorial', robots: { index: false, follow: false } };

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ mensaje?: string; error?: string }> }) {
  const { mensaje, error: queryError } = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase.from('posts').select('id, slug, title, status, category, updated_at').order('updated_at', { ascending: false });
  const posts = (data ?? []) as AdminPost[];
  const databaseReady = !error;

  return (
    <main className="px-6 py-14 sm:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-8 border-b border-black pb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/55">Archivo privado</p>
            <h1 className="mt-3 text-5xl font-bold uppercase leading-none tracking-[-0.045em] text-blue md:text-7xl">Tus escritos</h1>
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
          <>
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
            <form action={importLocalPostsAction} className="mt-14 border-t border-black pt-8">
              <p className="mb-5 max-w-xl text-sm leading-relaxed text-black/65">Podés copiar al panel los tres escritos que hoy viven como archivos en el proyecto. Si ya existen, se actualizan sin duplicarse.</p>
              <button type="submit" className="border border-blue px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-blue hover:bg-blue hover:text-white">Importar escritos actuales</button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
