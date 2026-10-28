"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { GalleryCategory, GalleryImageDTO } from "@/types/content";
import { Lightbox } from "./Lightbox";

const LABELS: Record<GalleryCategory, string> = {
  FOOD: "Food",
  DRINKS: "Drinks",
  AMBIENCE: "Ambience",
  KITCHEN: "Kitchen",
};

/** Filterable masonry of real Sampann photography, opening into a lightbox. */
export function GalleryGrid({ images }: { images: GalleryImageDTO[] }) {
  const [filter, setFilter] = useState<GalleryCategory | "ALL">("ALL");
  const [open, setOpen] = useState<number | null>(null);

  // Only offer filters the photography actually supports.
  const available = useMemo(
    () => (Object.keys(LABELS) as GalleryCategory[]).filter((c) => images.some((i) => i.category === c)),
    [images],
  );
  const shown = useMemo(() => (filter === "ALL" ? images : images.filter((i) => i.category === filter)), [images, filter]);

  return (
    <>
      <div role="toolbar" aria-label="Filter gallery" className="no-scrollbar -mx-5 flex gap-8 overflow-x-auto px-5 md:mx-0 md:px-0">
        {(["ALL", ...available] as const).map((c) => {
          const count = c === "ALL" ? images.length : images.filter((i) => i.category === c).length;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
              className={clsx(
                "eyebrow inline-flex min-h-11 shrink-0 items-baseline gap-2 border-b-2 py-2 transition-colors",
                filter === c ? "border-terracotta text-ivory" : "border-transparent text-ivory/55 hover:text-ivory",
              )}
            >
              {c === "ALL" ? "All" : LABELS[c]}
              <span className="text-[0.6rem] tabular-nums opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {shown.length} images
      </p>

      <ul className="mt-10 columns-2 gap-3 md:columns-3 md:gap-5 xl:columns-4">
        <AnimatePresence initial={false}>
          {shown.map((img, i) => (
            <motion.li
              key={img.id}
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="mb-3 break-inside-avoid md:mb-5"
            >
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="group relative block w-full overflow-hidden text-left"
                aria-label={`Open image: ${img.caption ?? img.alt}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                  placeholder={img.blurDataUrl ? "blur" : "empty"}
                  blurDataURL={img.blurDataUrl ?? undefined}
                  className="h-auto w-full transition-transform duration-[1.2s] ease-out-soft group-hover:scale-[1.03]"
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-charcoal/75 to-transparent p-3 pt-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="font-serif text-base text-ivory">{img.caption}</span>
                  <span className="eyebrow text-[0.58rem] text-ivory/70">{LABELS[img.category]}</span>
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <Lightbox images={shown} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </>
  );
}
