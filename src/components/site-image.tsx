"use client";

import NextImage, { type ImageProps } from "next/image";
import type { Ref } from "react";
import imageLoader from "@/lib/image-loader";

// vinext does not read images.loaderFile; an explicit loader also works on Workers.
export default function SiteImage(props: ImageProps & { ref?: Ref<HTMLImageElement> }) {
  const remote = typeof props.src === "string" && /^https?:/.test(props.src);
  return <NextImage {...props} loader={imageLoader} unoptimized={remote || props.unoptimized} />;
}
