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

export function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
