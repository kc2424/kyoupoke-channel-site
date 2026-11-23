"use client";

import manifest from "@/data/image-manifest.json";
import type { ImageLoaderProps } from "next/image";

type PreparedImage = { width: number; height: number; variants: { width: number; src: string }[] };
const images: Record<string, PreparedImage> = manifest;

export default function imageLoader({ src, width }: ImageLoaderProps): string {
  const image = images[src];
  if (!image) return src;
  return (image.variants.find((variant) => variant.width >= width) ?? image.variants.at(-1))!.src;
}
