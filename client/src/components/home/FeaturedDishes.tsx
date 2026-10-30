"use client";

import clsx from "clsx";
import { useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "@/components/ui/Icons";
import type { FeaturedDishDTO } from "@/types/content";

/**
 * Section C — featured dishes as a gallery of round plates. Four sit side by
 * side on desktop (three on tablets, one and a peek on phones) in a horizontal
 * track that snaps plate by plate: swipe or scroll it, or use the arrows to
 * move a page at a time. Each plate has a fine cream outer ring and a white
 * rim, with the dish's menu name, category and description beneath — no
 * prices, and nothing moves on its own.
 */
export function FeaturedDishes({ dishes }: { dishes: FeaturedDishDTO[] }) {
  const track = useRef<HTMLUListElement>(null);
  const reduceMotion = useReducedMotion();
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = () => {
    const el = track.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  };

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const page = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const navButton =
    "inline-flex size-11 items-center justify-center rounded-full border border-ivory/30 transition-colors hover:border-sand hover:bg-sand hover:text-charcoal disabled:pointer-events-none disabled:opacity-30";

  return (
    <section aria-labelledby="featured-title" className="relative overflow-hidden bg-turquoise-deep py-16 text-ivory md:py-20 lg:py-24">
      <div className="shell">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div>
            <p className="eyebrow text-sand/80">From the menu</p>
            <h2 id="featured-title" className="mt-4 max-w-2xl text-headline">
              Plates worth <em className="text-sand">crossing</em> the table for.
            </h2>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <button type="button" onClick={() => page(-1)} disabled={edges.start} aria-label="Previous dishes" aria-controls="featured-track" className={navButton}>
              <ArrowLeft />
            </button>
            <button type="button" onClick={() => page(1)} disabled={edges.end} aria-label="Next dishes" aria-controls="featured-track" className={navButton}>
              <ArrowRight />
            </button>
          </div>
        </div>

        <ul
          ref={track}
          id="featured-track"
          aria-label="Featured dishes"
          onScroll={measure}
          className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pb-2 sm:-mx-0 sm:scroll-px-0 sm:px-0 md:mt-12 lg:gap-8"
        >
          {dishes.map((dish) => (
            <li
              key={dish.key}
              className="group flex shrink-0 basis-[74%] snap-start flex-col items-center text-center sm:basis-[calc((100%-1.25rem)/2)] md:basis-[calc((100%-2.5rem)/3)] lg:basis-[calc((100%-6rem)/4)]"
            >
              {/* Double rim: a fine cream ring around a white plate edge. */}
              <div className="w-full rounded-full border border-ivory/60 p-[5px] md:p-1.5">
                <div className="relative aspect-square overflow-hidden rounded-full border-[5px] border-white shadow-[0_24px_50px_-24px_rgb(0_0_0/0.6)] md:border-[6px]">
                  <Image
                    src={dish.image.src}
                    alt={dish.image.alt}
                    fill
                    sizes="(min-width: 1024px) 24vw, (min-width: 768px) 31vw, (min-width: 640px) 46vw, 74vw"
                    placeholder={dish.image.blurDataUrl ? "blur" : "empty"}
                    blurDataURL={dish.image.blurDataUrl}
                    draggable={false}
                    className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]"
                  />
                </div>
              </div>
              <p className="eyebrow mt-6 text-[0.68rem] text-sand/80">{dish.categoryName}</p>
              <h3 className="mt-2 font-serif text-[clamp(1.35rem,1.15rem+0.6vw,1.65rem)] leading-tight">{dish.name}</h3>
              {dish.description && <p className="mt-2 line-clamp-3 max-w-xs text-sm leading-relaxed text-ivory/75">{dish.description}</p>}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex items-center justify-center gap-6 md:mt-12">
          <button type="button" onClick={() => page(-1)} disabled={edges.start} aria-label="Previous dishes" aria-controls="featured-track" className={clsx(navButton, "md:hidden")}>
            <ArrowLeft />
          </button>
          <Link href="/menu" className="link-line eyebrow text-sand">
            See the full menu
          </Link>
          <button type="button" onClick={() => page(1)} disabled={edges.end} aria-label="Next dishes" aria-controls="featured-track" className={clsx(navButton, "md:hidden")}>
            <ArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
}
