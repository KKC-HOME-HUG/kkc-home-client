"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

type Media = { url: string; is_cover: boolean; sort_order: number };

export default function Gallery({ media, alt }: { media: Media[]; alt: string }) {
  const [active, setActive] = useState(0);

  if (!media.length) {
    return <div className="aspect-[16/9] w-full rounded-lg bg-base-200" />;
  }

  const go = (d: number) => setActive((a) => (a + d + media.length) % media.length);

  return (
    <div className="space-y-2">
      <div className="group relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-base-200">
        {/* All images are stacked and preloaded; switching = opacity crossfade (no reload flash) */}
        {media.map((m, i) => (
          <img
            key={m.url}
            src={m.url}
            alt={alt}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {media.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="รูปก่อนหน้า"
              className="btn btn-circle btn-sm absolute left-2 top-1/2 -translate-y-1/2 border-0 bg-base-100/70 opacity-0 shadow transition group-hover:opacity-100"
            >
              <LuChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="รูปถัดไป"
              className="btn btn-circle btn-sm absolute right-2 top-1/2 -translate-y-1/2 border-0 bg-base-100/70 opacity-0 shadow transition group-hover:opacity-100"
            >
              <LuChevronRight size={18} />
            </button>
            <div className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
              {active + 1} / {media.length}
            </div>
          </>
        ) : null}
      </div>

      {media.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {media.map((m, i) => (
            <button
              key={m.url}
              type="button"
              onClick={() => setActive(i)}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-md ring-2 transition ${
                i === active ? "ring-primary" : "ring-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={m.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
