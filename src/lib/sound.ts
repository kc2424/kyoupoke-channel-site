const STORAGE_KEY = "kyoupoke-sound-enabled";

let enabled = false;
let audioCtx: AudioContext | null = null;
const listeners = new Set<(enabled: boolean) => void>();

export function loadSoundPreference() {
  if (typeof window === "undefined") return enabled;
  enabled = window.localStorage.getItem(STORAGE_KEY) === "1";
  return enabled;
}

export function isSoundEnabled() {
  return enabled;
}

export function setSoundEnabled(next: boolean) {
  enabled = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  }
  listeners.forEach((listener) => listener(enabled));
}

export function onSoundPreferenceChange(listener: (enabled: boolean) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// 外部の音声ファイルは使わず、Web Audio APIで軽い「ポップ」音を都度合成する。
function getAudioContext() {
  if (typeof window === "undefined") return null;
  const win = window as typeof window & { webkitAudioContext?: typeof AudioContext };
  const AudioContextClass = win.AudioContext ?? win.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) audioCtx = new AudioContextClass();
  if (audioCtx.state === "suspended") void audioCtx.resume();
  return audioCtx;
}

export function playPop(pitch = 1) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(880 * pitch, now);
  osc.frequency.exponentialRampToValueAtTime(220 * pitch, now + 0.12);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.28, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.18);
}
