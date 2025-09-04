import React from "react";
import ImageSlider from "@/components/ImageSlider";
import ModernFadeSlider from "@/components/ModernFadeSlider";
import Layout from "@/components/Layout";

export default function HistoriaCampus() {
  return (
    <Layout>
      <main className="min-h-screen font-sans antialiased text-gray-800">
        {/* Sección de Encabezado con animaciones */}
        <section className="bg-white py-16 md:py-24 text-center">
          <div className="container mx-auto px-4 max-w-4xl animate-fade-in-down">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-congress-blue tracking-tight">
              Historia del Predio y la Universidad
            </h1>
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
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <figcaption className="text-sm text-gray-600 text-center mt-2">La mansión vista desde el parque trasero. Fuente: La Nación</figcaption>
              </div>
              <div className="md:w-1/2 animate-fade-in-right">
                <p className="text-lg leading-relaxed mb-4">
                  La actual sede de la Universidad Nacional Guillermo Brown (UNaB) se encuentra en la histórica Quinta Rocca, una casona de verano de estilo Tudor construida en 1921 por Luisa Rocca para su hija María Concepción, quien necesitaba "tomar aire puro" por recomendación médica. La mansión, famosa por su lujo y esplendor entre las décadas de 1930 y 1950, fue parte de un predio de 13 hectáreas, el mayor pulmón verde de Almirante Brown.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  Durante su época dorada, la quinta llegó a tener decenas de empleados: caseros, cocineras, mucamas, niñeras y peones que cuidaban el parque y la casa. El predio contaba con caminos de conchilla, un molino, un patio español con fuente de mármol de Carrara, horno de barro, laguna artificial, pérgola, pileta de mármol y un campanario de 20 metros. La mansión tenía más de una docena de habitaciones, siete baños, boiserie de roble, vitraux, heráldicas y hasta un ascensor instalado en 1946.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección 2: Galería de fotos del pasado con el formato de la Sección 1 */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-congress-cyan animate-fade-in-up text-center">
              Un vistazo a la historia
            </h2>
            <div className="flex flex-col md:flex-row gap-12 items-center">
              {/* Slider de fotos a la izquierda */}
              <div className="md:w-1/2 animate-fade-in-left">
                <ImageSlider
                  images={[
                    {
                      src: "https://resizer.glanacion.com/resizer/v2/la-mansion-fue-construida-en-OJPMZV2FQFHF3ISZKABNT7QGPM.png?auth=50c51a5acba791784434967e8d20ed69f30177a12351c10c4d6c8ca9769f7c6e&width=780&height=520&quality=70&smart=true",
                      alt: "La mansión fue construida en 1921",
                      caption: "La mansión fue construida en 1921. Fuente: La Nación"
                    },
                    {
                      src: "https://resizer.glanacion.com/resizer/v2/la-casona-tiene-100-anos-y-tiene-una-torre-estilo-JTHGIKZLA5CTZOKCMT42RF46KQ.png?auth=684ec6564f168164864c9b43b9c37ae652cc218e50b74a19a2acac60ae75d27a&width=780&height=520&quality=70&smart=true",
                      alt: "Torre campanario de la casona",
                      caption: "Torre campanario de la casona. Fuente: La Nación"
                    },
                    {
                      src: "https://resizer.glanacion.com/resizer/v2/la-casa-tiene-un-marcado-MHWKCYMWCZDKDAIQTMMJCKORY4.png?auth=929f9183a6970c7be3ba2dd03237546c245c1a4f3348c1eb946fab30699f3cb7&width=780&height=520&quality=70&smart=true",
                      alt: "Eclecticismo arquitectónico de la casona",
                      caption: "Eclecticismo arquitectónico de la casona. Fuente: La Nación"
                    },
                    {
                      src: "https://resizer.glanacion.com/resizer/v2/el-parque-de-adelante-tenia-una-laguna-RKJ53OHNUZHEPBYD4JSWPZ7XTA.png?auth=8802dc68d3dd75c05e05ab2a06b900c01742b94e95e2253e0fbb278f9a2975ca&width=780&height=520&quality=70&smart=true",
                      alt: "Laguna artificial en el parque delantero",
                      caption: "Laguna artificial en el parque delantero. Fuente: La Nación"
                    },
                    {
                      src: "https://resizer.glanacion.com/resizer/v2/en-la-laguna-artificial-habia-un-bote-de-EJWUO5QFDVHT5NAWRUFCUVT55M.png?auth=eb694e6e235b0382fdc51609ffa1413bd5294cda179b1ebda72b0d341cee6c5b&width=780&height=520&quality=70&smart=true",
                      alt: "Bote de madera en la laguna artificial",
                      caption: "Bote de madera en la laguna artificial. Fuente: La Nación"
                    },
                    {
                      src: "https://resizer.glanacion.com/resizer/v2/el-interior-de-la-mansion-esta-recubierto-con-TLLB4USNERHQZOJJUH7CAIUV2U.jpg?auth=52add282c02ea135a494b3d0f47b3c9ecd46a1c4f0df593b3380d8a532e80424&width=780&height=520&quality=70&smart=true",
                      alt: "Interior de la mansión con boiserie",
                      caption: "Interior de la mansión con boiserie. Fuente: La Nación"
                    }
                  ]}
                  interval={4000}
                />
              </div>
              {/* Texto a la derecha */}
              <div className="md:w-1/2 animate-fade-in-right">
                <p className="text-lg leading-relaxed mb-4">
                  Las fiestas familiares, los paseos en bote por la laguna, los baños en la pileta y las noches en la terraza bajo las estrellas marcaron la vida de cuatro generaciones. Incluso, en el estanque había peces de la familia de las pirañas, a los que alimentaban con carne, y en el jardín sevillano se celebraban reuniones multitudinarias.
                </p>
                <p className="text-lg leading-relaxed">
                  Con el paso de los años y las crisis, la mansión fue perdiendo su esplendor. El abandono, los robos y la falta de mantenimiento la dejaron en ruinas: se llevaron picaportes, balaustres, faroles y hasta los angelitos de la fuente. El último habitante, Charly, vivió solo allí durante 17 años hasta su fallecimiento en 2006. Finalmente, en 2007 la familia vendió la propiedad al municipio de Almirante Brown, que la destinó a la creación de la universidad.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sección 3: Imágenes de Abandono y Renacimiento */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-congress-cyan animate-fade-in-up">
              El lento declive y el renacimiento
            </h2>
            <div className="flex flex-col md:flex-row gap-4 my-2 items-start justify-center animate-fade-in-up">
              <figure className="flex flex-col items-center w-full md:w-1/2">
                <img src="https://resizer.glanacion.com/resizer/v2/durante-anos-el-predio-estuvo-en-estado-de-2I64GINC5FHMLE35HR4OGDXRTM.png?auth=8701c2f55e1f072b2ec9c4106cc95019813643bd8eca563b9952ddd69f1b37f0&width=780&height=520&quality=70&smart=true" alt="Predio en estado de abandono" className="rounded shadow-lg w-full" />
                <figcaption className="text-sm text-gray-600 text-center mt-1">Predio en estado de abandono. Fuente: La Nación</figcaption>
              </figure>
              <figure className="flex flex-col items-center w-full md:w-1/2">
                <img src="https://resizer.glanacion.com/resizer/v2/durante-anos-la-casona-estuvo-abandonada-se-MPNVHQSZIRAI7LZYQFEZZBR2ZA.jpg?auth=a5676788d470ec81e19985f8e82509fe2e41f16f297a296563020d01dad2473a&width=780&height=520&quality=70&smart=true" alt="Casona abandonada y vandalizada" className="rounded shadow-lg w-full" />
                <figcaption className="text-sm text-gray-600 text-center mt-1">Casona abandonada y vandalizada. Fuente: La Nación</figcaption>
              </figure>
            </div>
            <p className="mt-8 text-lg leading-relaxed animate-fade-in-up max-w-3xl mx-auto">
              Hoy, la UNaB trabaja en la recuperación y puesta en valor de este patrimonio histórico, renovando su legado como espacio de educación y cultura para la comunidad.
            </p>
          </div>
        </section>

        {/* Sección 4: El predio en la actualidad */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-congress-cyan animate-fade-in-up">
              El predio en la actualidad
            </h2>
            <div className="w-full animate-fade-in-up">
              <ModernFadeSlider
                images={[
                  {
                    src: "/images/campus-01.jpg",
                    alt: "Vista aérea del campus actual UNaB",
                    caption: "Vista aérea del campus actual UNaB"
                  },
                  {
                    src: "/images/campus-02.jpg",
                    alt: "Ingreso principal y jardines renovados",
                    caption: "Ingreso principal y jardines renovados"
                  },
                  {
                    src: "https://resizer.glanacion.com/resizer/v2/la-casa-con-sus-edificios-linderos-Y6462723WZFJBL4P77W2W5QYKM.jpg?auth=a147e4b971c26b863765104d4f7965076646872b253b53a06716075908b98129&width=780&height=520&quality=70&smart=true",
                    alt: "Edificio universitario y áreas verdes",
                    caption: "Edificio universitario y áreas verdes. Fuente: La Nación"
                  },
                  {
                    src: "/images/Universidad.webp",
                    alt: "Fachada de la UNaB",
                    caption: "Fachada de la UNaB"
                  },
                  {
                    src: "/images/Universidad2.webp",
                    alt: "Otra vista del campus y la casona",
                    caption: "Otra vista del campus y la casona"
                  }
                ]}
                interval={2000}
              />
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}