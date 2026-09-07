import Link from 'next/link';
import { savePostAction } from '@/app/admin/actions';
import type { Category } from '@/lib/types';

export type EditablePost = {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
  category?: Category;
  tags?: string[];
  cover_image?: string | null;
  featured?: boolean;
  status?: 'draft' | 'published';
  published_at?: string | null;
};

const categories: { value: Category; label: string }[] = [
  { value: 'viajes', label: 'Viajes' },
  { value: 'libros', label: 'Libros' },
  { value: 'arte', label: 'Arte' },
  { value: 'historia', label: 'Historia' },
  { value: 'peliculas', label: 'Películas' },
  { value: 'reflexiones', label: 'Reflexiones' },
];

const inputClass = 'mt-2 min-h-12 w-full border border-black bg-white px-4 py-3 text-base outline-none focus:ring-2 focus:ring-blue';
const labelClass = 'block text-xs font-semibold uppercase tracking-[0.12em] text-black/65';

export default function PostEditor({ post = {}, error }: { post?: EditablePost; error?: string }) {
  const publicationDate = post.published_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10);

  return (
    <main className="px-6 py-12 sm:px-8 md:py-16">
      <form action={savePostAction} className="mx-auto max-w-7xl">
        <input type="hidden" name="id" value={post.id ?? ''} />
        <input type="hidden" name="currentCoverImage" value={post.cover_image ?? ''} />
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-black pb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/55">{post.id ? 'Editar escrito' : 'Nuevo escrito'}</p>
            <h1 className="mt-3 text-5xl font-bold uppercase leading-none tracking-[-0.045em] text-blue md:text-7xl">{post.id ? 'Revisar' : 'Escribir'}</h1>
          </div>
          <Link href="/admin" className="text-xs font-bold uppercase tracking-[0.12em] underline underline-offset-4">Volver al archivo</Link>
        </div>

        {error && <p role="alert" className="mt-8 border-l-2 border-blue pl-4">{error}</p>}

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            <label className={labelClass} htmlFor="title">Título</label>
            <input className={`${inputClass} text-2xl font-bold`} id="title" name="title" defaultValue={post.title} required />

            <label className={`${labelClass} mt-7`} htmlFor="description">Descripción breve</label>
            <textarea className={`${inputClass} min-h-28 resize-y font-article text-lg`} id="description" name="description" defaultValue={post.description} maxLength={300} required />

            <label className={`${labelClass} mt-7`} htmlFor="content">Texto</label>
            <p className="mt-2 text-sm text-black/55">Podés usar títulos con ##, cursivas con *texto* y listas con guiones.</p>
            <textarea className={`${inputClass} min-h-[34rem] resize-y font-article text-lg leading-relaxed`} id="content" name="content" defaultValue={post.content} required />
          </div>

          <aside className="space-y-7 lg:border-l lg:border-black lg:pl-8">
            <div>
              <label className={labelClass} htmlFor="category">Tema</label>
              <select className={inputClass} id="category" name="category" defaultValue={post.category ?? 'reflexiones'}>
                {categories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="publicationDate">Fecha de publicación</label>
              <input className={inputClass} id="publicationDate" name="publicationDate" type="date" defaultValue={publicationDate} required />
              <p className="mt-2 text-xs leading-relaxed text-black/50">Esta fecha aparecerá en la página del escrito.</p>
            </div>
            <div>
              <label className={labelClass} htmlFor="slug">Enlace</label>
              <input className={inputClass} id="slug" name="slug" defaultValue={post.slug} placeholder="Se crea desde el título" />
              <p className="mt-2 text-xs leading-relaxed text-black/50">Sólo palabras y guiones. Conviene no cambiarlo después de publicar.</p>
            </div>
            <div>
              <label className={labelClass} htmlFor="tags">Etiquetas</label>
              <input className={inputClass} id="tags" name="tags" defaultValue={post.tags?.join(', ')} placeholder="viaje, literatura, roma" />
            </div>
            <div>
              <label className={labelClass} htmlFor="coverImage">Imagen de portada</label>
              <input className="mt-3 block w-full text-sm file:mr-4 file:border file:border-blue file:bg-white file:px-4 file:py-3 file:text-xs file:font-bold file:uppercase file:tracking-[0.1em] file:text-blue" id="coverImage" name="coverImage" type="file" accept="image/jpeg,image/png,image/webp,image/gif" />
              <p className="mt-3 text-xs leading-relaxed text-black/50">JPG, PNG, WEBP o GIF. Máximo 6 MB.</p>
              {post.cover_image && <p className="mt-2 text-xs font-semibold text-blue">Este escrito ya tiene una imagen. Elegí otra sólo si querés reemplazarla.</p>}
            </div>
            <label className="flex min-h-12 items-center gap-3 border border-black px-4 text-sm" htmlFor="featured">
              <input id="featured" name="featured" type="checkbox" defaultChecked={post.featured} />
              Destacar este escrito
            </label>
            <div className="grid gap-3 pt-3">
              <button type="submit" name="publication" value="published" className="min-h-12 bg-blue px-5 text-xs font-bold uppercase tracking-[0.13em] text-white hover:bg-black">{post.status === 'published' ? 'Guardar publicado' : 'Publicar'}</button>
              <button type="submit" name="publication" value="draft" className="min-h-12 border border-blue px-5 text-xs font-bold uppercase tracking-[0.13em] text-blue hover:bg-blue hover:text-white">Guardar borrador</button>
            </div>
          </aside>
        </div>
      </form>
    </main>
  );
}
