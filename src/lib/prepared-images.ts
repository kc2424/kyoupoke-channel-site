import manifest from "@/data/image-manifest.json";

type PreparedImage = { width: number; height: number; variants: { width: number; src: string }[] };
const images: Record<string, PreparedImage> = manifest;

export function imageSource(src: string, width = 1280) {
  const image = images[src];
  return image ? (image.variants.find((variant) => variant.width >= width) ?? image.variants.at(-1))!.src : src;
}

export function imageSourceSet(src: string) {
  return images[src]?.variants.map((variant) => `${variant.src} ${variant.width}w`).join(", ");
}
