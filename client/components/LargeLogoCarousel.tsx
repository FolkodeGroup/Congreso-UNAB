import React, { useState, useEffect, useRef } from "react";
import {
  FIRST_CAROUSEL_LOGOS,
  SECOND_CAROUSEL_LOGOS,
  THIRD_CAROUSEL_LOGOS,
  DEFAULT_LOGOS,
  LogoItem,
} from "./data/logos";
import { chunk } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

// Combine all logos and remove duplicates
const allLogos: LogoItem[] = [
  ...DEFAULT_LOGOS,
  ...FIRST_CAROUSEL_LOGOS,
  ...SECOND_CAROUSEL_LOGOS,
  ...THIRD_CAROUSEL_LOGOS,
].filter(
  (logo, index, self) => index === self.findIndex((l) => l.src === logo.src),
);

const LargeLogoCarousel: React.FC = () => {
  const isMobile = useIsMobile();
  const logosPerPage = isMobile ? 6 : 12; // 4 columns * 3 rows = 12 logos per page
  const chunkedLogos = chunk(allLogos, logosPerPage);
  const [currentPage, setCurrentPage] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [carouselHeight, setCarouselHeight] = useState(400);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrentPage((prev) => (prev + 1) % chunkedLogos.length);
    }, 5000); // Change slide every 5 seconds

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentPage, chunkedLogos.length]);

  useEffect(() => {
    if (gridRef.current) {
      setCarouselHeight(gridRef.current.offsetHeight);
    }
  }, [currentPage, chunkedLogos]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.9 },
    visible: { y: 0, opacity: 1, scale: 1 },
    exit: { y: -20, opacity: 0, scale: 0.9 },
  };

  return (
    <section className="py-8 bg-gray-100 overflow-hidden relative">
      <div className="w-full px-4">
        <div className="relative w-full" style={{ height: carouselHeight }}>
          {" "}
          {/* Fixed height for carousel container */}
          <AnimatePresence mode="wait">
            {chunkedLogos.map(
              (page, pageIndex) =>
                pageIndex === currentPage && (
                  <motion.div
                    ref={gridRef}
                    key={pageIndex}
                    className="absolute top-0 left-0 w-full h-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 justify-items-center items-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {page.map((logo, index) => (
                      <motion.div
                        key={index}
                        className="flex justify-center items-center p-4 bg-white rounded-lg shadow-md"
                        variants={itemVariants}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <img
                          src={logo.src}
                          alt={logo.alt}
                          className="max-h-24 w-auto object-contain" // Uniform size for all logos
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                ),
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default LargeLogoCarousel;