export type LogoItem = { src: string; alt: string; heightClass?: string };

// Default set for other carousels if none provided
export const DEFAULT_LOGOS: LogoItem[] = [
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2F0652a67d7c5749bc9bceef95d71744f8?format=webp&width=800", alt: "Aeronova", heightClass: "h-14" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2F8aa58f4aca834ddaaafedb6b2fcf9dcf?format=webp&width=800", alt: "ARLOG", heightClass: "h-14" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2Ff9e4a8e97dd3415da4bf10b617c9a0cf?format=webp&width=800", alt: "CHAGA", heightClass: "h-16" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2F582a30ec219741eca8d96e859e70ff70?format=webp&width=800", alt: "CityOne", heightClass: "h-14" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2Fc5eaf04ee8b749959fb7635db129519d?format=webp&width=800", alt: "Conwork", heightClass: "h-14" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2Ff8adf0d6f281407bafa6872b4a9e3067?format=webp&width=800", alt: "Logística E-LECE", heightClass: "h-14" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2F9f27e34e5a34474fbaab3d87d5e3d7ea?format=webp&width=800", alt: "ElectriTruck", heightClass: "h-14" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2Fc70f80a050f349ae826251dc8088e9ef?format=webp&width=800", alt: "Escuela de Choferes", heightClass: "h-12" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2F2a8b143d916c494aa10c998807d1ad28?format=webp&width=800", alt: "eTrack", heightClass: "h-14" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2F67ece9866a934b43b5a0acc24d92e55c?format=webp&width=800", alt: "GLI", heightClass: "h-16" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2Fce900b5281a9401689cdbc0fd6af9540?format=webp&width=800", alt: "Gruas Golisano", heightClass: "h-14" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2F5a98b0d073064596b57ee97b30142d36?format=webp&width=800", alt: "KMD Logística", heightClass: "h-14" }
];

// First carousel explicit set (user-provided)
export const FIRST_CAROUSEL_LOGOS: LogoItem[] = [
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2Fd2cfa68c3ce54495853e331d01475c3e?format=webp&width=800", alt: "ElectriTruck", heightClass: "h-14" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2Fbcab8caf457b409cb0166725478dc58f?format=webp&width=800", alt: "Escuela de Choferes", heightClass: "h-12" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2F7bcb848870e64de7bd0196d5d9378674?format=webp&width=800", alt: "eTrack", heightClass: "h-14" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2F368ae92b077d4acda8d4385531671bf9?format=webp&width=800", alt: "GLI", heightClass: "h-16" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2Fd297b129bd264436af75e571d4aa0a78?format=webp&width=800", alt: "Gruas Golisano", heightClass: "h-14" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2F9b1c6ef9f86b43d399a2f2394c690b33?format=webp&width=800", alt: "KMD Logística", heightClass: "h-14" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2F3468b29057484957bffd326d7f49ec99?format=webp&width=800", alt: "Aeronova", heightClass: "h-14" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2F39bcfbbd125a4fdaaea43f003e954683?format=webp&width=800", alt: "ARLOG", heightClass: "h-14" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2Fc6a8955780c74859a4d55d93ef6ee6fd?format=webp&width=800", alt: "CHAGA", heightClass: "h-16" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2F56269a03363046ba9d1be91411cb7a1f?format=webp&width=800", alt: "CityOne", heightClass: "h-14" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2Ffdc2b73a454b45bf94544ef9d8d791c9?format=webp&width=800", alt: "Conwork", heightClass: "h-14" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2Fc8118b50d6664eeb9846515ba656ea09?format=webp&width=800", alt: "Logística E-LECE", heightClass: "h-12" }
];

// Second carousel explicit set (user-provided)
export const SECOND_CAROUSEL_LOGOS: LogoItem[] = [
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2Fb8c28f51aab546d8b8dba9a267a61832?format=webp&width=800", alt: "Núcleo Logístico", heightClass: "h-16" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2F243a0df489fe4e6ba92c28ca9df5650b?format=webp&width=800", alt: "N&G Transportes", heightClass: "h-16" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2Fb0fa9a2f41654e38b32ccdc4cbd9f549?format=webp&width=800", alt: "Performance Lube", heightClass: "h-14" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2F46484e6b719e431d88131e652c67f1fb?format=webp&width=800", alt: "Rasta", heightClass: "h-14" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2Fa7a05cf917c846c5bef1673a23fdc4cf?format=webp&width=800", alt: "Red Logística", heightClass: "h-14" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2F3daf5da61e494062a57206984de195b1?format=webp&width=800", alt: "Red Parques Digital", heightClass: "h-12" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2Fb6b599c7928344ba91dec709c1062c3c?format=webp&width=800", alt: "Shiaffer", heightClass: "h-10" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2Fee1aaca255aa41798acb46bf441f8c49?format=webp&width=800", alt: "KPI Consulting", heightClass: "h-16" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2F77b635486d7b47e48d7b5bc700023b7b?format=webp&width=800", alt: "La Postal", heightClass: "h-12" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2Fb23bcdbe9d4d4edba1b5f785bcf8553c?format=webp&width=800", alt: "Logística Carpic", heightClass: "h-16" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2Fe0800014034b456cb21b66fc750e3c89?format=webp&width=800", alt: "Cargo", heightClass: "h-10" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2F43674f51cd7d41d5865218ac02526921?format=webp&width=800", alt: "Muvon", heightClass: "h-14" }
];

// Third carousel explicit set (first 12 of provided)
export const THIRD_CAROUSEL_LOGOS: LogoItem[] = [
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2Ff7ce3047f5314a7bb84f6da1beffbcfc?format=webp&width=800", alt: "Traden", heightClass: "h-16" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2Fa2416637723e4ed7aaad437b6fae8a04?format=webp&width=800", alt: "Transporte Dominguez", heightClass: "h-14" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2Fe87110819bd64e04a33cfecbb2dd6c82?format=webp&width=800", alt: "UNLaM", heightClass: "h-16" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2Fac9154e2dc384057958d4235af63cda7?format=webp&width=800", alt: "UNLP", heightClass: "h-14" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2F68f8f4b6530b4535a5b45b97530ba6fb?format=webp&width=800", alt: "UNLZ", heightClass: "h-14" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2F3ebc652058d141e89f765fcae46f7b8c?format=webp&width=800", alt: "UPE", heightClass: "h-14" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2F80a1dcd274574464bfddf9104e9e40aa?format=webp&width=800", alt: "UTN", heightClass: "h-14" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2F6ce10b5621ff41fb9cf69ec5f6428129?format=webp&width=800", alt: "VDM Logistics", heightClass: "h-12" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2Fa393f94347a14398a324933674d5993e?format=webp&width=800", alt: "VIMA", heightClass: "h-14" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2F9092f09f721c4c2884aedc72bc148199?format=webp&width=800", alt: "VOS", heightClass: "h-14" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2Fab0b7789ede447ad8164ee07487f48d6?format=webp&width=800", alt: "Xperts", heightClass: "h-14" },
  { src: "https://cdn.builder.io/api/v1/image/assets%2Fcb0ed83df0f64e19ade6613b03046b1b%2F04a56782c3e04fb49756a94255d3fc24?format=webp&width=800", alt: "StarGPS", heightClass: "h-12" }
];

export function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
