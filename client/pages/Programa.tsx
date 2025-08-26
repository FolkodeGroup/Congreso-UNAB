import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { groupWith } from '@/lib/utils';

// Tipos de datos basados en los modelos de Django y Serializers
type Disertante = {
  nombre: string;
  bio: string;
  foto_url: string;
  tema_presentacion: string;
};

type ProgramaItem = {
  titulo: string;
  disertante: Disertante | null;
  hora_inicio: string;
  hora_fin: string;
  dia: string;
  descripcion: string;
};

export default function Programa() {
  const [programa, setPrograma] = useState<Record<string, ProgramaItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograma = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/programa/');
        if (!response.ok) {
          throw new Error('Error al cargar los datos del programa.');
        }
        const data: ProgramaItem[] = await response.json();
        // Agrupar eventos por día
        const groupedData = groupWith(data, (item) => item.dia);
        setPrograma(groupedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Un error desconocido ocurrió');
      } finally {
        setLoading(false);
      }
    };

    fetchPrograma();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // Formato HH:MM
  };

  const renderSkeletons = () => (
    <div className="space-y-8">
      {[...Array(2)].map((_, dayIndex) => (
        <div key={dayIndex}>
          <Skeleton className="h-8 w-1/2 mb-6" />
          <div className="space-y-4">
            {[...Array(3)].map((_, itemIndex) => (
              <Card key={itemIndex}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/4 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Programa del Congreso
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre el cronograma de charlas, talleres y eventos de networking.
          </p>
        </div>

        {loading ? (
          renderSkeletons()
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error} Asegúrate de que el servidor backend esté corriendo en http://127.0.0.1:8000
            </AlertDescription>
          </Alert>
        ) : Object.keys(programa).length === 0 ? (
          <Alert>
            <AlertTitle>Programa no disponible</AlertTitle>
            <AlertDescription>
              El programa del congreso aún no ha sido publicado. Por favor, vuelve a consultar más tarde.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-12">
            {Object.entries(programa).map(([dia, items]) => (
              <div key={dia}>
                <h2 className="text-3xl font-bold text-congress-blue mb-6 border-b-2 pb-2">{formatDate(dia)}</h2>
                <div className="space-y-6">
                  {items.map((item, index) => (
                    <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-300">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-2xl text-gray-800">{item.titulo}</CardTitle>
                          <span className="text-lg font-semibold text-congress-blue-dark bg-congress-blue-light px-3 py-1 rounded-full">
                            {formatTime(item.hora_inicio)} - {formatTime(item.hora_fin)}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {item.disertante && (
                          <div className="mb-4">
                            <p className="font-semibold text-lg">A cargo de: {item.disertante.nombre}</p>
                            <p className="text-md text-gray-600">{item.disertante.tema_presentacion}</p>
                          </div>
                        )}
                        <p className="text-gray-700">{item.descripcion}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
