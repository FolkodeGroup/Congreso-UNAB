import React, { useState, useEffect, useRef } from "react";
import { LogoItem, chunk } from "./data/logos";
import { motion, AnimatePresence } from "framer-motion";
import { useEmpresas } from "@/hooks/use-empresas";


const LargeLogoCarousel: React.FC = () => {
  const { logosForCarousel, loading, error } = useEmpresas();
  const [currentPage, setCurrentPage] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Elegir chunking según mobile/desktop
  const logosPerPage = isMobile ? 6 : 12; // 2x3 en mobile, 4x3 en desktop
  const chunkedLogos = chunk(logosForCarousel, logosPerPage);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrentPage((prev) => (prev + 1) % chunkedLogos.length);
    }, 5000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentPage, chunkedLogos.length]);

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

  if (loading) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="w-full px-4 flex justify-center items-center h-[400px]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="w-full px-4 flex justify-center items-center h-[400px]">
          <div className="text-center text-red-600">
            Error al cargar las empresas: {error}
          </div>
        </div>
      </section>
    );
  }

  if (chunkedLogos.length === 0) {
    return (
      <section className="py-16 bg-gray-100">
        <div className="w-full px-4 flex justify-center items-center h-[400px]">
          <div className="text-center text-gray-600">
            No hay empresas disponibles.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-100 overflow-hidden relative">
      <div className="w-full px-4">
        <div className="relative w-full h-[400px]">
          <AnimatePresence mode="wait">
            {chunkedLogos.map(
              (page, pageIndex) =>
                pageIndex === currentPage && (
                  <motion.div
                    key={pageIndex}
                    className={
                      isMobile
                        ? "absolute top-0 left-0 w-full h-full grid grid-cols-2 grid-rows-3 gap-6 justify-items-center items-center"
                        : "absolute top-0 left-0 w-full h-full grid grid-cols-4 grid-rows-3 gap-8 justify-items-center items-center"
                    }
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
                          className="max-h-24 w-auto object-contain"
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