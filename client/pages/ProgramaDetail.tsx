import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { API_HOST } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

type Disertante = {
  nombre: string;
};

type Programa = {
  id: number;
  titulo: string;
  descripcion: string;
  hora_inicio: string;
  hora_fin: string;
  disertantes: Disertante[];
  aula: string;
  categoria: string;
  meta_title?: string;
  meta_description?: string;
};

export default function ProgramaDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [programa, setPrograma] = useState<Programa | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchPrograma = async () => {
      try {
        const response = await fetch(`${API_HOST}/api/programa/${slug}/`);
        if (!response.ok) {
          throw new Error("Charla no encontrada.");
        }
        const data = await response.json();
        setPrograma(data);
      } catch (err) {
        setError("Error al cargar la información de la charla.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograma();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-8 w-1/2 mx-auto mb-8" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    );
  }

  if (error || !programa) {
    return <div className="text-center py-16">{error || "Charla no encontrada."}</div>;
  }

  const eventDate = "2025-11-15";

  return (
    <>
      <Helmet>
        <title>{programa.meta_title || `${programa.titulo} | Programa`}</title>
        <meta name="description" content={programa.meta_description || programa.descripcion} />
        {programa && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationEvent",
              "name": programa.titulo,
              "description": programa.descripcion,
              "startDate": `${eventDate}T${programa.hora_inicio}`,
              "endDate": `${eventDate}T${programa.hora_fin}`,
              "eventStatus": "https://schema.org/EventScheduled",
              "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
              "location": {
                "@type": "Place",
                "name": `Aula ${programa.aula}`,
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Blas Parera 132",
                  "addressLocality": "Burzaco",
                  "addressRegion": "Buenos Aires",
                  "addressCountry": "AR"
                }
              },
              "performer": programa.disertantes.map(d => ({
                "@type": "Person",
                "name": d.nombre
              })),
              "organizer": {
                "@type": "Organization",
                "name": "Universidad Nacional Guillermo Brown (UNAB)",
                "url": "https://unab.edu.ar"
              }
            })}
          </script>
        )}
      </Helmet>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center">
            <p className="text-lg text-gray-500 mb-2">{programa.categoria} | {programa.aula}</p>
            <h1 className="text-4xl font-bold mb-4">{programa.titulo}</h1>
            <p className="text-xl text-gray-600 mb-8">
                {new Date(`1970-01-01T${programa.hora_inicio}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                {new Date(`1970-01-01T${programa.hora_fin}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
        </div>
        
        <div className="prose lg:prose-xl mx-auto">
            <p>{programa.descripcion}</p>
        </div>

        {programa.disertantes && programa.disertantes.length > 0 && (
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-center mb-4">Disertante(s)</h2>
                <div className="flex justify-center gap-8">
                    {programa.disertantes.map(d => (
                        <div key={d.nombre} className="text-center">
                            <p className="font-semibold">{d.nombre}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </>
  );
}
