"use client";

import { useState } from "react";

type Media = { url: string; is_cover: boolean; sort_order: number };

export default function Gallery({ media, alt }: { media: Media[]; alt: string }) {
  const [active, setActive] = useState(0);
  if (!media.length) {
    return <div className="aspect-[16/9] w-full rounded-lg bg-base-200" />;
  }
  return (
    <div className="space-y-2">
      <div className="aspect-[16/9] w-full overflow-hidden rounded-lg bg-base-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={media[active].url} alt={alt} className="h-full w-full object-cover" />
      </div>
      {media.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto">
          {media.map((m, i) => (
            <button
              key={m.url}
              type="button"
              onClick={() => setActive(i)}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded border-2 ${
                i === active ? "border-primary" : "border-transparent"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
