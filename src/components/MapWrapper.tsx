"use client";

import dynamic from "next/dynamic";

const InteractiveMap = dynamic(() => import("./InteractiveMap"), {
  ssr: false,
  loading: () => <div className="h-[700px] w-full bg-[#f8f9fa]" />
});

export default function MapWrapper() {
  return <InteractiveMap />;
}
