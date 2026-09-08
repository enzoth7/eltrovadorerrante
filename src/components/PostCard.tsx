import Image from "next/image";
import Link from "next/link";
import { resolvePostImage } from "@/lib/posts";

interface PostCardProps {
  title: string;
  slug: string;
  description: string;
  date: string;
  category: string;
  coverImage?: string;
  featured?: boolean;
}

export default function PostCard({ title, slug, description, date, category, coverImage, featured = false }: PostCardProps) {
  const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString("es-UY", { day: "numeric", month: "long", year: "numeric" });
  const image = resolvePostImage({ slug, category, coverImage });

  return (
    <article className={`group flex flex-col ${featured ? "md:flex-row" : ""}`}>
      <Link href={`/escritos/${slug}`} className={`relative block overflow-hidden bg-blue ${featured ? "w-full md:w-[58%]" : "w-full"}`} tabIndex={-1} aria-hidden="true">
        <Image src={image} alt="" width={0} height={0} sizes="100vw" style={{ width: '100%', height: 'auto' }} className="museum-image transition-transform duration-500 group-hover:scale-[1.02]" />
      </Link>
      <div className={`flex flex-col flex-1 ${featured ? "justify-center p-7 sm:p-12" : "py-6"}`}>
        <div className="mb-6 flex items-center justify-between gap-4 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-black/55">
          <div>{category}</div>
          <time dateTime={date}>{formattedDate}</time>
        </div>
        <h3 className={`font-bold leading-[0.95] tracking-[-0.05em] text-blue ${featured ? "text-5xl sm:text-7xl" : "text-3xl"}`}><Link href={`/escritos/${slug}`} className="hover:underline">{title}</Link></h3>
        <div className="mt-5 max-w-xl text-sm leading-7 text-black/65">{description}</div>
        <Link href={`/escritos/${slug}`} className="mt-7 inline-flex self-start border-b border-blue pb-1 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-blue">Leer</Link>
      </div>
    </article>
  );
}
