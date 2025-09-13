import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Category, School, Person } from '@mui/icons-material';
import { motion } from "framer-motion";

// Nueva estructura de datos para actividades con hora de inicio y fin
type ActividadCalendar = {
  aula: string;
  titulo: string;
  disertante: string;
  descripcion?: string;
  inicio: string; // 'HH:MM'
  fin: string; // 'HH:MM'
  color: string; // color de fondo
  categoria: string; // Categoría del track
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

// Categorías de tracks del congreso de logística y transporte
const TRACK_CATEGORIES = {
  "LOGÍSTICA": { bg: "#1e40af", text: "#ffffff" }, // azul institucional
  "TRANSPORTE": { bg: "#059669", text: "#ffffff" }, // verde
  "SUPPLY CHAIN": { bg: "#dc2626", text: "#ffffff" }, // rojo
  "TECNOLOGÍA": { bg: "#7c3aed", text: "#ffffff" }, // violeta
  "SOSTENIBILIDAD": { bg: "#ea580c", text: "#ffffff" }, // naranja
  "INNOVACIÓN": { bg: "#0891b2", text: "#ffffff" }, // cyan
  "GESTIÓN": { bg: "#be185d", text: "#ffffff" }, // rosa
  "NETWORKING": { bg: "#374151", text: "#ffffff" }, // gris
} as const;

// Paleta para aulas (más suave para el fondo de las tarjetas)
const AULA_COLORS: Record<
  string,
  { border: string; bg: string; text: string }
> = {
  "Aula Magna": { border: "#2563eb", bg: "#eff6ff", text: "#1e40af" }, // azul UNAB
  "Aula 1": { border: "#0ea5e9", bg: "#f0f9ff", text: "#0369a1" }, // cyan
  "Aula 2": { border: "#f59e42", bg: "#fffbeb", text: "#d97706" }, // naranja
  "Aula 3": { border: "#a21caf", bg: "#fdf4ff", text: "#a21caf" }, // violeta
  "Aula 4": { border: "#22c55e", bg: "#f0fdf4", text: "#16a34a" }, // verde
  "Aula 5": { border: "#dc2626", bg: "#fef2f2", text: "#dc2626" }, // rojo
  "Aula 6": { border: "#7c3aed", bg: "#f5f3ff", text: "#7c3aed" }, // violeta
  "Aula 7": { border: "#059669", bg: "#ecfdf5", text: "#059669" }, // esmeralda
  "Aula 8": { border: "#be185d", bg: "#fdf2f8", text: "#be185d" }, // rosa
};

// Función para generar colores únicos basados en el nombre del disertante
function getDisertanteColor(disertante: string): string {
  // Array de colores para los disertantes
  const colorsPool = [
    "#1e40af", // azul
    "#059669", // verde
    "#dc2626", // rojo
    "#7c3aed", // violeta
    "#ea580c", // naranja
    "#0891b2", // cyan
    "#be185d", // rosa
    "#374151", // gris
    "#16a34a", // verde claro
    "#d97706", // amarillo
    "#a21caf", // magenta
    "#0369a1", // azul claro
    "#b45309", // marrón
    "#15803d", // verde oscuro
    "#7c2d12", // marrón oscuro
  ];
  
  // Crear hash simple del nombre del disertante
  let hash = 0;
  for (let i = 0; i < disertante.length; i++) {
    const char = disertante.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir a 32bit integer
  }
  
  // Usar el hash para seleccionar un color
  const colorIndex = Math.abs(hash) % colorsPool.length;
  return colorsPool[colorIndex];
}

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
            categoria: item.categoria || "LOGÍSTICA", // Default a LOGÍSTICA si no viene del backend
          };
        });
        setActividades(mapped);
        setError(null); // Limpiar error si carga exitosa
      } catch (err) {
        console.error("Error cargando programa:", err);
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
  // Cada fila representa 30 minutos, así que necesitamos calcular cuántos intervalos de 30 min hay
  function getRowSpan(inicio: string, fin: string) {
    const [h1, m1] = inicio.split(":").map(Number);
    const [h2, m2] = fin.split(":").map(Number);
    
    // Convertir a minutos totales desde medianoche
    const inicioMinutos = h1 * 60 + m1;
    const finMinutos = h2 * 60 + m2;
    
    // Calcular la diferencia en minutos y dividir por 30 (cada fila = 30 min)
    const duracionMinutos = finMinutos - inicioMinutos;
    return Math.ceil(duracionMinutos / 30); // Usar ceil para asegurar que cubra todo el tiempo
  }

  // Usar datos reales si existen, si no, usar mock
  const actividadesToShow = actividades ?? [
    {
      aula: "Aula Magna",
      titulo: "Apertura y bienvenida",
      disertante: "Comité Organizador",
      descripcion: "Bienvenida y apertura general del congreso",
      inicio: "10:00",
      fin: "10:30",
      color: "Aula Magna",
      categoria: "NETWORKING",
    },
    {
      aula: "Aula Magna",
      titulo: "Tendencias en Logística 4.0",
      disertante: "Ing. Laura Pérez",
      descripcion: "Automatización y tecnología en la cadena de suministro",
      inicio: "10:30",
      fin: "11:30",
      color: "Aula Magna",
      categoria: "LOGÍSTICA",
    },
    {
      aula: "Aula Magna",
      titulo: "Panel: Desafíos del e-commerce",
      disertante: "Varios Expertos",
      descripcion: "Mesa redonda sobre logística en comercio electrónico",
      inicio: "12:00",
      fin: "13:00",
      color: "Aula Magna",
      categoria: "SUPPLY CHAIN",
    },
    {
      aula: "Aula Magna",
      titulo: "Casos de éxito en supply chain",
      disertante: "Ing. Pablo Ruiz",
      descripcion: "Experiencias reales de optimización logística",
      inicio: "15:00",
      fin: "16:00",
      color: "Aula Magna",
      categoria: "GESTIÓN",
    },
    {
      aula: "Aula 1",
      titulo: "Movilidad urbana sostenible",
      disertante: "Lic. Sofía Ramírez",
      descripcion: "Estrategias para un transporte urbano más limpio",
      inicio: "10:00",
      fin: "11:00",
      color: "Aula 1",
      categoria: "SOSTENIBILIDAD",
    },
    {
      aula: "Aula 1",
      titulo: "Transporte multimodal",
      disertante: "Ing. Diego Fernández", 
      descripcion: "Integración de diferentes medios de transporte",
      inicio: "11:00",
      fin: "12:30",
      color: "Aula 1",
      categoria: "TRANSPORTE",
    },
    {
      aula: "Aula 1",
      titulo: "Vehículos autónomos",
      disertante: "Dr. Javier López",
      descripcion: "El futuro del transporte inteligente",
      inicio: "13:00",
      fin: "14:00",
      color: "Aula 1",
      categoria: "INNOVACIÓN",
    },
    {
      aula: "Aula 2",
      titulo: "Logística inversa",
      disertante: "Ing. Ricardo Sosa",
      descripcion: "Optimización de procesos de retorno y reciclaje",
      inicio: "10:00",
      fin: "11:30",
      color: "Aula 2",
      categoria: "LOGÍSTICA",
    },
    {
      aula: "Aula 2",
      titulo: "Big Data en transporte",
      disertante: "Lic. Paula Castro",
      descripción: "Análisis de datos para optimización logística",
      inicio: "12:00",
      fin: "13:00",
      color: "Aula 2",
      categoria: "TECNOLOGÍA",
    },
    {
      aula: "Aula 3",
      titulo: "Taller: Simulación de flotas",
      disertante: "Ing. Tomás Vera",
      descripcion: "Workshop práctico de optimización de rutas",
      inicio: "10:00",
      fin: "12:00",
      color: "Aula 3",
      categoria: "GESTIÓN",
    },
    {
      aula: "Aula 3",
      titulo: "Tendencias en movilidad eléctrica",
      disertante: "Dra. Lucía Benítez",
      descripcion: "Innovaciones en transporte sustentable",
      inicio: "14:00",
      fin: "15:30",
      color: "Aula 3",
      categoria: "SOSTENIBILIDAD",
    },
    {
      aula: "Aula 4",
      titulo: "Infraestructura inteligente",
      disertante: "Arq. Mariana Díaz",
      descripcion: "Ciudades conectadas y sistemas de transporte",
      inicio: "11:00",
      fin: "12:00",
      color: "Aula 4",
      categoria: "TECNOLOGÍA",
    },
    {
      aula: "Aula 4",
      titulo: "Políticas públicas de transporte",
      disertante: "Lic. Carla Méndez",
      descripcion: "Marco regulatorio y políticas de movilidad",
      inicio: "13:00",
      fin: "14:00",
      color: "Aula 4",
      categoria: "GESTIÓN",
    },
    {
      aula: "Aula 4",
      titulo: "Panel: Mujeres en logística",
      disertante: "Líderes del sector",
      descripcion: "Mesa redonda sobre liderazgo femenino",
      inicio: "16:00",
      fin: "17:00",
      color: "Aula 4",
      categoria: "NETWORKING",
    },
    {
      aula: "Aula 5",
      titulo: "Inteligencia Artificial en Logística",
      disertante: "Dr. Carlos Mendoza",
      descripcion: "Aplicaciones de IA en optimización de rutas",
      inicio: "10:00",
      fin: "11:00",
      color: "Aula 5",
      categoria: "TECNOLOGÍA",
    },
    {
      aula: "Aula 5",
      titulo: "Blockchain en Supply Chain",
      disertante: "Ing. María Santos",
      descripcion: "Trazabilidad y transparencia con blockchain",
      inicio: "14:00",
      fin: "15:00",
      color: "Aula 5",
      categoria: "INNOVACIÓN",
    },
    {
      aula: "Aula 6",
      titulo: "Logística urbana de última milla",
      disertante: "Lic. Roberto González",
      descripcion: "Desafíos y soluciones para entregas urbanas",
      inicio: "11:00",
      fin: "12:30",
      color: "Aula 6",
      categoria: "SUPPLY CHAIN",
    },
    {
      aula: "Aula 6",
      titulo: "Gestión de inventarios Just-in-Time",
      disertante: "Ing. Ana Rodríguez",
      descripcion: "Optimización de inventarios y reducción de costos",
      inicio: "15:00",
      fin: "16:00",
      color: "Aula 6",
      categoria: "GESTIÓN",
    },
    {
      aula: "Aula 7",
      titulo: "Energías renovables en transporte",
      disertante: "Dr. Miguel Torres",
      descripcion: "Transición hacia combustibles limpios",
      inicio: "10:30",
      fin: "12:00",
      color: "Aula 7",
      categoria: "SOSTENIBILIDAD",
    },
    {
      aula: "Aula 7",
      titulo: "Sistemas de transporte inteligente",
      disertante: "Ing. Carmen López",
      descripcion: "IoT y sensores en infraestructura de transporte",
      inicio: "13:30",
      fin: "14:30",
      color: "Aula 7",
      categoria: "TECNOLOGÍA",
    },
    {
      aula: "Aula 8",
      titulo: "Economía circular en logística",
      disertante: "Dra. Isabel Morales",
      descripcion: "Modelos de negocio sostenibles",
      inicio: "11:30",
      fin: "13:00",
      color: "Aula 8",
      categoria: "SOSTENIBILIDAD",
    },
    {
      aula: "Aula 8",
      titulo: "Automatización de almacenes",
      disertante: "Ing. Fernando Silva",
      descripcion: "Robots y sistemas automatizados",
      inicio: "14:30",
      fin: "15:30",
      color: "Aula 8",
      categoria: "INNOVACIÓN",
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
    // Convertir la hora actual a minutos para comparación precisa
    const [h, m] = hora.split(":").map(Number);
    const horaMinutos = h * 60 + m;
    
    // Buscar si hay una actividad que comenzó antes y termina después de la hora actual
    const actividad = actividadesToShow.find((a) => {
      if (a.aula !== aula) return false;
      
      const [h1, m1] = a.inicio.split(":").map(Number);
      const [h2, m2] = a.fin.split(":").map(Number);
      const inicioMinutos = h1 * 60 + m1;
      const finMinutos = h2 * 60 + m2;
      
      // La celda está cubierta si la hora actual está dentro del rango de la actividad
      // pero no es el inicio de la actividad
      return inicioMinutos < horaMinutos && horaMinutos < finMinutos;
    });
    
    return !!actividad;
  }

  // Estado para filtros
  const [filtroCategoria, setFiltroCategoria] = useState<string>("TODOS");
  const [filtroAula, setFiltroAula] = useState<string>("TODAS");

  // Categorías para el filtro (usando TRACK_CATEGORIES)
  const categorias = Object.keys(TRACK_CATEGORIES);

  // Disertantes únicos para el filtro
  const disertantesUnicos = Array.from(new Set(actividadesToShow.map(act => act.disertante))).filter(d => d && d.length > 0);
  const [filtroDisertante, setFiltroDisertante] = useState<string>("TODOS");

  // Filtrar actividades
  const actividadesFiltradas = actividadesToShow.filter(act => {
    const matchCategoria = filtroCategoria === "TODOS" || act.categoria === filtroCategoria;
    const matchAula = filtroAula === "TODAS" || act.aula === filtroAula;
    const matchDisertante = filtroDisertante === "TODOS" || act.disertante === filtroDisertante;
    return matchCategoria && matchAula && matchDisertante;
  });

  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-congress-blue via-congress-blue/90 to-congress-cyan min-h-[40vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
              Agenda_
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto font-light">
              Charlas y actividades por aula • de 10:00 a 18:00 hs
            </p>
            {loading && (
              <div className="text-white/80 mt-6 text-lg">Cargando agenda...</div>
            )}
            {error && <div className="text-red-200 mt-6 bg-red-500/20 p-4 rounded-lg max-w-2xl mx-auto">{error}</div>}
          </motion.div>
        </div>
      </div>

      {/* Filtros Modernos con MUI */}
      <Box sx={{ position: 'sticky', top: 0, zIndex: 40, background: 'transparent', py: 2 }}>
        <Card sx={{ maxWidth: 900, mx: 'auto', boxShadow: 6, borderRadius: 4, background: '#fff', px: { xs: 2, md: 4 }, py: 2 }}>
          <CardContent sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
            {/* Categoría */}
            <FormControl sx={{ minWidth: 180 }} size="small">
              <InputLabel id="categoria-label"><Category sx={{ mr: 1, fontSize: 18 }} />Categoría</InputLabel>
              <Select
                labelId="categoria-label"
                value={filtroCategoria}
                label="Categoría"
                onChange={(e) => setFiltroCategoria(e.target.value)}
                sx={{ borderRadius: 2, fontWeight: 500 }}
              >
                <MenuItem value="TODOS">Todos los tracks</MenuItem>
                {categorias.map(cat => (
                  <MenuItem key={cat} value={cat}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Category sx={{ color: TRACK_CATEGORIES[cat]?.bg, fontSize: 18 }} />
                      {cat}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* Aula */}
            <FormControl sx={{ minWidth: 160 }} size="small">
              <InputLabel id="aula-label"><School sx={{ mr: 1, fontSize: 18 }} />Aula</InputLabel>
              <Select
                labelId="aula-label"
                value={filtroAula}
                label="Aula"
                onChange={(e) => setFiltroAula(e.target.value)}
                sx={{ borderRadius: 2, fontWeight: 500 }}
              >
                <MenuItem value="TODAS">Todas las aulas</MenuItem>
                {AULAS.slice(0, 9).map(aula => (
                  <MenuItem key={aula} value={aula}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <School sx={{ color: AULA_COLORS[aula]?.border, fontSize: 18 }} />
                      {aula}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* Disertante */}
            <Autocomplete
              options={["TODOS", ...disertantesUnicos]}
              value={filtroDisertante}
              onChange={(_, value) => setFiltroDisertante(value || "TODOS")}
              size="small"
              sx={{ minWidth: 200 }}
              renderInput={(params) => (
                <TextField {...params} label={<><Person sx={{ mr: 1, fontSize: 18 }} />Disertante</>} variant="outlined" />
              )}
            />
            {/* Chips de filtros activos */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', ml: 2 }}>
              {filtroCategoria !== "TODOS" && (
                <Chip label={filtroCategoria} color="primary" size="small" sx={{ bgcolor: TRACK_CATEGORIES[filtroCategoria]?.bg, color: '#fff', fontWeight: 500 }} onDelete={() => setFiltroCategoria("TODOS")} />
              )}
              {filtroAula !== "TODAS" && (
                <Chip label={filtroAula} color="secondary" size="small" sx={{ bgcolor: AULA_COLORS[filtroAula]?.border, color: '#fff', fontWeight: 500 }} onDelete={() => setFiltroAula("TODAS")} />
              )}
              {filtroDisertante !== "TODOS" && (
                <Chip label={filtroDisertante} color="default" size="small" sx={{ bgcolor: '#374151', color: '#fff', fontWeight: 500 }} onDelete={() => setFiltroDisertante("TODOS")} />
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Grilla Moderna de Agenda */}
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="w-full px-4">
          <div className="w-full max-w-full mx-auto">
            
            {/* Grilla Principal - Usando tabla para mejor control de rowspan */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full">
              <div className="w-full">
                <table className="w-full table-fixed"
                       style={{ minWidth: 'auto' }}>
                  
                  {/* Header de aulas */}
                  <thead>
                    <tr className="bg-gradient-to-r from-congress-blue to-congress-cyan text-white">
                      <th className="w-32 p-4 font-bold text-center border-r border-white/20">
                        Horario
                      </th>
                      {AULAS.slice(0, 9).map((aula) => (
                        <th key={aula} className="p-4 font-bold text-center border-r border-white/20 last:border-r-0 text-sm">
                          {aula}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* Filas de horarios */}
                  <tbody>
                    {HORARIOS.map((hora, rowIdx) => (
                      <tr key={hora} className="border-b border-gray-200 min-h-[80px]">
                        {/* Columna de horario */}
                        <td className="w-32 bg-gray-50 p-4 text-center border-r border-gray-200 align-middle">
                          <div className="text-center">
                            <div className="text-xl font-bold text-congress-blue font-mono">
                              {hora}
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">
                              GMT -3
                            </div>
                          </div>
                        </td>

                        {/* Columnas de aulas */}
                        {AULAS.slice(0, 9).map((aula) => {
                          if (isCellCovered(aula, hora)) return null;
                          
                          const actividad = grid[aula] && grid[aula][hora];
                          if (actividad && actividadesFiltradas.includes(actividad)) {
                            const rowSpan = getRowSpan(actividad.inicio, actividad.fin);
                            const trackColor = TRACK_CATEGORIES[actividad.categoria as keyof typeof TRACK_CATEGORIES];
                            const aulaColor = AULA_COLORS[actividad.color] || AULA_COLORS["Aula Magna"];
                            const disertanteColor = getDisertanteColor(actividad.disertante);
                            
                            return (
                              <td 
                                key={aula + hora}
                                rowSpan={rowSpan}
                                className="border-r border-gray-200 p-2 align-top"
                                style={{ 
                                  minHeight: `${rowSpan * 80}px`,
                                }}
                              >
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.3 }}
                                  className="h-full"
                                >
                                  <div className="w-full h-full bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-3 border-l-4 hover:scale-[1.02] cursor-pointer group"
                                       style={{ 
                                         borderLeftColor: disertanteColor,
                                         minHeight: `${Math.max(rowSpan * 76, 100)}px`,
                                         boxShadow: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), -4px 0 6px -1px ${disertanteColor}20`
                                       }}>
                                    
                                    {/* Categoría Tag */}
                                    <div className="flex items-center justify-between mb-2">
                                      <span 
                                        className="px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                                        style={{ 
                                          backgroundColor: trackColor?.bg || aulaColor.border,
                                          color: trackColor?.text || 'white'
                                        }}
                                      >
                                        {actividad.categoria}
                                      </span>
                                      <span className="text-xs text-gray-500 font-mono">
                                        {actividad.inicio} - {actividad.fin}
                                      </span>
                                    </div>

                                    {/* Título */}
                                    <h3 className="font-bold text-sm text-gray-900 mb-2 group-hover:text-congress-blue transition-colors overflow-hidden leading-tight" 
                                        style={{ 
                                          display: '-webkit-box',
                                          WebkitLineClamp: 2,
                                          WebkitBoxOrient: 'vertical'
                                        }}>
                                      {actividad.titulo}
                                    </h3>

                                    {/* Speaker */}
                                    <p className="text-xs font-semibold text-gray-700 mb-1 truncate">
                                      {actividad.disertante}
                                    </p>

                                    {/* Descripción */}
                                    {actividad.descripcion && (
                                      <p className="text-xs text-gray-600 overflow-hidden leading-tight"
                                         style={{ 
                                           display: '-webkit-box',
                                           WebkitLineClamp: rowSpan > 2 ? 3 : 2,
                                           WebkitBoxOrient: 'vertical'
                                         }}>
                                        {actividad.descripcion}
                                      </p>
                                    )}
                                  </div>
                                </motion.div>
                              </td>
                            );
                          } else {
                            return (
                              <td key={aula + hora} className="border-r border-gray-200 p-3 text-center align-middle">
                                <span className="text-gray-300 text-sm">-</span>
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
          </div>
        </div>
      </div>

      {/* ...el resto del código permanece igual... */}
    </>
  );
}
