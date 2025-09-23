import { useEffect, useState } from "react";
import { motion, useAnimation, useScroll, useTransform } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

// Definimos el tipo de dato para un disertante, basado en el modelo de Django
type Disertante = {
  id: number;
  nombre: string;
  bio: string;
  foto_url: string;
  tema_presentacion: string;
  linkedin?: string;
};

export default function Ponentes() {
  const [disertantes, setDisertantes] = useState<Disertante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Efecto parallax para el fondo
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], [0, -200]);
  const circleY1 = useTransform(scrollY, [0, 1000], [0, -150]);
  const circleY2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchDisertantes = async () => {
      try {
        // Apuntamos a la URL de la API de Django
        const response = await fetch(`${apiUrl}/api/disertantes/`);
        if (!response.ok) {
          throw new Error("Error al cargar los datos de los ponentes.");
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
            // Ordenar alfabéticamente por nombre
            const dataOrdenada = [...data].sort((a, b) => a.nombre.localeCompare(b.nombre));
            setDisertantes(dataOrdenada);
        } else {
          // Si no hay datos, generar disertantes desde los archivos locales
          const archivos = [
            "agustin-varamo.png",
            "alexander-machado.png",
            "ana-gaude.png",
            "argenis-soto.png",
            "arnaldo-ventancu.png",
            "boris-villalon.png",
            "claudia-freed.png",
            "cristian-ruiz.png",
            "delfina-salgado.png",
            "diego-plumaris.png",
            "ernesto-castagnet.png",
            "ezequiel-grillo.png",
            "federico-carlos.png",
            "felipe-rios.png",
            "gabriel-luchessi.png",
            "ignacio-villalon.png",
            "john-doe.png",
            "jorge-golfieri.png",
            "jorge-metz.png",
            "juan-sanchez.png",
            "mariano-caiban.png",
            "martin-boris.png",
            "natalia-gonzalez.png",
          ];
          const ejemploTema = "Título de la Presentación";
          const ejemploBio = "Descripción de ejemplo del disertante.";
            const disertantesAuto = archivos.map((archivo, idx) => {
              const nombreBase = archivo.replace(/\.[^/.]+$/, "");
              const nombre = nombreBase
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ");
              return {
                id: idx + 1,
                nombre,
                bio: ejemploBio,
                foto_url: `${apiUrl}/media/ponencias/${archivo}`,
                tema_presentacion: ejemploTema,
              };
            });
            // Ordenar alfabéticamente por nombre
            const disertantesAutoOrdenados = [...disertantesAuto].sort((a, b) => a.nombre.localeCompare(b.nombre));
            setDisertantes(disertantesAutoOrdenados);
        }
      } catch (err) {
        // Si hay error, mostrar los disertantes de ejemplo
        const archivos = [
          "agustin-varamo.png",
          "alexander-machado.png",
          "ana-gaude.png",
          "argenis-soto.png",
          "arnaldo-ventancu.png",
          "boris-villalon.png",
          "claudia-freed.png",
          "cristian-ruiz.png",
          "delfina-salgado.png",
          "diego-plumaris.png",
          "ernesto-castagnet.png",
          "ezequiel-grillo.png",
          "federico-carlos.png",
          "felipe-rios.png",
          "gabriel-luchessi.png",
          "ignacio-villalon.png",
          "john-doe.png",
          "jorge-golfieri.png",
          "jorge-metz.png",
          "juan-sanchez.png",
          "mariano-caiban.png",
          "martin-boris.png",
          "natalia-gonzalez.png",
        ];
        const ejemploTema = "Título de la Presentación";
        const ejemploBio = "Descripción de ejemplo del disertante.";
        const disertantesAuto = archivos.map((archivo, idx) => {
          const nombreBase = archivo.replace(/\.[^/.]+$/, "");
          const nombre = nombreBase
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
          return {
            id: idx + 1,
            nombre,
            bio: ejemploBio,
            foto_url: `${apiUrl}/media/ponencias/${archivo}`,
            tema_presentacion: ejemploTema,
          };
        });
        // Ordenar alfabéticamente por nombre
        const disertantesAutoOrdenados = [...disertantesAuto].sort((a, b) => a.nombre.localeCompare(b.nombre));
        setDisertantes(disertantesAutoOrdenados);
        setError(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDisertantes();
  }, []);

  const renderSkeletons = () =>
    Array.from({ length: 3 }).map((_, index) => (
      <Card
        key={index}
        className="overflow-hidden transform hover:scale-105 transition-transform duration-300"
      >
        <CardHeader className="flex flex-row items-center gap-4 p-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </CardContent>
      </Card>
    ));

  return (
    <>
  <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-congress-blue/10 px-2 py-16 flex flex-col items-center relative overflow-x-auto z-10">
        {/* Fondo decorativo elegante con efecto parallax */}
        <motion.div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{ y: backgroundY }}
        >
          <motion.svg 
            width="100%" 
            height="120%" 
            viewBox="0 0 1440 960" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="bg1" x1="0" y1="0" x2="1440" y2="960" gradientUnits="userSpaceOnUse">
                <stop stopColor="#e3eafc" />
                <stop offset="1" stopColor="#eaf3ff" />
              </linearGradient>
            </defs>
            <rect width="1440" height="960" fill="url(#bg1)" />
            <rect x="0" y="0" width="1440" height="960" fill="url(#bg1)" opacity="0.2" />
          </motion.svg>
        </motion.div>

        {/* Círculos decorativos con diferentes velocidades de parallax */}
        <motion.div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{ y: circleY1 }}
        >
          <motion.svg 
            width="100%" 
            height="120%" 
            viewBox="0 0 1440 960" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-full h-full"
          >
            <motion.circle 
              cx="1200" 
              cy="100" 
              r="180" 
              fill="#2563eb22"
              animate={{ 
                x: [0, 20, 0],
                y: [0, -10, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.circle 
              cx="300" 
              cy="500" 
              r="100" 
              fill="#2563eb15"
              animate={{ 
                x: [0, -15, 0],
                y: [0, 15, 0]
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.svg>
        </motion.div>

        <motion.div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{ y: circleY2 }}
        >
          <motion.svg 
            width="100%" 
            height="120%" 
            viewBox="0 0 1440 960" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-full h-full"
          >
            <motion.circle 
              cx="200" 
              cy="700" 
              r="120" 
              fill="#2563eb11"
              animate={{ 
                x: [0, 25, 0],
                y: [0, -20, 0]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.circle 
              cx="1100" 
              cy="600" 
              r="80" 
              fill="#2563eb18"
              animate={{ 
                x: [0, -20, 0],
                y: [0, 10, 0]
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.svg>
        </motion.div>
  <div className="text-center mb-14 z-10">
          <h1 className="text-5xl font-extrabold text-congress-blue mb-4 tracking-tight drop-shadow-lg">
            Disertantes del Congreso
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">
            Conoce a los expertos en logística y transporte que compartirán sus conocimientos y experiencia.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 z-10 w-full">
            {renderSkeletons()}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 bg-red-100 p-4 rounded-xl shadow-md z-10">
            <p>
              <strong>Error:</strong> {error}
            </p>
            <p>
              Asegúrate de que el servidor backend de Django esté corriendo en
              {apiUrl}
            </p>
          </div>
        ) : disertantes.length === 0 ? (
          <div className="text-center text-gray-500 bg-gray-100 p-4 rounded-xl shadow-md z-10">
            <p>No hay disertantes para mostrar.</p>
          </div>
        ) : (
          <motion.div
            className="flex flex-row gap-6 z-10 w-full overflow-x-auto pb-4 sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 sm:overflow-x-visible"
            style={{ WebkitOverflowScrolling: 'touch' }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.25,
                },
              },
            }}
          >
            {disertantes.map((disertante, idx) => {
              const rotations = [
                "-rotate-2",
                "rotate-1",
                "-rotate-1",
                "rotate-2",
                "rotate-0",
              ];
              const rotation = rotations[idx % rotations.length];
              let fotoUrl = disertante.foto_url;
              if (fotoUrl && !fotoUrl.startsWith("http")) {
                const cleanPath = fotoUrl.replace(/^.*media\//, "");
                fotoUrl = `${apiUrl}/media/${cleanPath}`;
              }
              return (
                <motion.div
                  key={`${disertante.nombre}-${idx}`}
                  className="flex-shrink-0 flex flex-col items-center group w-72 sm:w-full"
                  variants={{
                    hidden: { opacity: 0, y: 80 },
                    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
                  }}
                >
                  {/* Modern Polaroid Card */}
                  <div
                    className={`relative bg-gradient-to-br from-white via-gray-100 to-congress-blue/10 border border-gray-200 shadow-2xl rounded-2xl p-3 mb-5 w-64 h-64 flex flex-col items-center justify-center group-hover:scale-105 group-hover:shadow-3xl transition-transform duration-300 group-hover:border-congress-blue/60 group-hover:bg-congress-blue/5 ${rotation}`}
                  >
                    <div className="absolute inset-0 rounded-2xl pointer-events-none border border-congress-blue/20"></div>
                    <img
                      src={fotoUrl}
                      alt={disertante.nombre}
                      className="w-full max-w-[90%] h-auto aspect-square object-cover object-center rounded-xl border-4 border-white shadow-lg bg-gradient-to-br from-congress-blue/10 to-white group-hover:border-congress-blue/40 group-hover:shadow-xl"
                      style={{ aspectRatio: "1/1" }}
                    />
                    {/* Minimalist screws */}
                    <span className="absolute top-2 left-2 w-2 h-2 bg-congress-blue/30 rounded-full border border-congress-blue/40 shadow-sm"></span>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-congress-blue/30 rounded-full border border-congress-blue/40 shadow-sm"></span>
                    <span className="absolute bottom-2 left-2 w-2 h-2 bg-congress-blue/30 rounded-full border border-congress-blue/40 shadow-sm"></span>
                    <span className="absolute bottom-2 right-2 w-2 h-2 bg-congress-blue/30 rounded-full border border-congress-blue/40 shadow-sm"></span>
                  </div>
                  {/* Data Card */}
                  <div className="bg-white/95 border border-congress-blue/20 rounded-xl shadow-lg px-3 py-3 w-64 text-center flex flex-col items-center backdrop-blur-sm group-hover:border-congress-blue/40 group-hover:shadow-xl">
                    <h2 className="text-lg font-extrabold text-congress-blue tracking-wide mb-1 uppercase drop-shadow-sm group-hover:text-congress-blue/80">
                      {disertante.nombre}
                    </h2>
                    <div className="text-gray-800 font-semibold text-sm mb-1 group-hover:text-congress-blue/70">
                      {disertante.tema_presentacion}
                    </div>
                    <div className="text-gray-600 text-xs mb-1 group-hover:text-congress-blue/60">
                      {disertante.bio}
                    </div>
                    {/* LinkedIn field */}
                    {disertante.linkedin && (
                      <a
                        href={disertante.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-congress-blue font-semibold text-xs mt-2 hover:underline hover:text-blue-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24" className="inline-block align-middle"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.838-1.563 3.036 0 3.6 2.001 3.6 4.601v5.595z"/></svg>
                        LinkedIn
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </>
  );
}
