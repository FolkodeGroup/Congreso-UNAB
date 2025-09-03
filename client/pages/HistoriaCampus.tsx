import React from "react";
import ImageSlider from "@/components/ImageSlider";
import ModernFadeSlider from "@/components/ModernFadeSlider";
import Layout from "@/components/Layout";

export default function HistoriaCampus() {
  return (
    <Layout>
      <main className="min-h-screen font-sans antialiased text-gray-800">
        {/* Sección de Encabezado Minimalista */}
        <section className="bg-white py-16 md:py-24 text-center">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-congress-blue tracking-tight animate-fade-in-down">
              La Historia de la Quinta Rocca
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-600 animate-fade-in-up">
              Donde el pasado se encuentra con la educación del futuro
            </p>
          </div>
        </section>

        {/* Sección 1: El Esplendor */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2 animate-fade-in-left">
                <img
                  src="/images/casona-fachada-trasera.avif"
                  alt="La mansión vista desde el parque trasero"
                  className="w-full h-auto rounded-lg transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-congress-cyan animate-fade-in-right">
                  El auge de una mansión de ensueño
                </h2>
                <p className="text-lg leading-relaxed mb-4">
                  La actual sede de la UNaB fue la histórica **Quinta Rocca**, una lujosa casona de veraneo de estilo Tudor, construida en 1921. Fue un símbolo de esplendor, un oasis con jardines de 13 hectáreas y una arquitectura que maravillaba a sus visitantes.
                </p>
                <p className="text-lg leading-relaxed">
                  En su interior, más de una docena de habitaciones, boiserie de roble, y vitraux daban fe de la vida de cuatro generaciones que disfrutaron de sus fiestas y tranquilidad.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección 2: El Abandono */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
              <div className="md:w-1/2 animate-fade-in-right">
                <ImageSlider
                  images={[
                    {
                      src: "https://resizer.glanacion.com/resizer/v2/durante-anos-el-predio-estuvo-en-estado-de-2I64GINC5FHMLE35HR4OGDXRTM.png?auth=8701c2f55e1f072b2ec9c4106cc95019813643bd8eca563b9952ddd69f1b37f0&width=780&height=520&quality=70&smart=true",
                      alt: "Predio en estado de abandono",
                      caption: "El predio deteriorado por años de abandono. Fuente: La Nación",
                    },
                    {
                      src: "https://resizer.glanacion.com/resizer/v2/durante-anos-la-casona-estuvo-abandonada-se-MPNVHQSZIRAI7LZYQFEZZBR2ZA.jpg?auth=a5676788d470ec81e19985f8e82509fe2e41f16f297a296563020d01dad2473a&width=780&height=520&quality=70&smart=true",
                      alt: "Casona abandonada y vandalizada",
                      caption: "La casona, vandalizada y en ruinas. Fuente: La Nación",
                    },
                  ]}
                  interval={5000}
                />
              </div>
              <div className="md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-congress-cyan animate-fade-in-left">
                  El lento declive
                </h2>
                <p className="text-lg leading-relaxed mb-4">
                  Con el paso del tiempo y las crisis, la mansión perdió su brillo. El abandono, los robos y la falta de mantenimiento la dejaron en un estado de ruinas. Los detalles más valiosos, desde picaportes hasta faroles, fueron sustraídos.
                </p>
                <p className="text-lg leading-relaxed">
                  El último habitante, Charly, vivió solo allí por 17 años hasta su fallecimiento en 2006. Un año después, la familia vendió la propiedad al municipio de Almirante Brown, abriendo la puerta a un nuevo capítulo para el predio.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección 3: El Renacimiento */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-congress-cyan animate-fade-in-up">
              Un nuevo amanecer para el Campus
            </h2>
            <div className="w-full">
              <ModernFadeSlider
                images={[
                  {
                    src: "/images/Universidad.webp",
                    alt: "Fachada de la UNaB",
                    caption: "La nueva fachada principal de la UNaB.",
                  },
                  {
                    src: "/images/campus-04.jpg",
                    alt: "Edificio universitario y áreas verdes",
                    caption: "La nueva arquitectura se integra al paisaje.",
                  },
                  {
                    src: "/images/campus-02.jpg",
                    alt: "Ingreso principal y jardines renovados",
                    caption: "Ingreso principal y jardines renovados.",
                  },
                ]}
                interval={4000}
              />
            </div>
            <p className="mt-8 text-lg leading-relaxed animate-fade-in-up max-w-3xl mx-auto">
              Hoy, el predio ha sido revitalizado, transformando el legado de la antigua mansión en un moderno campus universitario. La UNaB trabaja en la recuperación de este valioso patrimonio para proyectar un futuro lleno de oportunidades para la comunidad.
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}