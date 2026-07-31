"use client";

import Image from "next/image";
import { useState } from "react";

import { BlueprintCorners } from "@/components/blueprint-corners";
import { LiveGlowFrame } from "@/components/live-glow-frame";
import { LogoMark } from "@/components/logo-mark";

export function MemberCard({
  index,
  name,
  role,
  tags,
  text,
  photo,
}: {
  index: number;
  name: string;
  role: string;
  tags: string[];
  text: string;
  photo?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      data-cursor-label={open ? "CLOSE" : "MORE"}
      className="group flex w-full flex-col gap-6 border-b border-neutral-200 py-8 text-left sm:flex-row sm:items-center lg:gap-10 lg:py-10"
    >
      <LiveGlowFrame
        rounded="rounded-xl"
        className="h-[220px] w-full shrink-0 sm:h-[200px] sm:w-[280px] lg:h-[260px] lg:w-[360px]"
      >
        <div className="relative h-full w-full bg-[#df5330]">
          {photo ? (
            <Image
              src={photo}
              alt={name}
              fill
              className="object-cover object-top"
            />
          ) : (
            <div className="bg-brand/10 flex h-full w-full items-center justify-center">
              <LogoMark className="h-20 w-20" />
            </div>
          )}
          <BlueprintCorners tone="light" label={`NO.${String(index + 1).padStart(2, "0")}`} />
        </div>
      </LiveGlowFrame>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-bold tracking-widest text-neutral-400 uppercase lg:text-sm">
              NO.{String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="font-display mt-1 text-2xl text-brand sm:text-3xl lg:text-5xl">
              {name}
            </h3>
            <p className="mt-1 text-sm font-bold text-neutral-500 lg:text-lg">{role}</p>
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
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-700 lg:text-lg">
              {text}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-600 lg:px-4 lg:py-1.5 lg:text-base"
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
