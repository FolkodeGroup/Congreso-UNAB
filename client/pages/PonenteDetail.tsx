import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { API_HOST } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

type Disertante = {
  id: number;
  nombre: string;
  bio: string;
  foto_url: string;
  foto?: string;
  tema_presentacion: string;
  linkedin?: string;
  meta_title?: string;
  meta_description?: string;
};

export default function PonenteDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [disertante, setDisertante] = useState<Disertante | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchDisertante = async () => {
      try {
        const response = await fetch(`${API_HOST}/api/disertantes/${slug}/`);
        if (!response.ok) {
          throw new Error("Disertante no encontrado.");
        }
        const data = await response.json();
        setDisertante(data);
      } catch (err) {
        setError("Error al cargar la información del disertante.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDisertante();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Skeleton className="h-12 w-1/2 mx-auto mb-4" />
        <Skeleton className="h-8 w-3/4 mx-auto mb-8" />
        <div className="flex justify-center">
            <Skeleton className="h-64 w-64 rounded-full mb-8" />
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (error || !disertante) {
    return <div className="text-center py-16">{error || "Disertante no encontrado."}</div>;
  }

  const fotoUrl = disertante.foto || disertante.foto_url;

  return (
    <>
      <Helmet>
        <title>{disertante.meta_title || `${disertante.nombre} | Disertante`}</title>
        <meta name="description" content={disertante.meta_description || disertante.bio} />
        {disertante && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": disertante.nombre,
              "url": window.location.href,
              "image": fotoUrl,
              "description": disertante.bio,
              "knowsAbout": disertante.tema_presentacion,
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": window.location.href
              },
              ...(disertante.linkedin && { "sameAs": disertante.linkedin })
            })}
          </script>
        )}
      </Helmet>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">{disertante.nombre}</h1>
            <p className="text-xl text-gray-600 mb-8">{disertante.tema_presentacion}</p>
        </div>
        
        {fotoUrl && (
            <div className="flex justify-center mb-8">
                <img src={fotoUrl} alt={disertante.nombre} className="w-64 h-64 rounded-full object-cover shadow-lg" />
            </div>
        )}

        <div className="prose lg:prose-xl mx-auto">
            <p>{disertante.bio}</p>
        </div>

        {disertante.linkedin && (
            <div className="text-center mt-8">
                <a href={disertante.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Ver perfil de LinkedIn
                </a>
            </div>
        )}
      </div>
    </>
  );
}
