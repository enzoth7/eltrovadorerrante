"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Inicio", href: "/" },
  { name: "Escritos", href: "/escritos" },
  { name: "Viajes", href: "/viajes" },
  { name: "Podcast", href: "/podcast" },
  { name: "Mi historia", href: "/sobre" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[62px] bg-white">
      <nav className="flex h-full items-center justify-between px-5 sm:px-8 lg:px-[42px]" aria-label="Navegación principal">
        <Link href="/" className="inline-flex shrink-0" aria-label="El Trovador Errante, inicio">
          <Image src="/brand/logotransp.png" alt="" width={43} height={43} priority className="size-[43px] object-contain" />
        </Link>
        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={`py-2 text-xs font-normal uppercase tracking-normal transition-opacity hover:opacity-55 ${active ? "text-black" : "text-black"}`}>{link.name}</Link>;
          })}
        </div>
        <button type="button" onClick={() => setIsOpen((value) => !value)} className="grid h-11 w-11 place-items-center rounded-full border border-black/20 text-black lg:hidden" aria-expanded={isOpen} aria-controls="mobile-menu" aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">{isOpen ? <path d="M5 5l14 14M19 5 5 19" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
        </button>
      </nav>
      <div id="mobile-menu" className={`fixed inset-x-0 top-[62px] h-[calc(100dvh-62px)] bg-white px-6 py-8 transition-all duration-200 lg:hidden ${isOpen ? "visible opacity-100" : "invisible opacity-0"}`}>
        <div className="flex flex-col">
          {navLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="flex min-h-20 items-center text-4xl font-bold uppercase tracking-[-0.05em] text-blue">{link.name}</Link>)}
        </div>
      </div>
    </header>
  );
}
