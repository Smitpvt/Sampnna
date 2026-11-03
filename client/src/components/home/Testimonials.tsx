"use client";

import clsx from "clsx";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Star } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import type { Testimonial } from "@/content/guests";
import { cormorant } from "@/lib/fonts";

/** How long each card rests before advancing by one. */
const AUTOPLAY_MS = 3000;

/** Card surfaces, cycled: warm cream, a breath of terracotta, a breath of turquoise. */
const SURFACES = ["bg-ivory", "bg-[#f3e2d9]", "bg-[#dce9e5]"];

/**
 * Section F — "Words from Our Guests".
 *
 * Horizontal row of review cards displaying one centered card on mobile and the approved
 * 3-column row on desktop. Automatically advances every 3 seconds with seamless looping.
 * Supports native touch swiping on mobile and click-and-drag on desktop.
 */
export function Testimonials({ items, preview = false }: { items: Testimonial[]; preview?: boolean }) {
  const track = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 2 sets of items to enable seamless infinite looping
  const allReviews = items.concat(items);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  /** Advance one card forward or backward, wrapping seamlessly at the clone boundary. */
  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const cards = el.querySelectorAll("li");
    if (!cards || cards.length === 0) return;
    const card = cards[0];
    const gap = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap) || 16;
    const by = card.getBoundingClientRect().width + gap;
    const totalOriginalWidth = items.length * by;

    // Check if we reached the boundary of the original set
    if (el.scrollLeft >= totalOriginalWidth - 10) {
      el.scrollLeft -= totalOriginalWidth;
    } else if (el.scrollLeft <= 5 && dir === -1) {
      el.scrollLeft += totalOriginalWidth;
    }

    el.scrollBy({ left: dir * by, behavior: reduce ? "auto" : "smooth" });
  };

  // Autoplay rotation every 3 seconds
  useEffect(() => {
    if (reduce || paused || hidden || items.length < 2) return;
    const t = window.setInterval(() => step(1), AUTOPLAY_MS);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, paused, hidden, items.length]);

  // Pointer event handlers for desktop mouse click-and-drag
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const el = track.current;
    if (!el) return;

    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startScrollLeftRef.current = el.scrollLeft;
    hasMovedRef.current = false;
    setPaused(true);

    try {
      el.setPointerCapture(e.pointerId);
    } catch {}
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const el = track.current;
    if (!el) return;

    const dx = e.clientX - startXRef.current;
    if (Math.abs(dx) > 4) {
      hasMovedRef.current = true;
      if (!isDragging) setIsDragging(true);
    }

    if (hasMovedRef.current) {
      el.scrollLeft = startScrollLeftRef.current - dx;
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const el = track.current;
    if (el) {
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {}
    }

    isDraggingRef.current = false;
    setIsDragging(false);

    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setPaused(false);
    }, AUTOPLAY_MS);
  };

  const onPointerCancel = onPointerUp;

  return (
    <section aria-labelledby="guests-title" className={clsx("bg-[#efe5d6] py-10 md:py-12", cormorant.variable)}>
      <div className="shell">
        {/* Restored original centered heading */}
        <Reveal className="text-center">
          <p className="eyebrow text-turquoise-deep">In their words</p>
          <h2 id="guests-title" className="mt-3 font-[family-name:var(--font-cormorant)] text-[clamp(2.4rem,1.4rem+2.6vw,4.2rem)] font-normal leading-[0.96] tracking-[-0.02em]">
            Words from <em className="text-terracotta-deep">Our</em> Guests
          </h2>
        </Reveal>

        {/* Development-only note */}
        {preview && (
          <p className="mt-6 text-center text-[0.7rem] text-ink-soft md:text-left">
            Dev preview: placeholder cards, not real reviews — add genuine ones in <code>content/guests.ts</code>.
          </p>
        )}

        {/* Testimonials carousel track */}
        <ul
          ref={track}
          id="guest-reviews"
          aria-label="Guest reviews"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => !isDraggingRef.current && setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          className={clsx(
            "no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:mt-8 md:scroll-px-0 md:gap-6 md:px-0 select-none touch-pan-y focus:outline-none",
            isDragging ? "cursor-grabbing" : "cursor-grab"
          )}
        >
          {allReviews.map((t, i) => (
            <li
              key={`${i}-${t.id}`}
              className="shrink-0 min-w-0 snap-center basis-[calc(100vw-2.5rem)] sm:basis-[60%] md:basis-[calc((100%-1.5rem)/2)] lg:basis-[calc((100%-3rem)/3)] h-[360px]"
            >
              <figure className={clsx("relative flex h-[360px] min-w-0 flex-col rounded-[6px] p-6 sm:p-7 lg:p-7 pointer-events-none", SURFACES[i % SURFACES.length])}>
                <span aria-hidden className="pointer-events-none select-none absolute right-6 top-2 font-[family-name:var(--font-cormorant)] text-[4.5rem] lg:text-[5rem] leading-none text-terracotta/20">
                  “
                </span>
                <div>
                  <Stars rating={t.rating} />
                </div>
                <blockquote className="mt-4 flex-1 min-w-0 overflow-y-auto no-scrollbar font-[family-name:var(--font-cormorant)] text-[1.15rem] leading-[1.35] text-charcoal sm:text-[1.25rem] lg:text-[1.28rem] pr-1 whitespace-normal break-words">
                  {t.text}
                </blockquote>
                <figcaption className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-charcoal/10 pt-4">
                  <span className="eyebrow text-charcoal">{t.name}</span>
                  {(t.source || t.date) && <span className="text-xs text-ink-soft">{[t.source, t.date].filter(Boolean).join(" · ")}</span>}
                  {preview && (
                    <span className="ml-auto rounded-full border border-terracotta/40 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-terracotta-deep">
                      Placeholder
                    </span>
                  )}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        {/* Quiet sign-off beneath reviews */}
        <Reveal className="mt-7 text-center md:mt-8">
          <p className="font-[family-name:var(--font-cormorant)] text-[1.25rem] italic leading-tight text-charcoal/85 md:text-[1.4rem]">
            We hope to welcome you <span className="text-terracotta-deep">again</span>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-1 text-terracotta" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className="size-3.5" filled={rating >= n - 0.25} />
      ))}
    </span>
  );
}
