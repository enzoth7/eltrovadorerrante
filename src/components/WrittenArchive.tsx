"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Category } from "@/lib/types";

export type ArchivePost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: Category;
  coverImage?: string;
};

function postImage(post: ArchivePost) {
  return post.coverImage || "/images/Villefranche-sur-mer/vsco_073026 (3).jpg";
}

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("es-UY", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function WrittenArchive({ posts }: { posts: ArchivePost[] }) {
  const [activeSlug, setActiveSlug] = useState(posts[0]?.slug ?? "");
  const prefersReducedMotion = useReducedMotion();
  const activePost = posts.find((post) => post.slug === activeSlug) ?? posts[0];

  if (!activePost) return null;

  return (
    <section className="relative isolate min-h-[40rem] overflow-hidden bg-blue text-white" aria-label="Archivo de escritos">
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={activePost.slug}
          className="absolute inset-0"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.32, ease: "easeOut" }}
        >
          <Image
            src={postImage(activePost)}
            alt=""
            fill
            sizes="(max-width: 1023px) 100vw, 75vw"
            className="object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-black/45" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 grid min-h-[40rem] lg:grid-cols-[minmax(0,1fr)_minmax(20rem,38%)]">
        <motion.article
          key={activePost.slug}
          className="flex min-h-[34rem] flex-col justify-end px-6 py-10 sm:px-10 sm:py-12 lg:min-h-[40rem] lg:px-12 lg:py-14"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.28, ease: "easeOut" }}
          aria-live="polite"
        >
          <h2 className="max-w-3xl text-[clamp(2.4rem,5vw,5.4rem)] font-bold leading-[0.95] tracking-[-0.045em]">
            {activePost.title}
          </h2>
          <time className="mt-5 text-[0.65rem] font-medium tracking-[0.06em] text-white/90" dateTime={activePost.date}>
            {formatDate(activePost.date)}
          </time>
          <div className="font-article mt-5 max-w-2xl text-base leading-7 text-white/90 sm:text-lg">
            {activePost.description}
          </div>
          <Link
            href={`/escritos/${activePost.slug}`}
            className="mt-8 inline-flex min-h-12 w-fit items-center border-b border-white text-xs font-bold uppercase tracking-[0.14em] text-white transition-opacity duration-200 hover:opacity-70"
          >
            Leer escrito
          </Link>
        </motion.article>

        <aside className="bg-blue/35 p-4 sm:p-6" aria-label="Seleccionar un escrito">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {posts.map((post, index) => {
              const active = post.slug === activePost.slug;

              return (
                <button
                  key={post.slug}
                  type="button"
                  onClick={() => setActiveSlug(post.slug)}
                  aria-pressed={active}
                  aria-label={`Mostrar ${post.title} como escrito principal`}
                  className={`group relative min-h-40 overflow-hidden text-left transition-opacity duration-200 ${active ? "opacity-100" : "opacity-80 hover:opacity-100"}`}
                >
                  <Image
                    src={postImage(post)}
                    alt=""
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 30vw"
                    className="museum-image object-cover transition-transform duration-300 group-hover:scale-[1.015] motion-reduce:transform-none"
                  />
                  <div className={`absolute inset-0 transition-colors duration-200 ${active ? "bg-blue/35" : "bg-black/50"}`} />
                  <div className="relative flex min-h-40 flex-col justify-end p-5">
                    <div className="absolute right-4 top-2 text-5xl font-bold leading-none text-white/80">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="pr-14 text-lg font-bold leading-tight tracking-[-0.025em] text-white">
                      {post.title}
                    </div>
                    <time className="mt-2 text-[0.65rem] font-medium tracking-[0.05em] text-white/85" dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </section>
  );
}
