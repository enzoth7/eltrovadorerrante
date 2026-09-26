"use client";

import "./travel-map.css";
import { memo, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { animate, motion } from "framer-motion";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { slugifyPlace } from "@/lib/places";
import type { MapPlace } from "@/lib/map-places";
import { cameraInterpolator, cardPosition, fitPlaces, layoutPins, mapProjection, WORLD_CAMERA, type Camera, type MapSize } from "@/lib/map-layout";

export interface CountryData {
  id: string;
  name: string;
  flagCode: string;
  review?: string;
  image: string;
}

const countries: CountryData[] = [
  { id: "858", name: "Uruguay", flagCode: "uy", review: "La raíz y el punto de regreso. El ritmo del litoral, la cercanía del río y una identidad construida lejos del ruido de las grandes capitales.", image: "/assets/uruguay.jpg" },
  { id: "076", name: "Brasil", flagCode: "br", image: "/assets/brasil1.jpg" },
  { id: "032", name: "Argentina", flagCode: "ar", image: "/assets/argentina.jpg" },
  { id: "724", name: "España", flagCode: "es", review: "Ciudades, islas y costas recorridas entre historia, arquitectura y distintas formas de vida mediterránea.", image: "/assets/españa1.jpg" },
  { id: "250", name: "Francia", flagCode: "fr", review: "La síntesis mediterránea: mar, historia, arquitectura, caminatas y una forma más luminosa de habitar la ciudad.", image: "/assets/francia.jpg" },
  { id: "380", name: "Italia", flagCode: "it", image: "/assets/italia.jpg" },
  { id: "756", name: "Suiza", flagCode: "ch", image: "/assets/suiza.jpg" },
  { id: "826", name: "Reino Unido", flagCode: "gb", image: "/assets/reino unido.jpg" },
  { id: "336", name: "Vaticano", flagCode: "va", image: "/assets/vaticano.jpg" },
  { id: "372", name: "Irlanda", flagCode: "ie", review: "La primera vida larga en el exterior: otro idioma, otra escala de ciudad y el aprendizaje cotidiano de empezar desde cero.", image: "/assets/irlanda.jpg" },
  { id: "492", name: "Mónaco", flagCode: "mc", review: "Un territorio mínimo y vertical, comprimido entre la roca, el Mediterráneo y una arquitectura de otra escala.", image: "/assets/monaco.jpg" },
];
const countryById = Object.fromEntries(countries.map((country) => [country.id, country]));

// This Motion version snapshots the setting at mount. Subscribe explicitly so
// changing the system preference also cancels an animation already in progress.
function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
const getReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Keep the geographical paths out of camera animation renders.
const CountryShapes = memo(function CountryShapes({ selectedId, onSelect }: {
  selectedId?: string;
  onSelect: (country: CountryData) => void;
}) {
  return (
    <Geographies geography="/world-50m.json">
      {({ geographies }) => geographies.map((geo) => {
        const country = countryById[String(geo.id).padStart(3, "0")];
        const fill = country ? "#0F172A" : "#0F172A0D";
        return <Geography
          key={geo.rsmKey}
          geography={geo}
          tabIndex={-1}
          aria-hidden="true"
          vectorEffect="non-scaling-stroke"
          data-country={country?.name}
          onClick={() => { if (country) onSelect(country); }}
          style={{
            default: { fill, stroke: "#FFFFFF", strokeWidth: 0.7, outline: "none", cursor: country ? "pointer" : "default", opacity: selectedId && country && country.id !== selectedId ? 0.35 : 1 },
            hover: { fill: country ? "#000000" : fill, outline: "none", cursor: country ? "pointer" : "default" },
            pressed: { fill, outline: "none" },
          }}
        />;
      })}
    </Geographies>
  );
});

function useElementSize<T extends HTMLElement>(initial: MapSize) {
  const ref = useRef<T>(null);
  const [size, setSize] = useState(initial);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const box = entry.target.getBoundingClientRect();
      const width = Math.round(box.width), height = Math.round(box.height);
      if (width && height) setSize((previous) => previous.width === width && previous.height === height ? previous : { width, height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return { ref, size };
}

export default function InteractiveMap({ countryDescriptions = {}, places }: {
  countryDescriptions?: Record<string, string>;
  places: MapPlace[];
}) {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [camera, setCamera] = useState<Camera>(WORLD_CAMERA);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
  const { ref: mapRef, size } = useElementSize<HTMLDivElement>({ width: 800, height: 560 });
  const { ref: cardRef, size: cardSize } = useElementSize<HTMLDivElement>({ width: 240, height: 240 });
  const cameraRef = useRef(camera);
  const pinRefs = useRef(new Map<string, HTMLButtonElement>());
  const skipFocusOpen = useRef(false);

  const projection = useMemo(() => mapProjection(size), [size]);
  const countryPlaces = useMemo(() => places.filter((place) => place.country === selectedCountry?.name), [places, selectedCountry]);
  const target = useMemo(() => fitPlaces(countryPlaces, projection, size), [countryPlaces, projection, size]);

  useEffect(() => {
    const interpolate = cameraInterpolator(cameraRef.current, target);
    let animation: ReturnType<typeof animate> | undefined;
    const frame = requestAnimationFrame(() => {
      animation = animate(0, 1, {
        duration: reducedMotion ? 0 : 0.65,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (progress) => {
          const next = interpolate(progress);
          cameraRef.current = next;
          setCamera(next);
        },
        onComplete: () => { cameraRef.current = target; setCamera(target); },
      });
    });
    return () => { cancelAnimationFrame(frame); animation?.stop(); };
  }, [target, reducedMotion]);

  useEffect(() => {
    if (!selectedPlace) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Element && !event.target.closest("[data-map-pin], [data-map-card]")) setSelectedPlace(null);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setSelectedPlace(null);
      skipFocusOpen.current = true;
      pinRefs.current.get(selectedPlace)?.focus({ preventScroll: true });
      skipFocusOpen.current = false;
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedPlace]);

  const selectCountry = useCallback((country: CountryData | null) => {
    setSelectedPlace(null);
    if (country?.id === selectedCountry?.id) return;
    setCamera((previous) => ({ ...previous, settled: false }));
    setSelectedCountry(country);
  }, [selectedCountry]);

  const pins = useMemo(() => layoutPins(countryPlaces, target, projection, size), [countryPlaces, target, projection, size]);
  const activePin = pins.find((pin) => pin.place.place === selectedPlace);
  const card = activePin ? cardPosition(activePin, size, cardSize) : { x: 0, y: 0 };
  const projectedCenter = projection(camera.center)!;
  const transform = `translate(${size.width / 2 - projectedCenter[0] * camera.zoom} ${size.height / 2 - projectedCenter[1] * camera.zoom}) scale(${camera.zoom})`;
  const description = selectedCountry ? countryDescriptions[selectedCountry.name] || selectedCountry.review : null;

  function closeCard(restoreFocus = false) {
    setSelectedPlace(null);
    if (restoreFocus && selectedPlace) {
      skipFocusOpen.current = true;
      pinRefs.current.get(selectedPlace)?.focus({ preventScroll: true });
      skipFocusOpen.current = false;
    }
  }

  return (
    <div className="travel-map">
      <div className="travel-map-explorer">
        <div ref={mapRef} className="travel-map-canvas" data-map-country={selectedCountry?.name ?? "Mundo"} data-map-settled={camera.settled}>
          <ComposableMap width={size.width} height={size.height} projection="geoEqualEarth" projectionConfig={{ scale: projection.scale() }} className="travel-map-svg" aria-label="Países visitados; selecciona también mediante las banderas">
            {/* A plain SVG camera avoids gesture listeners: page scrolling and
                browser pinch-to-zoom remain native on touch devices. */}
            <g transform={transform}>
              <CountryShapes selectedId={selectedCountry?.id} onSelect={selectCountry} />
            </g>
          </ComposableMap>
          {selectedCountry && <button type="button" className="travel-map-reset" onClick={() => selectCountry(null)}>Volver al mundo</button>}

          {camera.settled && selectedCountry && <>
            <svg className="travel-map-leaders" width={size.width} height={size.height} aria-hidden="true">
              {pins.map((pin) => Math.hypot(pin.x - pin.anchorX, pin.y - pin.anchorY) > 8 && <g key={pin.place.place}>
                <line x1={pin.anchorX} y1={pin.anchorY} x2={pin.x} y2={pin.y} stroke="#0F172A" strokeOpacity={0.45} />
                <circle cx={pin.anchorX} cy={pin.anchorY} r={2} fill="#FFFFFF" stroke="#0F172A" />
              </g>)}
            </svg>
            {pins.map((pin, index) => <motion.button
              key={`${selectedCountry.id}-${pin.place.place}`}
              ref={(element) => { if (element) pinRefs.current.set(pin.place.place, element); else pinRefs.current.delete(pin.place.place); }}
              type="button"
              data-map-pin={pin.place.place}
              className="travel-map-pin"
              style={{ left: pin.x - 22, top: pin.y - 22 }}
              initial={reducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.2, delay: reducedMotion ? 0 : Math.min(index, 7) * 0.04 }}
              aria-label={`${pin.place.place}, ${pin.place.status}. Ver fotografía`}
              aria-expanded={selectedPlace === pin.place.place}
              aria-controls={selectedPlace === pin.place.place ? "map-place-card" : undefined}
              onFocus={() => { if (!skipFocusOpen.current) setSelectedPlace(pin.place.place); }}
              onClick={() => setSelectedPlace(pin.place.place)}
            >
              <svg width="24" height="30" viewBox="0 0 24 30" aria-hidden="true">
                <path d="M12 29S1 17 1 12a11 11 0 0 1 22 0c0 5-11 17-11 17Z" fill="#0F172A" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="4" fill="#FFFFFF" />
              </svg>
            </motion.button>)}
          </>}

          <div ref={cardRef} id="map-place-card" data-map-card className="travel-map-card" hidden={!activePin || !camera.settled} style={{ left: card.x, top: card.y }} role="region" aria-labelledby="map-place-title">
            {activePin && <>
              <div className="travel-map-card-heading">
                <h3 id="map-place-title">{activePin.place.place}</h3>
                <button type="button" onClick={() => closeCard(true)} aria-label="Cerrar fotografía">×</button>
              </div>
              <div className="travel-map-card-image">
                <Image key={activePin.place.image} src={activePin.place.image} alt={activePin.place.alt} fill sizes="240px" className="object-cover" />
              </div>
            </>}
          </div>
        </div>

        <div className="travel-map-country-list" role="group" aria-label="Seleccionar país">
          {countries.map((country) => <button key={country.id} type="button" title={country.name} aria-label={country.name} aria-pressed={selectedCountry?.id === country.id} onClick={() => selectCountry(country)}>
            <span className={`fi fi-${country.flagCode}`} aria-hidden="true" />
          </button>)}
        </div>
        <p className="sr-only" role="status" aria-live="polite">
          {selectedPlace ? `${selectedPlace}. Fotografía abierta.` : selectedCountry ? `${selectedCountry.name}: ${countryPlaces.length} lugares. Selecciona un pin para ver su fotografía.` : "Mapa mundial. Selecciona un país."}
        </p>
      </div>

      <div className="travel-map-country-panel">
        {selectedCountry ? <div className="flex h-full flex-col">
          <div className="mb-6 flex items-start justify-between gap-4">
            <h2 className="text-5xl font-bold uppercase leading-[0.9] tracking-[-0.04em] text-blue xl:text-6xl">{selectedCountry.name}</h2>
            <span className={`fi fi-${selectedCountry.flagCode} mt-1 shrink-0 text-3xl`} aria-hidden="true" />
          </div>
          <div className="relative mb-8 aspect-[4/3] w-full bg-blue/10">
            <Image src={selectedCountry.image} alt={selectedCountry.name} fill className="museum-image object-cover" sizes="(max-width: 1024px) 100vw, 480px" />
          </div>
          <div className="font-article mb-10 text-lg leading-relaxed text-black/80">{description || "Próximamente"}</div>
          <div className="mt-auto flex items-center justify-between gap-4 pt-8">
            <Link href={`/lugares/${slugifyPlace(selectedCountry.name)}`} className="inline-flex min-h-12 items-center bg-blue px-8 text-xs font-bold uppercase tracking-[0.13em] text-white transition-colors hover:bg-black">Ver más</Link>
            <button type="button" onClick={() => selectCountry(null)} className="inline-flex min-h-11 items-center border-b border-black text-xs font-semibold uppercase tracking-wider text-blue">Cerrar ficha</button>
          </div>
        </div> : <p className="font-article my-auto text-center text-xl italic text-black/65">Selecciona un país en el mapa para ver sus lugares.</p>}
      </div>
    </div>
  );
}
