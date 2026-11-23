import Image from "@/components/site-image";

export function HeroPhoto({ src, alt, objectPosition = "object-top" }: {
  src: string; alt: string; objectPosition?: string; zoom?: number; parallax?: boolean;
}) {
  return <div className="pointer-events-none absolute inset-0">
    <Image src={src} alt={alt} fill sizes="100vw" className={"object-cover " + objectPosition} />
  </div>;
}
