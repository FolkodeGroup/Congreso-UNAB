import { useState, useEffect } from "react";

// Nueva estructura de datos para actividades con hora de inicio y fin
type ActividadCalendar = {
  aula: string;
  titulo: string;
  disertante: string;
  descripcion?: string;
  inicio: string; // 'HH:MM'
  fin: string; // 'HH:MM'
  color: string; // color de fondo
};

// Aulas de ejemplo (incluyendo Aula Magna y 4 aulas)
const AULAS = [
  "Aula Magna",
  "Aula 1",
  "Aula 2",
  "Aula 3",
  "Aula 4",
  "Aula 5",
  "Aula 6",
  "Aula 7",
  "Aula 8",
  "Aula 9",
  "Aula 10",
  "Aula 11",
  "Aula 12",
  "Aula 13",
  "Aula 14",
];

// Generar horarios fijos cada 30 minutos de 10:00 a 19:00
function getHorariosFijos() {
  const horarios: string[] = [];
  let h = 10,
    m = 0;
  while (h < 19 || (h === 19 && m === 0)) {
    const hora = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    horarios.push(hora);
    m += 30;
    if (m === 60) {
      m = 0;
      h++;
    }
  }
  return horarios;
}

// Paleta institucional (ejemplo, puedes ajustar los valores a tu branding)
const AULA_COLORS: Record<
  string,
  { border: string; bg: string; text: string }
> = {
  "Aula Magna": { border: "#2563eb", bg: "#eaf1fb", text: "#2563eb" }, // azul UNAB
  "Aula 1": { border: "#0ea5e9", bg: "#e0f7fa", text: "#0ea5e9" }, // cyan
  "Aula 2": { border: "#f59e42", bg: "#fff7e6", text: "#b45309" }, // naranja
  "Aula 3": { border: "#a21caf", bg: "#f3e8ff", text: "#a21caf" }, // violeta
  "Aula 4": { border: "#22c55e", bg: "#e7fbe9", text: "#15803d" }, // verde
};

