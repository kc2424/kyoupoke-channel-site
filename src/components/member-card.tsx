"use client";

import Image from "next/image";
import { useState } from "react";

export function MemberCard({
  index,
  name,
  role,
  tags,
  text,
  focal,
}: {
  index: number;
  name: string;
  role: string;
  tags: string[];
  text: string;
  focal: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className="flex w-full flex-col gap-6 border-b border-neutral-200 py-8 text-left sm:flex-row sm:items-center"
    >
      <div className="relative h-[220px] w-full shrink-0 overflow-hidden rounded-xl sm:h-[200px] sm:w-[280px]">
        <Image
          src="/hero.png"
          alt={name}
          fill
          className="object-cover"
          style={{ transform: "scale(2.6)", transformOrigin: focal }}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="font-display mt-1 text-2xl text-brand sm:text-3xl">
              {name}
            </h3>
            <p className="mt-1 text-sm font-bold text-neutral-500">{role}</p>
          </div>
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-300 transition-transform duration-300"
            style={{ transform: open ? "rotate(-90deg)" : "rotate(0deg)" }}
          >
            ↓
          </span>
        </div>
        <div
          className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.785,0.135,0.15,0.86)]"
          style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-700">
              {text}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
