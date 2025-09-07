export type LogoItem = { src: string; alt: string; heightClass?: string };

// Default set for other carousels if none provided
export const DEFAULT_LOGOS: LogoItem[] = [
  { src: "/images/logos/AERONOVA.jpg", alt: "Aeronova", heightClass: "h-14" },
  { src: "/images/logos/ARLOG.png", alt: "ARLOG", heightClass: "h-14" },
  { src: "/images/logos/CHAGA.png", alt: "CHAGA", heightClass: "h-16" },
  { src: "/images/logos/CITYONE.png", alt: "CityOne", heightClass: "h-14" },
  { src: "/images/logos/CONWORK.jpg", alt: "Conwork", heightClass: "h-14" },
  { src: "/images/logos/ELECE-LOGISTICA.png", alt: "Logística E-LECE", heightClass: "h-14" },
  { src: "/images/logos/ELECTRITRUCK.jpeg", alt: "ElectriTruck", heightClass: "h-14" },
  { src: "/images/logos/ESCUELA-CHOFERES.png", alt: "Escuela de Choferes", heightClass: "h-12" },
  { src: "/images/logos/ETRUCK.png", alt: "eTruck", heightClass: "h-14" },
  { src: "/images/logos/GLI.jpg", alt: "GLI", heightClass: "h-16" },
  { src: "/images/logos/GRUAS-GOLISANO.png", alt: "Gruas Golisano", heightClass: "h-14" },
  { src: "/images/logos/KMD.png", alt: "KMD Logística", heightClass: "h-14" },
];

// First carousel explicit set (user-provided)
export const FIRST_CAROUSEL_LOGOS: LogoItem[] = [
  { src: "/images/logos/ELECTRITRUCK.jpeg", alt: "ElectriTruck", heightClass: "h-14" },
  { src: "/images/logos/ESCUELA-CHOFERES.png", alt: "Escuela de Choferes", heightClass: "h-12" },
  { src: "/images/logos/ETRUCK.png", alt: "eTruck", heightClass: "h-14" },
  { src: "/images/logos/GLI.jpg", alt: "GLI", heightClass: "h-16" },
  { src: "/images/logos/GRUAS-GOLISANO.png", alt: "Gruas Golisano", heightClass: "h-14" },
  { src: "/images/logos/KMD.png", alt: "KMD Logística", heightClass: "h-14" },
  { src: "/images/logos/AERONOVA.jpg", alt: "Aeronova", heightClass: "h-14" },
  { src: "/images/logos/ARLOG.png", alt: "ARLOG", heightClass: "h-14" },
  { src: "/images/logos/CHAGA.png", alt: "CHAGA", heightClass: "h-16" },
  { src: "/images/logos/CITYONE.png", alt: "CityOne", heightClass: "h-14" },
  { src: "/images/logos/CONWORK.jpg", alt: "Conwork", heightClass: "h-14" },
  { src: "/images/logos/ELECE-LOGISTICA.png", alt: "Logística E-LECE", heightClass: "h-18" },
];

// Second carousel explicit set (user-provided)
export const SECOND_CAROUSEL_LOGOS: LogoItem[] = [
  { src: "/images/logos/NUCLEO-LOGISTICO.jpeg", alt: "Núcleo Logístico", heightClass: "h-16" },
  { src: "/images/logos/NYG-TRANSPORTES.PNG", alt: "N&G Transportes", heightClass: "h-16" },
  { src: "/images/logos/PERFORMANCE-LUBE.png", alt: "Performance Lube", heightClass: "h-14" },
  { src: "/images/logos/RASTA.png", alt: "Rasta", heightClass: "h-14" },
  { src: "/images/logos/RED-LOGISTICA.webp", alt: "Red Logística", heightClass: "h-14" },
  { src: "/images/logos/RED-PARQUES.png", alt: "Red Parques Digital", heightClass: "h-12" },
  { src: "/images/logos/SHIAFFER.png", alt: "Shiaffer", heightClass: "h-10" },
  { src: "/images/logos/KPI-CONSULTING.png", alt: "KPI Consulting", heightClass: "h-16" },
  { src: "/images/logos/LA-POSTAL.png", alt: "La Postal", heightClass: "h-12" },
  { src: "/images/logos/LOGISTICA-GARPIC.png", alt: "Logística Garpic", heightClass: "h-16" },
  { src: "/images/logos/LOGO-CARGO.png", alt: "Cargo", heightClass: "h-10" },
  { src: "/images/logos/MUVON.png", alt: "Muvon", heightClass: "h-14" },
  { src: "/images/logos/Folkode_Group.webp", alt: "Folkode Group", heightClass: "h-14" },
];

// Third carousel explicit set (first 12 of provided)
export const THIRD_CAROUSEL_LOGOS: LogoItem[] = [
  { src: "/images/logos/TRADEN.png", alt: "Traden", heightClass: "h-16" },
  { src: "/images/logos/TRANSPORTE-DOMINGUEZ.png", alt: "Transporte Dominguez", heightClass: "h-14" },
  { src: "/images/logos/UNLAM.png", alt: "UNLaM", heightClass: "h-16" },
  { src: "/images/logos/UNLP.png", alt: "UNLP", heightClass: "h-14" },
  { src: "/images/logos/UNLZ.png", alt: "UNLZ", heightClass: "h-14" },
  { src: "/images/logos/UPE.png", alt: "UPE", heightClass: "h-14" },
  { src: "/images/logos/UTN.png", alt: "UTN", heightClass: "h-14" },
  { src: "/images/logos/VDM-LOGISTICS.jpg", alt: "VDM Logistics", heightClass: "h-12" },
  { src: "/images/logos/VIMA.png", alt: "VIMA", heightClass: "h-14" },
  { src: "/images/logos/VOS.jpeg", alt: "VOS", heightClass: "h-14" },
  { src: "/images/logos/XPERTS.jpeg", alt: "Xperts", heightClass: "h-14" },
  { src: "/images/logos/STARGPS.png", alt: "StarGPS", heightClass: "h-12" },
];

export function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}