// Estado para actividades y carga
export default function Programa() {
  const [actividades, setActividades] = useState<ActividadCalendar[] | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch de la API de Django
  useEffect(() => {
    const fetchPrograma = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
        const response = await fetch(`${apiUrl}/api/programa/`);
        if (!response.ok)
          throw new Error("No se pudo cargar la agenda desde el backend.");
        const data = await response.json();
        // Mapear los datos del backend al formato visual
        const mapped: ActividadCalendar[] = data.map((item: any) => {
          // Extraer nombre del disertante si es objeto
          let disertante = "";
          if (typeof item.disertante === "string") {
            disertante = item.disertante;
          } else if (item.disertante && typeof item.disertante === "object") {
            disertante = item.disertante.nombre || "";
          }
          // Usar el campo correcto para aula
          const aula = item.aula || item.sala || "Aula Magna";
          return {
            aula,
            titulo: item.titulo,
            disertante,
            descripcion: item.descripcion || "",
            inicio: item.hora_inicio.substring(0, 5),
            fin: item.hora_fin.substring(0, 5),
            color: AULA_COLORS[aula] ? aula : "Aula Magna",
          };
        });
        setActividades(mapped);
      } catch (err) {
        setError(
          "No se pudo cargar la agenda desde el backend. Mostrando ejemplo.",
        );
        setActividades(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograma();
  }, []);

  // Para calcular el número de filas que ocupa una actividad
  function getRowSpan(inicio: string, fin: string) {
    const [h1, m1] = inicio.split(":").map(Number);
    const [h2, m2] = fin.split(":").map(Number);
    return h2 + m2 / 60 - (h1 + m1 / 60);
  }

  // Usar datos reales si existen, si no, usar mock
  const actividadesToShow = actividades ?? [
    {
      aula: "Aula Magna",
      titulo: "Apertura y bienvenida",
      disertante: "Comité Organizador",
      descripcion: "Bienvenida y apertura general",
      inicio: "10:00",
      fin: "10:30",
      color: "Aula Magna",
    },
    {
      aula: "Aula Magna",
      titulo: "Tendencias en Logística 4.0",
      disertante: "Ing. Laura Pérez",
      inicio: "10:30",
      fin: "11:30",
      color: "Aula Magna",
    },
    {
      aula: "Aula Magna",
      titulo: "Panel: Desafíos del e-commerce",
      disertante: "Varios",
      inicio: "12:00",
      fin: "13:00",
      color: "Aula Magna",
    },
    {
      aula: "Aula Magna",
      titulo: "Casos de éxito en supply chain",
      disertante: "Ing. Pablo Ruiz",
      inicio: "15:00",
      fin: "16:00",
      color: "Aula Magna",
    },
    {
      aula: "Aula 1",
      titulo: "Movilidad urbana sostenible",
      disertante: "Lic. Sofía Ramírez",
      inicio: "10:00",
      fin: "11:00",
      color: "Aula 1",
    },
    {
      aula: "Aula 1",
      titulo: "Transporte multimodal",
      disertante: "Ing. Diego Fernández",
      inicio: "11:00",
      fin: "12:30",
      color: "Aula 1",
    },
    {
      aula: "Aula 1",
      titulo: "Vehículos autónomos",
      disertante: "Dr. Javier López",
      inicio: "13:00",
      fin: "14:00",
      color: "Aula 1",
    },
    {
      aula: "Aula 2",
      titulo: "Logística inversa",
      disertante: "Ing. Ricardo Sosa",
      inicio: "10:00",
      fin: "11:30",
      color: "Aula 2",
    },
    {
      aula: "Aula 2",
      titulo: "Big Data en transporte",
      disertante: "Lic. Paula Castro",
      inicio: "12:00",
      fin: "13:00",
      color: "Aula 2",
    },
    {
      aula: "Aula 3",
      titulo: "Taller: Simulación de flotas",
      disertante: "Ing. Tomás Vera",
      inicio: "10:00",
      fin: "12:00",
      color: "Aula 3",
    },
    {
      aula: "Aula 3",
      titulo: "Tendencias en movilidad eléctrica",
      disertante: "Dra. Lucía Benítez",
      inicio: "14:00",
      fin: "15:30",
      color: "Aula 3",
    },
    {
      aula: "Aula 4",
      titulo: "Infraestructura inteligente",
      disertante: "Arq. Mariana Díaz",
      inicio: "11:00",
      fin: "12:00",
      color: "Aula 4",
    },
    {
      aula: "Aula 4",
      titulo: "Políticas públicas de transporte",
      disertante: "Lic. Carla Méndez",
      inicio: "13:00",
      fin: "14:00",
      color: "Aula 4",
    },
    {
      aula: "Aula 4",
      titulo: "Panel: Mujeres en logística",
      disertante: "Varios",
      inicio: "16:00",
      fin: "17:00",
      color: "Aula 4",
    },
  ];

  // Usar horarios fijos cada 30 minutos de 10:00 a 19:00
  const HORARIOS = getHorariosFijos();

  // Mapeo de actividades por aula y hora para renderizado
  const grid: { [aula: string]: { [hora: string]: ActividadCalendar | null } } =
    {};
  for (const aula of AULAS) {
    grid[aula] = {};
    for (const hora of HORARIOS) {
      grid[aula][hora] = null;
    }
  }
  for (const act of actividadesToShow) {
    // Solo agregar si el aula está definida en la grilla
    if (AULAS.includes(act.aula)) {
      grid[act.aula][act.inicio] = act;
    }
  }

  // Para saber si una celda debe renderizarse (solo la de inicio de actividad)
  function isStartOfActivity(aula: string, hora: string) {
    return grid[aula][hora] !== null;
  }

  // Para saber si una celda está ocupada por una actividad que empezó antes
  function isCellCovered(aula: string, hora: string) {
    // Solo cubre si la celda está estrictamente dentro del rango de una actividad previa
    // Es decir, si la actividad empieza antes y termina después del horario actual
    const actividad = actividadesToShow.find(
      (a) => a.aula === aula && a.inicio < hora && a.fin > hora,
    );
    return !!actividad;
  }

  return (
    <>
      <div className="container mx-auto px-2 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Agenda del Congreso
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Charlas y actividades por aula, de 10:00 a 18:00 hs.
          </p>
          {loading && (
            <div className="text-congress-cyan mt-4">Cargando agenda...</div>
          )}
          {error && <div className="text-red-600 mt-4">{error}</div>}
        </div>

        {/* Grilla tipo calendario */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-white">
            <thead>
              <tr>
                <th className="bg-gray-100 px-2 py-2 text-center font-bold border-b border-r border-gray-300 w-20">
                  Horario
                </th>
                {AULAS.map((aula) => (
                  <th
                    key={aula}
                    className="bg-gray-100 px-2 py-2 text-center font-bold border-b border-r border-gray-300"
                  >
                    {aula}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HORARIOS.map((hora, rowIdx) => (
                <tr key={hora}>
                  <td className="border-b border-r border-gray-300 text-center align-middle font-mono text-congress-cyan text-lg bg-gray-50">
                    {hora}
                  </td>
                  {AULAS.map((aula) => {
                    // Si la celda está cubierta por una actividad previa, no se renderiza
                    if (isCellCovered(aula, hora)) return null;
                    const actividad = grid[aula][hora];
                    if (actividad) {
                      // Calcular cuántas filas ocupa
                      const rowSpan = Math.round(
                        getRowSpan(actividad.inicio, actividad.fin),
                      );
                      const color =
                        AULA_COLORS[actividad.color] ||
                        AULA_COLORS["Auditorio"];
                      return (
                        <td
                          key={aula + hora}
                          rowSpan={rowSpan}
                          className="border-b border-r border-gray-300 align-top p-0"
                          style={{
                            background: color.bg,
                            minWidth: 180,
                            maxWidth: 260,
                          }}
                        >
                          <div
                            className="h-full w-full p-0 flex flex-col justify-center rounded-md shadow-sm border-l-8"
                            style={{ borderColor: color.border }}
                          >
                            <div
                              className="font-bold text-base mb-1 px-3 pt-2"
                              style={{ color: color.text }}
                            >
                              {actividad.titulo}
                            </div>
                            <div
                              className="text-xs font-semibold mb-1 px-3 pb-1"
                              style={{ color: color.text }}
                            >
                              {actividad.disertante}
                            </div>
                            {actividad.descripcion && (
                              <div
                                className="text-xs px-3 pb-2 text-gray-600 italic truncate"
                                title={actividad.descripcion}
                              >
                                {actividad.descripcion}
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    } else {
                      return (
                        <td
                          key={aula + hora}
                          className="border-b border-r border-gray-300 bg-white min-w-[180px] max-w-[260px] text-center text-gray-300"
                        >
                          -
                        </td>
                      );
                    }
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Temas del congreso */}
      <section className="py-16 bg-section">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto justify-items-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              Temas del Congreso
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-congress-cyan mb-4">
                  Logística
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start text-white">
                    <span className="w-2 h-2 bg-congress-cyan rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Gestión de cadenas de suministro
                  </li>
                  <li className="flex items-start text-white">
                    <span className="w-2 h-2 bg-congress-cyan rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Logística 4.0 y transformación digital
                  </li>
                  <li className="flex items-start text-white">
                    <span className="w-2 h-2 bg-congress-cyan rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Automatización de almacenes
                  </li>
                  <li className="flex items-start text-white">
                    <span className="w-2 h-2 bg-congress-cyan rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Sostenibilidad en la logística
                  </li>
                  <li className="flex items-start text-white">
                    <span className="w-2 h-2 bg-congress-cyan rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    E-commerce y última milla
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-congress-cyan mb-4">
                  Transporte
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start text-white">
                    <span className="w-2 h-2 bg-congress-cyan rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Movilidad urbana sostenible
                  </li>
                  <li className="flex items-start text-white">
                    <span className="w-2 h-2 bg-congress-cyan rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Transporte multimodal
                  </li>
                  <li className="flex items-start text-white">
                    <span className="w-2 h-2 bg-congress-cyan rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Vehículos autónomos
                  </li>
                  <li className="flex items-start text-white">
                    <span className="w-2 h-2 bg-congress-cyan rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Infraestructura inteligente
                  </li>
                  <li className="flex items-start text-white">
                    <span className="w-2 h-2 bg-congress-cyan rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Políticas públicas de transporte
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
