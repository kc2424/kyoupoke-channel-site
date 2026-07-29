import Image from "next/image";

import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden rounded-full",
        className ?? "h-9 w-9"
      )}
    >
      <Image src="/icon.png" alt="今日ポケ" fill sizes="96px" className="object-cover" />
    </span>
  );
}
