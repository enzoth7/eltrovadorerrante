"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { VSCO_IMAGES } from "@/lib/images";

const geoUrl = "/world-50m.json";

export interface CountryData {
  id: string;
  name: string;
  flagCode: string;
  review?: string;
  image?: string;
}

const visitedCountriesData: Record<string, CountryData> = {
  "858": { id: "858", name: "Uruguay", flagCode: "uy", review: "La raíz y el punto de regreso. El ritmo del litoral, la cercanía del río y una identidad construida lejos del ruido de las grandes capitales.", image: "/assets/uruguay.jpg" },
  "372": { id: "372", name: "Irlanda", flagCode: "ie", review: "La primera vida larga en el exterior: otro idioma, otra escala de ciudad y el aprendizaje cotidiano de empezar desde cero.", image: "/assets/irlanda.jpg" },
  "250": { id: "250", name: "Francia", flagCode: "fr", review: "La síntesis mediterránea: mar, historia, arquitectura, caminatas y una forma más luminosa de habitar la ciudad.", image: "/assets/francia.jpg" },
  "724": { id: "724", name: "España", flagCode: "es", review: "Ciudades, islas y costas recorridas entre historia, arquitectura y distintas formas de vida mediterránea.", image: "/assets/españa1.jpg" },
  "826": { id: "826", name: "Reino Unido", flagCode: "gb", image: "/assets/reino unido.jpg" },
  "380": { id: "380", name: "Italia", flagCode: "it", image: "/assets/italia.jpg" },
  "032": { id: "032", name: "Argentina", flagCode: "ar", image: "/assets/argentina.jpg" },
  "756": { id: "756", name: "Suiza", flagCode: "ch", image: "/assets/suiza.jpg" },
  "076": { id: "076", name: "Brasil", flagCode: "br", image: "/assets/brasil1.jpg" },
  "492": { id: "492", name: "Mónaco", flagCode: "mc", review: "Un territorio mínimo y vertical, comprimido entre la roca, el Mediterráneo y una arquitectura de otra escala.", image: "/assets/monaco.jpg" },
  "336": { id: "336", name: "Ciudad del Vaticano", flagCode: "va", image: "/assets/vaticano.jpg" },
};


