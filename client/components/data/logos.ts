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

export function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
