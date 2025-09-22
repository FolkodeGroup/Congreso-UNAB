export type LogoItem = { src: string; alt: string; heightClass?: string };

// The main list of all company logos, sorted alphabetically.
// This is the single source of truth for all logos.
export const ALL_LOGOS: LogoItem[] = [
  { src: "/images/logos/AERONOVA.jpg", alt: "Aeronova", heightClass: "h-12" },
  { src: "/images/logos/Agencia-Sol.jpeg", alt: "Agencia Sol", heightClass: "h-12" },
  { src: "/images/logos/AlmiranteBrown.png", alt: "Almirante Brown", heightClass: "h-12" },
  { src: "/images/logos/ARLOG.png", alt: "ARLOG", heightClass: "h-16" },
  { src: "/images/logos/LOGO-CARGO.png", alt: "Cargo", heightClass: "h-12" },
  { src: "/images/logos/CHAGA.png", alt: "CHAGA", heightClass: "h-14" },
  { src: "/images/logos/CITYONE.png", alt: "CityOne", heightClass: "h-12" },
  { src: "/images/logos/CONWORK.jpg", alt: "Conwork", heightClass: "h-12" },
  { src: "/images/logos/DronesVIP.png", alt: "DronesVIP", heightClass: "h-12" },
  { src: "/images/logos/EAL-GREEN.png", alt: "EAL Green", heightClass: "h-12" },
  { src: "/images/logos/ETRUCK.png", alt: "eTruck", heightClass: "h-12" },
  { src: "/images/logos/ELECTRITRUCK.jpeg", alt: "ElectriTruck", heightClass: "h-12" },
  { src: "/images/logos/ESCUELA-CHOFERES.png", alt: "Escuela de Choferes", heightClass: "h-14" },
  { src: "/images/logos/Folkode_Group.webp", alt: "Folkode Group", heightClass: "h-12" },
  { src: "/images/logos/GENBA-KAIZEN.jpeg", alt: "Genba Kaizen", heightClass: "h-20" },
  { src: "/images/logos/GLI.jpg", alt: "GLI", heightClass: "h-16" },
  { src: "/images/logos/GRUAS-GOLISANO.png", alt: "Gruas Golisano", heightClass: "h-16" },
  { src: "/images/logos/ICI.png", alt: "ICI", heightClass: "h-14" },
  { src: "/images/logos/ISDYT-136.jpeg", alt: "ISDYT 136", heightClass: "h-12" },
  { src: "/images/logos/KMD.png", alt: "KMD Logística", heightClass: "h-12" },
  { src: "/images/logos/Ksigma.png", alt: "Ksigma", heightClass: "h-12" },
  { src: "/images/logos/KPI-CONSULTING.png", alt: "KPI Consulting", heightClass: "h-16" },
  { src: "/images/logos/LA-POSTAL.png", alt: "La Postal", heightClass: "h-12" },
  { src: "/images/logos/ELECE-LOGISTICA.png", alt: "Logística E-LECE", heightClass: "h-14" },
  { src: "/images/logos/LOGISTICA-GARPIC.png", alt: "Logística Garpic", heightClass: "h-16" },
  { src: "/images/logos/M-RRHH.jpeg", alt: "M-RRHH", heightClass: "h-12" },
  { src: "/images/logos/MINISCENICS.jpeg", alt: "Miniscenics", heightClass: "h-14" },
  { src: "/images/logos/MUVON.png", alt: "Muvon", heightClass: "h-12" },
  { src: "/images/logos/NYG-TRANSPORTES.PNG", alt: "N&G Transportes", heightClass: "h-24" },
  { src: "/images/logos/NUCLEO-LOGISTICO.jpeg", alt: "Núcleo Logístico", heightClass: "h-20" },
  { src: "/images/logos/OCA.png", alt: "OCA", heightClass: "h-14" },
  { src: "/images/logos/PERFORMANCE-LUBE.png", alt: "Performance Lube", heightClass: "h-14" },
  { src: "/images/logos/PYB.jpg", alt: "PYB", heightClass: "h-24" },
  { src: "/images/logos/RASTA.png", alt: "Rasta", heightClass: "h-12" },
  { src: "/images/logos/RED-LOGISTICA.webp", alt: "Red Logística", heightClass: "h-14" },
  { src: "/images/logos/RED-PARQUES.png", alt: "Red Parques Digital", heightClass: "h-12" },
  { src: "/images/logos/SHIAFFER.png", alt: "Shiaffer", heightClass: "h-12" },
  { src: "/images/logos/sipab.png", alt: "Sipab", heightClass: "h-14" },
  { src: "/images/logos/sla.png", alt: "SLA", heightClass: "h-14" },
  { src: "/images/logos/SOTO.jpeg", alt: "SOTO", heightClass: "h-12" },
  { src: "/images/logos/STARGPS.png", alt: "StarGPS", heightClass: "h-12" },
  { src: "/images/logos/SURFRIGO.jpeg", alt: "Surfrigo", heightClass: "h-12" },
  { src: "/images/logos/TRADEN.png", alt: "Traden", heightClass: "h-14" },
  { src: "/images/logos/TRANSPORTE-DOMINGUEZ.png", alt: "Transporte Dominguez", heightClass: "h-14" },
  { src: "/images/logos/UBA-investigación.jpg", alt: "UBA Investigación", heightClass: "h-12" },
  { src: "/images/logos/UCASAL.png", alt: "UCASAL", heightClass: "h-14" },
  { src: "/images/logos/UNLAM.png", alt: "UNLaM", heightClass: "h-14" },
  { src: "/images/logos/UNLP.png", alt: "UNLP", heightClass: "h-12" },
  { src: "/images/logos/UNLZ.png", alt: "UNLZ", heightClass: "h-12" },
  { src: "/images/logos/UNS.jpg", alt: "UNS", heightClass: "h-12" },
  { src: "/images/logos/UNSAM.png", alt: "UNSAM", heightClass: "h-12" },
  { src: "/images/logos/UPE.png", alt: "UPE", heightClass: "h-12" },
  { src: "/images/logos/UTN.png", alt: "UTN", heightClass: "h-12" },
  { src: "/images/logos/VDM-LOGISTICS.jpg", alt: "VDM Logistics", heightClass: "h-12" },
  { src: "/images/logos/VELOX.jpeg", alt: "Velox", heightClass: "h-14" },
  { src: "/images/logos/VIMA.png", alt: "VIMA", heightClass: "h-12" },
  { src: "/images/logos/VOS.jpeg", alt: "VOS", heightClass: "h-12" },
  { src: "/images/logos/XPERTS.jpeg", alt: "Xperts", heightClass: "h-12" },
  { src: "/images/logos/Zento.jpg", alt: "Zento", heightClass: "h-14" },
];

// Distribute logos into three balanced arrays for the carousels.
export const FIRST_CAROUSEL_LOGOS: LogoItem[] = [];
export const SECOND_CAROUSEL_LOGOS: LogoItem[] = [];
export const THIRD_CAROUSEL_LOGOS: LogoItem[] = [];

ALL_LOGOS.forEach((logo, index) => {
  if (index % 3 === 0) {
    FIRST_CAROUSEL_LOGOS.push(logo);
  } else if (index % 3 === 1) {
    SECOND_CAROUSEL_LOGOS.push(logo);
  } else {
    THIRD_CAROUSEL_LOGOS.push(logo);
  }
});

// For compatibility, a default export is provided.
// For compatibility, a default export is provided.
export const DEFAULT_LOGOS: LogoItem[] = ALL_LOGOS;
