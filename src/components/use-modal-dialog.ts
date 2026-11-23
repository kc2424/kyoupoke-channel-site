"use client";

import { useEffect, useRef } from "react";

import { lockPageScroll } from "@/lib/lenis";
import { requestNativeCursor } from "@/lib/native-cursor";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function getFocusableElements(dialog: HTMLDialogElement) {
  return Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => element.getClientRects().length > 0 && element.getAttribute("aria-hidden") !== "true"
  );
}

/** Native modal dialogs provide top-layer rendering, background inertness and focus containment. */
export function useModalDialog(open: boolean) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;

    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const unlock = lockPageScroll();
    const releaseCursor = requestNativeCursor();
    dialog.showModal();
    dialog.querySelector<HTMLElement>("[data-dialog-close]")?.focus({ preventScroll: true });

    let lastTabWasBackward = false;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      lastTabWasBackward = event.shiftKey;

      const focusable = getFocusableElements(dialog);
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !dialog.contains(active))) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    // Leaving a cross-origin iframe can briefly place focus on BODY before the browser
    // continues the native dialog cycle. Restore it within the same task so focus never
    // becomes observable outside the modal.
    const handleFocusOut = () => {
      queueMicrotask(() => {
        if (!dialog.open || dialog.contains(document.activeElement)) return;
        const focusable = getFocusableElements(dialog);
        const target = lastTabWasBackward ? focusable.at(-1) : focusable[0];
        (target ?? dialog).focus({ preventScroll: true });
      });
    };

    dialog.addEventListener("keydown", handleKeyDown);
    dialog.addEventListener("focusout", handleFocusOut);

    return () => {
      dialog.removeEventListener("keydown", handleKeyDown);
      dialog.removeEventListener("focusout", handleFocusOut);
      dialog.close();
      unlock();
      releaseCursor();
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [open]);

  return dialogRef;
}
