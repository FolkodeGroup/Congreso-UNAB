import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

// Definimos el tipo de dato para un disertante, basado en el modelo de Django
type Disertante = {
  id: number;
  nombre: string;
  bio: string;
  foto_url: string;
  tema_presentacion: string;
};

export default function Ponentes() {
  const [disertantes, setDisertantes] = useState<Disertante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDisertantes = async () => {
      try {
        // Apuntamos a la URL de la API de Django
        const response = await fetch('http://127.0.0.1:8000/api/disertantes/');
        if (!response.ok) {
          throw new Error('Error al cargar los datos de los ponentes.');
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setDisertantes(data);
        } else {
          // Si no hay datos, generar disertantes desde los archivos locales
          const archivos = [
            'agustin_varamo.jpeg',
            'alexander_machado.jpeg',
            'ana_gaude.jpeg',
            'argenis_soto.jpeg',
            'claudia_freed.jpg',
            'cristian_ruiz.jpeg',
            'delfina_salgado.jpeg',
            'diego_plumaris.jpeg',
            'ezequiel_grillo.jpg',
            'federico_carlos.jpeg',
            'felipe_rios.jpg',
            'gabriel_luchessi.jfif',
            'jorge_golfieri.jpeg',
            'jorge_metz.jpg',
            'juan_sanchez.png',
            'mariano_caiban.jpeg',
            'martin_boris.jpeg',
            'natalia_gonzalez.jpeg',
          ];
          const ejemploTema = 'Título de la Presentación';
          const ejemploBio = 'Descripción de ejemplo del disertante.';
          const disertantesAuto = archivos.map((archivo, idx) => {
            const nombreBase = archivo.replace(/\.[^/.]+$/, '');
            const nombre = nombreBase
              .split('_')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ');
            return {
              id: idx + 1,
              nombre,
              bio: ejemploBio,
              foto_url: `http://127.0.0.1:8000/media/ponencias/${archivo}`,
              tema_presentacion: ejemploTema,
            };
          });
          setDisertantes(disertantesAuto);
        }
      } catch (err) {
        // Si hay error, mostrar los disertantes de ejemplo
        const archivos = [
          'agustin_varamo.jpeg',
          'alexander_machado.jpeg',
          'ana_gaude.jpeg',
          'argenis_soto.jpeg',
          'claudia_freed.jpg',
          'cristian_ruiz.jpeg',
          'delfina_salgado.jpeg',
          'diego_plumaris.jpeg',
          'ezequiel_grillo.jpg',
          'federico_carlos.jpeg',
          'felipe_rios.jpg',
          'gabriel_luchessi.jfif',
          'jorge_golfieri.jpeg',
          'jorge_metz.jpg',
          'juan_sanchez.png',
          'mariano_caiban.jpeg',
          'martin_boris.jpeg',
          'natalia_gonzalez.jpeg',
        ];
        const ejemploTema = 'Título de la Presentación';
        const ejemploBio = 'Descripción de ejemplo del disertante.';
        const disertantesAuto = archivos.map((archivo, idx) => {
          const nombreBase = archivo.replace(/\.[^/.]+$/, '');
          const nombre = nombreBase
            .split('_')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
          return {
            id: idx + 1,
            nombre,
            bio: ejemploBio,
            foto_url: `http://127.0.0.1:8000/media/ponencias/${archivo}`,
            tema_presentacion: ejemploTema,
          };
        });
        setDisertantes(disertantesAuto);
        setError(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDisertantes();
  }, []);

  const renderSkeletons = () => (
    Array.from({ length: 3 }).map((_, index) => (
      <Card key={index} className="overflow-hidden transform hover:scale-105 transition-transform duration-300">
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
    ))
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Disertantes del Congreso
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Conoce a los expertos en logística y transporte que compartirán sus conocimientos y experiencia.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {renderSkeletons()}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
            <p><strong>Error:</strong> {error}</p>
            <p>Asegúrate de que el servidor backend de Django esté corriendo en http://127.0.0.1:8000</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {disertantes.map((disertante, idx) => {
              // Rotación aleatoria para efecto "polaroid"
              const rotations = ['-rotate-3', 'rotate-2', '-rotate-2', 'rotate-1', '-rotate-1'];
              const rotation = rotations[idx % rotations.length];
              // Construir la URL pública de la imagen
              let fotoUrl = disertante.foto_url;
              if (fotoUrl && !fotoUrl.startsWith('http')) {
                // Elimina prefijos innecesarios y construye la URL absoluta
                const cleanPath = fotoUrl.replace(/^.*media\//, '');
                fotoUrl = `http://127.0.0.1:8000/media/${cleanPath}`;
              }
              return (
                <div
                  key={`${disertante.nombre}-${idx}`}
                  className="flex flex-col items-center group"
                >
                  {/* Polaroid-style image card */}
                  <div
                    className={`bg-white border-2 border-gray-300 shadow-lg p-2 mb-4 w-56 h-64 flex flex-col items-center justify-center ${rotation} group-hover:scale-105 group-hover:shadow-2xl transition-transform duration-300 relative`}
                  >
                    <img
                      src={fotoUrl}
                      alt={disertante.nombre}
                      className="w-48 h-48 object-cover object-center bg-gray-100 rounded-md"
                      style={{ aspectRatio: '1/1' }}
                    />
                    {/* Tornillos decorativos */}
                    <span className="absolute top-1 left-1 w-3 h-3 bg-gray-300 rounded-full border border-gray-400"></span>
                    <span className="absolute top-1 right-1 w-3 h-3 bg-gray-300 rounded-full border border-gray-400"></span>
                    <span className="absolute bottom-1 left-1 w-3 h-3 bg-gray-300 rounded-full border border-gray-400"></span>
                    <span className="absolute bottom-1 right-1 w-3 h-3 bg-gray-300 rounded-full border border-gray-400"></span>
                  </div>
                  {/* Tarjeta de datos */}
                  <div className="bg-white border-2 border-gray-400 rounded-lg shadow-md px-4 py-4 w-56 text-center flex flex-col items-center">
                    <h2 className="text-lg font-black text-congress-blue tracking-wide mb-1 uppercase">
                      {disertante.nombre}
                    </h2>
                    <div className="text-gray-800 font-semibold text-sm mb-1">
                      {disertante.tema_presentacion}
                    </div>
                    <div className="text-gray-600 text-xs mb-1">
                      {disertante.bio}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
