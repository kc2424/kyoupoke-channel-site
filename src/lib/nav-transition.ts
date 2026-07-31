type Trigger = () => void;

let trigger: Trigger | null = null;

export function setNavTransitionTrigger(fn: Trigger | null) {
  trigger = fn;
}

export function playNavTransition() {
  trigger?.();
}
