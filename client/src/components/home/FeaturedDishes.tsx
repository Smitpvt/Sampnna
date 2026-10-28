"use client";

import clsx from "clsx";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Price } from "@/components/menu/Price";
import { ArrowLeft, ArrowRight } from "@/components/ui/Icons";
import type { DishDTO } from "@/types/content";

/**
 * Section C — horizontal, editorial dish reel.
 * Native scroll-snap does the heavy lifting (touch swipe, trackpads, keyboard);
 * mouse users can also drag. The card nearest the reel's leading edge is active.
 */
export function FeaturedDishes({ dishes }: { dishes: DishDTO[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  const cards = () => Array.from(track.current?.children ?? []) as HTMLElement[];

  const onScroll = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const items = cards();
    const edge = el.scrollLeft + parseFloat(getComputedStyle(el).scrollPaddingLeft || "0");
    let best = 0;
    let bestDist = Infinity;
    items.forEach((c, i) => {
      const d = Math.abs(c.offsetLeft - edge);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) best = items.length - 1;
    setActive(best);
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const go = (index: number) => {
    const el = track.current;
    const target = cards()[Math.max(0, Math.min(index, dishes.length - 1))];
    if (!el || !target) return;
    const pad = parseFloat(getComputedStyle(el).scrollPaddingLeft || "0");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: target.offsetLeft - pad, behavior: reduce ? "auto" : "smooth" });
  };

  // Mouse drag (touch uses native scrolling).
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !track.current) return;
    drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const el = track.current;
    if (!drag.current || !el) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 4 && !drag.current.moved) {
      drag.current.moved = true;
      el.style.scrollSnapType = "none";
      el.setPointerCapture(e.pointerId);
    }
    if (drag.current.moved) el.scrollLeft = drag.current.left - dx;
  };
  const endDrag = (e: React.PointerEvent) => {
    const el = track.current;
    if (!drag.current || !el) return;
    const moved = drag.current.moved;
    drag.current = null;
    if (moved) {
      el.releasePointerCapture(e.pointerId);
      el.style.scrollSnapType = "";
      onScroll();
      go(active);
    }
  };

  return (
    <section aria-labelledby="featured-title" className="relative overflow-hidden bg-turquoise-deep py-24 text-ivory md:py-32">
      <div className="shell flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow text-sand/80">From the menu</p>
          <h2 id="featured-title" className="mt-5 max-w-2xl text-headline">
            Plates worth <em className="text-sand">crossing</em> the table for.
          </h2>
        </div>
        <div className="flex items-center gap-6">
          <p className="eyebrow tabular-nums text-ivory/70" aria-live="polite">
            {String(active + 1).padStart(2, "0")} <span className="text-ivory/40">/ {String(dishes.length).padStart(2, "0")}</span>
          </p>
          <div className="flex gap-2">
            <button type="button" onClick={() => go(active - 1)} disabled={active === 0} aria-label="Previous dish" className="inline-flex size-12 items-center justify-center border border-ivory/30 transition-colors hover:bg-ivory hover:text-charcoal disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ivory">
              <ArrowLeft />
            </button>
            <button type="button" onClick={() => go(active + 1)} disabled={active === dishes.length - 1} aria-label="Next dish" className="inline-flex size-12 items-center justify-center border border-ivory/30 transition-colors hover:bg-ivory hover:text-charcoal disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ivory">
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>

      <ul
        ref={track}
        aria-label="Featured dishes"
        className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-4 [scroll-padding-left:1.25rem] md:gap-8 md:[scroll-padding-left:2.5rem] xl:[scroll-padding-left:max(4rem,calc((100vw-1440px)/2+4rem))] cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={(e) => drag.current?.moved && e.preventDefault()}
      >
        {dishes.map((dish, i) => (
          <li
            key={dish.id}
            aria-current={i === active ? "true" : undefined}
            className={clsx(
              "group w-[78vw] shrink-0 snap-start first:ml-5 last:mr-5 sm:w-[46vw] md:first:ml-10 md:last:mr-10 lg:w-[30vw] xl:w-[400px] xl:first:ml-[max(4rem,calc((100vw-1440px)/2+4rem))]",
              "transition-opacity duration-700",
              i === active ? "opacity-100" : "opacity-55 hover:opacity-90",
            )}
          >
            <motion.article
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, delay: Math.min(i, 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-charcoal/20">
                {dish.image && (
                  <Image
                    src={dish.image.src}
                    alt={dish.image.alt}
                    fill
                    draggable={false}
                    sizes="(min-width: 1280px) 400px, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 78vw"
                    placeholder={dish.image.blurDataUrl ? "blur" : "empty"}
                    blurDataURL={dish.image.blurDataUrl}
                    className="object-cover transition-transform duration-[1.2s] ease-out-soft group-hover:scale-[1.04]"
                  />
                )}
                <span className="eyebrow absolute left-4 top-4 bg-charcoal/60 px-2 py-1 text-[0.62rem] text-ivory backdrop-blur-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4 border-b border-ivory/20 pb-4">
                <h3 className="font-serif text-2xl leading-tight md:text-[1.7rem]">{dish.name}</h3>
                <Price dish={dish} className="text-lg text-sand" />
              </div>
              <p className="eyebrow mt-4 text-[0.65rem] text-sand/80">{dish.categoryName}</p>
              {dish.description && <p className="mt-2 max-w-sm text-sm leading-relaxed text-ivory/75">{dish.description}</p>}
            </motion.article>
          </li>
        ))}
      </ul>

      <div className="shell mt-12">
        <Link href="/menu" className="link-line eyebrow text-sand">
          See the full menu
        </Link>
      </div>
    </section>
  );
}
