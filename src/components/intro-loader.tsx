"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { lockPageScroll } from "@/lib/lenis";
import styles from "./intro-loader.module.css";

const parade = Array.from({ length: 70 }, (_, index) => ({
  width: 36 + (index * 9) % 56,
  top: `${((index * 145) % 9600) / 100}%`,
  animationDuration: `${1000 + (index % 7) * 140}ms`,
  animationDelay: `${(index % 10) * 60}ms`,
  "--tilt": `${(index * 19) % 60 - 30}deg`,
}) satisfies CSSProperties & { "--tilt": string });

export function IntroLoader() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const skip = skipRef.current;
    if (!dialog || !skip) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionPreference.matches || window.location.hash || typeof dialog.showModal !== "function") return;

    dialog.showModal();
    const unlock = lockPageScroll();
    const finish = () => {
      window.clearTimeout(timeout);
      if (dialog.open) dialog.close();
      unlock();
    };
    const timeout = window.setTimeout(finish, 2000);
    const onCancel = (event: Event) => {
      event.preventDefault();
      finish();
    };
    const onMotionChange = () => {
      if (motionPreference.matches) finish();
    };

    skip.addEventListener("click", finish);
    dialog.addEventListener("cancel", onCancel);
    motionPreference.addEventListener("change", onMotionChange);
    window.addEventListener("pagehide", finish);
    return () => {
      skip.removeEventListener("click", finish);
      dialog.removeEventListener("cancel", onCancel);
      motionPreference.removeEventListener("change", onMotionChange);
      window.removeEventListener("pagehide", finish);
      finish();
    };
  }, []);

  return (
    <dialog ref={dialogRef} className={styles.loader} aria-label="今日ポケ オープニング" data-testid="intro-loader">
      <div className={styles.parade} aria-hidden="true">
        {parade.map((style, index) => <span key={index} className={styles.runner} style={style} />)}
      </div>
      <div className={styles.center} aria-hidden="true">
        <span className={styles.logo} />
        <div className={styles.title}>KYOU POKE</div>
        <div className={styles.welcome}>WELCOME !</div>
      </div>
      <button ref={skipRef} className={styles.skip} type="button">スキップ</button>
    </dialog>
  );
}
