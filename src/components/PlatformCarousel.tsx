"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface Platform {
  id: string;
  name: string;
  tagline: string;
  url: string;
  icon: string;
  color: string;
}

const platforms: Platform[] = [
  {
    id: "goodreads",
    name: "Goodreads Personal",
    tagline: "El canon, reseñas y los libros que marcan el rumbo",
    url: "https://www.goodreads.com",
    icon: "/icons/goodreads.svg",
    color: "#E9E5CD",
  },
  {
    id: "pinterest",
    name: "Pinterest Personal",
    tagline: "Tableros visuales, arquitectura, diseño y estética clásica",
    url: "https://www.pinterest.com",
    icon: "/icons/pinterest.svg",
    color: "#E60023",
  },
  {
    id: "vsco",
    name: "VSCO Personal",
    tagline: "Fotografía analógica, grano, luz y momentos en crudo",
    url: "https://vsco.co",
    icon: "/icons/vsco.svg",
    color: "#FFFFFF",
  },
  {
    id: "instagram",
    name: "Instagram Personal",
    tagline: "Diario fotográfico cotidiano y fragmentos del camino",
    url: "https://www.instagram.com",
    icon: "/icons/instagram.svg",
    color: "#E1306C",
  },
  {
    id: "tiktok",
    name: "TikTok del Trovador Errante",
    tagline: "Reflexiones en video, viajes, historia y anécdotas",
    url: "https://www.tiktok.com/@eltrovadorerrante7",
    icon: "/icons/tiktok.svg",
    color: "#00F2FE",
  },
  {
    id: "spotify",
    name: "Spotify del Trovador Errante",
    tagline: "El podcast mensual: pensamiento, historia y catarsis",
    url: "https://open.spotify.com/show/5FZAP7k9Z1w2d5atm4vJfb?si=52a6d87e38de4459",
    icon: "/icons/spotify.svg",
    color: "#1DB954",
  },
];

export default function PlatformCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth * 0.75;
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full">
      {/* Navigation Buttons */}
      <div className="flex justify-end gap-3 mb-6">
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className="w-10 h-10 rounded-full border border-[#C5A059]/30 flex items-center justify-center text-[#FAF8F5] hover:border-[#C5A059] hover:text-[#C5A059] disabled:opacity-30 disabled:hover:border-[#C5A059]/30 disabled:hover:text-[#FAF8F5] transition-all duration-300"
          aria-label="Anterior"
        >
          Anterior
        </button>
        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className="w-10 h-10 rounded-full border border-[#C5A059]/30 flex items-center justify-center text-[#FAF8F5] hover:border-[#C5A059] hover:text-[#C5A059] disabled:opacity-30 disabled:hover:border-[#C5A059]/30 disabled:hover:text-[#FAF8F5] transition-all duration-300"
          aria-label="Siguiente"
        >
          Siguiente
        </button>
      </div>

      {/* Carousel Track */}
      <div
        ref={containerRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {platforms.map((platform) => (
          <a
            key={platform.id}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex-none w-[280px] sm:w-[320px] snap-start p-8 rounded-sm bg-[#141820] border border-[#C5A059]/20 hover:border-[#C5A059] transition-all duration-500 flex flex-col justify-between hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#C5A059]/10"
          >
            <div>
              {/* Platform SVG Icon */}
              <div className="w-14 h-14 rounded-full border border-white/10 bg-[#0A0C10] p-3 mb-6 flex items-center justify-center group-hover:border-[#C5A059] group-hover:scale-110 transition-all duration-300">
                <div className="w-7 h-7 relative text-[#FAF8F5] group-hover:text-[#C5A059] transition-colors">
                  <Image
                    src={platform.icon}
                    alt={platform.name}
                    width={28}
                    height={28}
                    className="w-full h-full object-contain filter invert opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>

              {/* Title & Tagline */}
              <h4 className="font-heading text-xl text-[#FAF8F5] mb-2 group-hover:text-[#C5A059] transition-colors font-normal">
                {platform.name}
              </h4>
              <p className="font-body text-xs text-[#FAF8F5]/60 leading-relaxed font-light">
                {platform.tagline}
              </p>
            </div>

            {/* Link CTA */}
            <div className="pt-6 border-t border-white/5 flex items-center justify-between text-xs font-body tracking-[0.2em] uppercase text-[#C5A059] group-hover:text-[#FAF8F5] transition-colors">
              <div>Visitar Perfil</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
