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
        setDisertantes(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Un error desconocido ocurrió');
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
            Ponentes del Congreso
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {disertantes.map((disertante) => (
              <Card key={disertante.id} className="overflow-hidden transform hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl">
                <CardHeader className="flex flex-row items-center gap-4 p-6 bg-gray-50">
                  <Avatar className="h-20 w-20 border-2 border-white shadow-md">
                    <AvatarImage src={disertante.foto_url} alt={disertante.nombre} />
                    <AvatarFallback>{disertante.nombre.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl font-bold text-congress-blue">{disertante.nombre}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Tema de Presentación:</h3>
                  <p className="text-gray-600 mb-4">{disertante.tema_presentacion}</p>
                  <h3 className="font-semibold text-gray-800 mb-2">Biografía:</h3>
                  <p className="text-gray-600 text-sm text-justify">{disertante.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
