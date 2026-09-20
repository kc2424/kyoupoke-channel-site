"use client";

import { useState, type ReactNode } from "react";

import { useModalDialog } from "@/components/use-modal-dialog";

/** Load the player only after the visitor opens a video. */
export function VideoModal({ videoId, title, children }: {
  videoId: string;
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const dialogRef = useModalDialog(open);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full text-left"
        aria-label={`${title}を再生`}
        aria-haspopup="dialog"
      >
        {children}
      </button>
      <dialog
        ref={dialogRef}
        aria-label={title}
        data-lenis-prevent
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        onClick={(event) => { if (event.target === event.currentTarget) setOpen(false); }}
        className="fixed inset-0 m-0 hidden h-dvh max-h-none w-screen max-w-none flex-col items-center justify-center overflow-y-auto border-0 bg-black/90 p-4 text-white backdrop-blur-sm open:flex sm:p-6"
      >
        <div className="flex w-full max-w-5xl flex-col items-end gap-3" style={{ width: "min(100%, calc((100dvh - 6.5rem) * 16 / 9))" }}>
          <button
            type="button"
            data-dialog-close
            onClick={() => setOpen(false)}
            className="shrink-0 rounded-full border-2 border-white px-5 py-2 text-sm font-bold text-white hover:bg-white hover:text-black"
          >
            Close
          </button>
          <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
            {open && (
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
