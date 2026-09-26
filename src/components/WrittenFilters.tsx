"use client";

import { useId, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface FilterOption {
  label: string;
  value: string;
}

function filterHref(category: string, year: string) {
  const params = new URLSearchParams();
  if (category) params.set("categoria", category);
  if (year) params.set("anio", year);
  const query = params.toString();
  return query ? `/escritos?${query}` : "/escritos";
}

export default function WrittenFilters({ categories, years, activeCategory, activeYear }: {
  categories: FilterOption[];
  years: string[];
  activeCategory: string;
  activeYear: string;
}) {
  const router = useRouter();
  const categoryId = useId();
  const yearId = useId();
  const [category, setCategory] = useState(activeCategory);
  const [year, setYear] = useState(activeYear);
  const [pending, startTransition] = useTransition();

  function navigate(nextCategory: string, nextYear: string) {
    startTransition(() => router.push(filterHref(nextCategory, nextYear), { scroll: false }));
  }

  return (
    <div className="grid grid-cols-2 gap-3 lg:hidden" aria-busy={pending}>
      <div>
        <label htmlFor={categoryId} className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-black/55">
          Temas
        </label>
        <div>
          <select
            id={categoryId}
            value={category}
            onChange={(event) => {
              const nextCategory = event.target.value;
              setCategory(nextCategory);
              navigate(nextCategory, year);
            }}
            className="min-h-12 w-full border border-blue/25 bg-white px-4 py-3 text-base font-semibold uppercase tracking-[0.08em] text-blue outline-none transition-colors focus-visible:border-blue focus-visible:ring-2 focus-visible:ring-blue/20 disabled:opacity-60"
            disabled={pending}
          >
            {categories.map((option) => <option key={option.label} value={option.value}>{option.label}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor={yearId} className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-black/55">
          Años
        </label>
        <div>
          <select
            id={yearId}
            value={year}
            onChange={(event) => {
              const nextYear = event.target.value;
              setYear(nextYear);
              navigate(category, nextYear);
            }}
            className="min-h-12 w-full border border-blue/25 bg-white px-4 py-3 text-base font-semibold uppercase tracking-[0.08em] text-blue outline-none transition-colors focus-visible:border-blue focus-visible:ring-2 focus-visible:ring-blue/20 disabled:opacity-60"
            disabled={pending}
          >
            <option value="">Todos</option>
            {years.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
