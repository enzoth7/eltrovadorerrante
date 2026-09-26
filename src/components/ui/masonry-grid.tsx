"use client";

import * as React from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
} from 'framer-motion';

/**
 * Props for the MasonryGrid component.
 * @template T - The type of the items in the grid.
 */
interface MasonryGridProps {
  children: React.ReactNode[];
  className?: string;
  gap?: string;
}

// ✨ NEW: A self-contained GridItem component to handle advanced animations
const GridItem = ({ children }: { children: React.ReactNode }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  // Motion values to track mouse position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring animations for smoother transform changes
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  // Transform mouse position into 3D rotation
  const rotateX = useTransform(
    mouseYSpring,
    [-0.5, 0.5],
    ['10deg', '-10deg']
  );
  const rotateY = useTransform(
    mouseXSpring,
    [-0.5, 0.5],
    ['-10deg', '10deg']
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;
    // Normalize mouse position to a range of -0.5 to 0.5
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      className="relative"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileTap={{ scale: 0.95 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export const MasonryGrid = ({
  children,
  className = '',
  gap = '1rem',
}: MasonryGridProps) => {
  return (
    <motion.div
      className={`w-full ${className}`}
      style={{ columnGap: gap }}
      role="list"
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          className="mb-4 break-inside-avoid"
          role="listitem"
        >
          <GridItem>{child}</GridItem>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default MasonryGrid;
