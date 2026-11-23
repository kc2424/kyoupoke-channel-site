import type Lenis from "lenis";

let instance: Lenis | null = null;
let scrollLocks = 0;
let previousOverflow = "";
const pendingReadyCallbacks = new Set<(lenis: Lenis) => void>();

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
  if (lenis) {
    if (scrollLocks > 0) lenis.stop();
    pendingReadyCallbacks.forEach((cb) => cb(lenis));
    pendingReadyCallbacks.clear();
  }
}

/** Dialogs share one lock so one closing dialog cannot unlock another. */
export function lockPageScroll() {
  if (scrollLocks === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    instance?.stop();
  }
  scrollLocks += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    scrollLocks -= 1;
    if (scrollLocks === 0) {
      document.body.style.overflow = previousOverflow;
      instance?.start();
    }
  };
}

function focusDestination(target: HTMLElement) {
  const hadTabIndex = target.hasAttribute("tabindex");
  if (!hadTabIndex) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
  if (!hadTabIndex) {
    target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
  }
}

// SmoothScrollのuseGSAPが後からLenisインスタンスを生成するため、マウント順に
// 依存せず新しいスクロール演出がlenis.on('scroll', ...)を安全にフックできるようにする。
// コールバックはインスタンス生成後に一度だけ呼ばれる。戻り値は「未発火なら発火を
// キャンセルする」ための関数で、on('scroll', ...)の購読解除自体は呼び出し側の責務。
export function onLenisReady(cb: (lenis: Lenis) => void) {
  if (instance) {
    cb(instance);
    return () => {};
  }
  pendingReadyCallbacks.add(cb);
  return () => {
    pendingReadyCallbacks.delete(cb);
  };
}

export function scrollToHash(hash: string) {
  let id: string;
  try {
    id = decodeURIComponent(hash.slice(1));
  } catch {
    return;
  }
  const target = document.getElementById(id);
  if (!target) return;

  if (window.location.hash !== hash) window.history.pushState(null, "", hash);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  focusDestination(target);

  if (!instance) {
    target.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth" });
    return;
  }
  instance.scrollTo(target, { offset: -104, duration: 0.8, immediate: reducedMotion });
}

export function scrollToPageTop() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (instance) instance.scrollTo(0, { duration: 0.8, immediate: reducedMotion });
  else window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
  if (window.location.hash) {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }
  const heading = document.querySelector<HTMLElement>("main h1, main");
  if (heading) focusDestination(heading);
}
