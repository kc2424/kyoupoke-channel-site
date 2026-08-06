import type Lenis from "lenis";

let instance: Lenis | null = null;
const pendingReadyCallbacks = new Set<(lenis: Lenis) => void>();

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
  if (lenis) {
    pendingReadyCallbacks.forEach((cb) => cb(lenis));
    pendingReadyCallbacks.clear();
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
  const target = document.querySelector(hash);
  if (!target) return;

  if (!instance) {
    target.scrollIntoView({ behavior: "smooth" });
    return;
  }
  instance.scrollTo(target as HTMLElement, { offset: -88, duration: 1.2 });
}
