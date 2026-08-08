// YouTubeなどのクロスオリジンiframeの上ではmousemoveが親ドキュメントに届かないため、
// カスタムカーソルが枠の外側で止まり、iframe内は素のOSカーソルという二重表示になる。
// iframeを開いている間だけ「素のカーソルに戻す」ことで表示を一本化するための仕組み。
//
// 複数のモーダルが同時に開いても壊れないよう、参照カウントで管理する。

let count = 0;
const listeners = new Set<(nativeCursor: boolean) => void>();

function emit() {
  const on = count > 0;
  listeners.forEach((cb) => cb(on));
}

/**
 * 素のカーソルに戻す。戻り値を呼ぶと解除される（useEffectのcleanupに渡す想定）。
 */
export function requestNativeCursor(): () => void {
  count += 1;
  if (count === 1) emit();

  let released = false;
  return () => {
    if (released) return;
    released = true;
    count -= 1;
    if (count === 0) emit();
  };
}

/** 現在の状態を購読する。購読と同時に現在値が一度通知される。 */
export function onNativeCursorChange(cb: (nativeCursor: boolean) => void) {
  listeners.add(cb);
  cb(count > 0);
  return () => {
    listeners.delete(cb);
  };
}