export default function InteractiveMap({ countryDescriptions = {} }: { countryDescriptions?: Record<string, string> }) {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);

  const handleFlagClick = (flagCode: string) => {
    const countryInfo = Object.values(visitedCountriesData).find(c => c.flagCode === flagCode);
    if (countryInfo) {
      setSelectedCountry(countryInfo);
    }
  };

  const description = selectedCountry ? countryDescriptions[selectedCountry.name] || selectedCountry.review : null;

  return (
    <div className="flex flex-col lg:flex-row w-full min-h-[750px] bg-white">
      
      {/* LEFT PANEL - STATIC COLUMN */}
      <div className="w-full lg:w-[420px] xl:w-[480px] shrink-0 flex flex-col p-8 lg:p-12">
        {selectedCountry ? (
          <div className="flex flex-col h-full animate-fade-in">
            <div className="flex items-start justify-between gap-4 mb-6">
              <h3 className="text-5xl xl:text-6xl font-bold uppercase leading-[0.85] tracking-[-0.04em] text-blue break-words">
                {selectedCountry.name}
              </h3>
              <div className={`fi fi-${selectedCountry.flagCode} text-3xl drop-shadow-sm mt-1`} />
            </div>
            
            {selectedCountry.image ? (
              <div className="relative w-full aspect-[4/3] mb-8 bg-blue/10">
                <Image src={selectedCountry.image} alt={selectedCountry.name} fill className="object-cover museum-image" sizes="(max-width: 1024px) 100vw, 480px" />
              </div>
            ) : (
              <div className="w-full aspect-[4/3] mb-8 border border-black/10 bg-black/5 flex items-center justify-center">
                <div className="font-article text-xl text-black/40 italic">Sin imagen</div>
              </div>
            )}
            


            <div className="font-article text-lg leading-relaxed text-black/80 mb-12">
              {description ? description : "Próximamente"}
            </div>

            <div className="mt-auto pt-8 flex items-center justify-between">
              <Link href={`/lugares/${selectedCountry.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`} className="inline-flex min-h-12 items-center bg-blue px-8 text-xs font-bold uppercase tracking-[0.13em] text-white transition-colors hover:bg-black">
                Ver más
              </Link>
              <button 
                type="button"
                onClick={() => setSelectedCountry(null)}
                className="inline-flex min-h-8 items-center border-b border-black pb-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-blue hover:text-black transition-colors"
              >
                Cerrar ficha
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <p className="font-article text-xl text-black/40 italic">Selecciona un país en el mapa para ver sus detalles.</p>
          </div>
        )}
      </div>

      {/* RIGHT PANEL - SVG MAP */}
      <div className="relative flex-1 bg-white overflow-hidden min-h-[500px] lg:min-h-full flex items-center justify-center">
        <ComposableMap projectionConfig={{ scale: 150 }} className="w-full h-auto max-h-full cursor-move outline-none">
          <ZoomableGroup maxZoom={8} className="outline-none">
            <Geographies geography={geoUrl} className="outline-none">
              {({ geographies }) =>
                geographies.map((geo) => {
                  const isVisited = visitedCountriesData[geo.id];
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => {
                        if (isVisited) setSelectedCountry(isVisited);
                      }}
                      style={{
                        default: {
                          fill: isVisited ? "#0f172a" : "#f1f4f8",
                          outline: "none",
                          stroke: "#ffffff",
                          strokeWidth: 0.5,
                          cursor: isVisited ? "pointer" : "default",
                        },
                        hover: {
                          fill: isVisited ? "#2a3b5c" : "#e2e8f0",
                          outline: "none",
                          cursor: isVisited ? "pointer" : "default",
                        },
                        pressed: {
                          fill: isVisited ? "#0a0c10" : "#cbd5e1",
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* FLAGS STAIRCASE */}
      <div className="absolute right-6 bottom-6 z-10 md:right-8 md:bottom-8 drop-shadow-sm flex flex-col items-end gap-1">
        {/* Row 4 (Top) */}
        <div className="flex gap-1">
          <button type="button" onClick={() => handleFlagClick("mc")} className="fi fi-mc text-4xl shadow-sm hover:scale-110 transition-transform cursor-pointer" aria-label="Mónaco" />
        </div>
        {/* Row 3 */}
        <div className="flex gap-1">
          <button type="button" onClick={() => handleFlagClick("va")} className="fi fi-va text-4xl shadow-sm hover:scale-110 transition-transform cursor-pointer" aria-label="Ciudad del Vaticano" />
          <button type="button" onClick={() => handleFlagClick("ie")} className="fi fi-ie text-4xl shadow-sm hover:scale-110 transition-transform cursor-pointer" aria-label="Irlanda" />
        </div>
        {/* Row 2 */}
        <div className="flex gap-1">
          <button type="button" onClick={() => handleFlagClick("it")} className="fi fi-it text-4xl shadow-sm hover:scale-110 transition-transform cursor-pointer" aria-label="Italia" />
          <button type="button" onClick={() => handleFlagClick("ch")} className="fi fi-ch text-4xl shadow-sm hover:scale-110 transition-transform cursor-pointer" aria-label="Suiza" />
          <button type="button" onClick={() => handleFlagClick("gb")} className="fi fi-gb text-4xl shadow-sm hover:scale-110 transition-transform cursor-pointer" aria-label="Reino Unido" />
        </div>
        {/* Row 1 (Bottom) */}
        <div className="flex gap-1">
          <button type="button" onClick={() => handleFlagClick("uy")} className="fi fi-uy text-4xl shadow-sm hover:scale-110 transition-transform cursor-pointer" aria-label="Uruguay" />
          <button type="button" onClick={() => handleFlagClick("br")} className="fi fi-br text-4xl shadow-sm hover:scale-110 transition-transform cursor-pointer" aria-label="Brasil" />
          <button type="button" onClick={() => handleFlagClick("ar")} className="fi fi-ar text-4xl shadow-sm hover:scale-110 transition-transform cursor-pointer" aria-label="Argentina" />
          <button type="button" onClick={() => handleFlagClick("es")} className="fi fi-es text-4xl shadow-sm hover:scale-110 transition-transform cursor-pointer" aria-label="España" />
          <button type="button" onClick={() => handleFlagClick("fr")} className="fi fi-fr text-4xl shadow-sm hover:scale-110 transition-transform cursor-pointer" aria-label="Francia" />
        </div>
      </div>
    </div>

    </div>
  );
}
