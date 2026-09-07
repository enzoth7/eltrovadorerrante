"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export interface GalleryItemData {
  src: string;
  title: string;
  description: string;
}

interface ExpandableGalleryProps {
  items: GalleryItemData[];
  className?: string;
}

export const ExpandableGallery: React.FC<ExpandableGalleryProps> = ({
  items,
  className = "",
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openImage = (index: number) => {
    setSelectedIndex(index);
  };

  const closeImage = () => {
    setSelectedIndex(null);
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % items.length);
    }
  };

  const goToPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + items.length) % items.length);
    }
  };

  const getFlexValue = (index: number) => {
    if (hoveredIndex === null) {
      return 1;
    }
    return hoveredIndex === index ? 2 : 0.5;
  };

  if (!isMounted) return null;

  return (
    <div className={className}>
      {/* Horizontal Expandable Gallery */}
      <div className="flex w-full gap-3 h-[500px] md:h-[650px]">
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="group relative cursor-pointer overflow-hidden bg-blue"
            style={{ flex: 1 }}
            animate={{ flex: getFlexValue(index) }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => openImage(index)}
          >
            <Image
              src={item.src}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
            
            <div className="absolute bottom-0 left-0 w-full p-6 text-white md:p-8">
              <h3 className="mb-2 text-xl font-bold uppercase tracking-wide md:text-2xl">
                {item.title}
              </h3>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: hoveredIndex === index ? 1 : 0,
                  height: hoveredIndex === index ? "auto" : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="font-article mt-3 text-sm leading-relaxed text-white/90 md:text-base">
                  {item.description}
                </p>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Expanded View Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
            onClick={closeImage}
          >
            {/* Close Button */}
            <button
              className="absolute right-4 top-4 z-10 text-white/70 transition-colors hover:text-white"
              onClick={closeImage}
            >
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Previous Button */}
            {items.length > 1 && (
              <button
                className="absolute left-4 z-10 text-white/70 transition-colors hover:text-white"
                onClick={goToPrev}
              >
                <svg
                  className="h-10 w-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {/* Image */}
            <motion.div
              className="relative h-[90vh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                key={selectedIndex}
                src={items[selectedIndex].src}
                alt={items[selectedIndex].title}
                fill
                className="object-contain"
              />
            </motion.div>

            {/* Next Button */}
            {items.length > 1 && (
              <button
                className="absolute right-4 z-10 text-white/70 transition-colors hover:text-white"
                onClick={goToNext}
              >
                <svg
                  className="h-10 w-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-md bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md">
              {selectedIndex + 1} / {items.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
