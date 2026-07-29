import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function scrollToHash(hash: string) {
  const target = document.querySelector(hash);
  if (!target) return;

  if (!instance) {
    target.scrollIntoView({ behavior: "smooth" });
    return;
  }
  instance.scrollTo(target as HTMLElement, { offset: -88, duration: 1.2 });
}
