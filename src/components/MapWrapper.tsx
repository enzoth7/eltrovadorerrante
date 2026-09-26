"use client";

import dynamic from "next/dynamic";
import type { MapPlace } from "@/lib/map-places";

const InteractiveMap = dynamic(() => import("./InteractiveMap"), {
  ssr: false,
  loading: () => <div className="flex h-[600px] w-full items-center justify-center bg-white text-blue" role="status">Cargando mapa…</div>
});

export default function MapWrapper({ countryDescriptions = {}, places }: { countryDescriptions?: Record<string, string>; places: MapPlace[] }) {
  return <InteractiveMap countryDescriptions={countryDescriptions} places={places} />;
}
