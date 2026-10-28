"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, Close } from "@/components/ui/Icons";
import type { GalleryImageDTO } from "@/types/content";

type Props = {
  images: GalleryImageDTO[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
};

/**
 * Full-size viewer: Esc closes, ←/→ navigate, focus is trapped and restored,
 * touch users swipe. Neighbouring images are preloaded.
 */
export function Lightbox({ images, index, onClose, onIndex }: Props) {
  const dialog = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const open = index !== null;
  const current = open ? images[index] : null;

  const prev = () => index !== null && onIndex((index - 1 + images.length) % images.length);
  const next = () => index !== null && onIndex((index + 1) % images.length);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    dialog.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Tab" && dialog.current) {
        const items = dialog.current.querySelectorAll<HTMLElement>("button");
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  return (
    <AnimatePresence>
      {current && index !== null && (
        <motion.div
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-label={`Image ${index + 1} of ${images.length}: ${current.caption ?? current.alt}`}
          className="fixed inset-0 z-[80] flex flex-col bg-charcoal/97 text-ivory"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
            touchX.current = null;
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 md:px-8">
            <p className="eyebrow tabular-nums text-ivory/70">
              {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </p>
            <button type="button" data-autofocus onClick={onClose} aria-label="Close gallery viewer" className="inline-flex size-12 items-center justify-center hover:text-sand">
              <Close className="size-6" />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-2 md:px-20" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={current.id}
                className="relative flex h-full w-full flex-col items-center justify-center"
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="relative h-[min(78svh,100%)] w-full">
                  <Image
                    src={current.src}
                    alt={current.alt}
                    fill
                    sizes="100vw"
                    placeholder={current.blurDataUrl ? "blur" : "empty"}
                    blurDataURL={current.blurDataUrl ?? undefined}
                    className="object-contain"
                  />
                </div>
                {current.caption && <figcaption className="mt-4 text-center font-serif text-lg text-ivory/85">{current.caption}</figcaption>}
              </motion.figure>
            </AnimatePresence>

            <button type="button" onClick={prev} aria-label="Previous image" className="absolute left-2 top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center border border-ivory/25 hover:bg-ivory hover:text-charcoal md:inline-flex">
              <ArrowLeft />
            </button>
            <button type="button" onClick={next} aria-label="Next image" className="absolute right-2 top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center border border-ivory/25 hover:bg-ivory hover:text-charcoal md:inline-flex">
              <ArrowRight />
            </button>
          </div>

          <div className="flex justify-center gap-3 pb-6 pt-2 md:hidden">
            <button type="button" onClick={prev} aria-label="Previous image" className="inline-flex size-12 items-center justify-center border border-ivory/25">
              <ArrowLeft />
            </button>
            <button type="button" onClick={next} aria-label="Next image" className="inline-flex size-12 items-center justify-center border border-ivory/25">
              <ArrowRight />
            </button>
          </div>

          {/* Preload neighbours */}
          <div className="hidden" aria-hidden>
            {[images[(index + 1) % images.length], images[(index - 1 + images.length) % images.length]].map((n) => (
              <Image key={n.id} src={n.src} alt="" width={n.width} height={n.height} sizes="100vw" />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
