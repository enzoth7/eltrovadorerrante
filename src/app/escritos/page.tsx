import Link from "next/link";
import WrittenArchive from "@/components/WrittenArchive";
import { getAllPosts, resolvePostImage } from "@/lib/posts";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Escritos",
  description: "Crónicas, lecturas y reflexiones de Enzo Thome sobre viajes, libros, historia y cultura.",
  path: "/escritos",
  image: "/images/Nice/vsco_080226%20(5).jpg",
});

export const revalidate = 60;
const categories = [{ label: "Todos", value: "" }, { label: "Viajes", value: "viajes" }, { label: "Libros", value: "libros" }, { label: "Arte", value: "arte" }, { label: "Historia", value: "historia" }, { label: "Reflexiones", value: "reflexiones" }];

function filterHref(category: string, year: string) {
  const params = new URLSearchParams();
  if (category) params.set("categoria", category);
  if (year) params.set("anio", year);
  const query = params.toString();
  return query ? `/escritos?${query}` : "/escritos";
}

export default async function EscritosPage({ searchParams }: { searchParams: Promise<{ categoria?: string; anio?: string }> }) {
  const { categoria = "", anio = "" } = await searchParams;
  const allPosts = await getAllPosts();
  const years = [...new Set(allPosts.map((post) => post.date.slice(0, 4)))];
  const posts = allPosts
    .filter((post) => {
      const matchesCategory = !categoria || post.category.toLowerCase() === categoria.toLowerCase();
      const matchesYear = !anio || post.date.startsWith(anio);
      return matchesCategory && matchesYear;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="bg-white">
      <header className="grid lg:grid-cols-[1.2fr_.8fr]">
        <div className="px-6 pb-14 pt-18 sm:px-8 md:pb-20 md:pt-24">
          <h1 className="text-[clamp(3.8rem,15vw,13rem)] font-bold uppercase leading-[0.78] tracking-[-0.075em] text-blue">Escritos</h1>
        </div>
        <div className="flex items-end px-6 py-10 sm:px-8">
          <div className="font-article max-w-xl text-xl leading-8 text-black/70">Crónicas, lecturas y reflexiones ordenadas por tema y por el momento en que fueron escritas.</div>
        </div>
      </header>

      <section className="pl-6 pr-0 pb-16 sm:pl-8 sm:pr-0 sm:pb-20 md:pb-28 lg:pb-36">
        <div>
          <div className="grid gap-12 lg:grid-cols-[14rem_1fr]">
            
            {/* SIDEBAR FILTROS */}
            <aside className="pb-8 lg:pr-8">
              <nav className="mb-10" aria-label="Filtrar escritos por tema">
                <h3 className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-black/45">Temas</h3>
                <ul className="flex flex-col gap-3">
                  {categories.map((category) => {
                    const active = categoria === category.value;
                    return (
                      <li key={category.label}>
                        <Link href={filterHref(category.value, anio)} aria-current={active ? "page" : undefined} className={`text-xs font-semibold uppercase tracking-[0.13em] ${active ? "text-blue underline underline-offset-4" : "text-black/50 hover:text-black"}`}>{category.label}</Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              <nav aria-label="Filtrar escritos por año">
                <h3 className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-black/45">Años</h3>
                <ul className="flex flex-col gap-3">
                  <li><Link href={filterHref(categoria, "")} aria-current={!anio ? "page" : undefined} className={`text-xs font-semibold uppercase tracking-[0.13em] ${!anio ? "text-blue underline underline-offset-4" : "text-black/50 hover:text-black"}`}>Todos</Link></li>
                  {years.map((year) => (
                    <li key={year}><Link href={filterHref(categoria, year)} aria-current={anio === year ? "page" : undefined} className={`text-xs font-semibold uppercase tracking-[0.13em] ${anio === year ? "text-blue underline underline-offset-4" : "text-black/50 hover:text-black"}`}>{year}</Link></li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* LISTA DE POSTS */}
            <div className="min-w-0">
              {posts.length > 0 ? (
                <WrittenArchive
                  posts={posts.map((post) => ({
                    slug: post.slug,
                    title: post.title,
                    description: post.description,
                    date: post.date,
                    category: post.category,
                    coverImage: resolvePostImage(post),
                  }))}
                />
              ) : (
                <div className="py-20"><h2 className="text-4xl font-bold text-blue">Todavía no hay textos en esta categoría.</h2></div>
              )}
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
}
