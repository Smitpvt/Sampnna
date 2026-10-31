"use client";

import clsx from "clsx";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import type { Testimonial } from "@/content/guests";
import { cormorant } from "@/lib/fonts";

/** How long each card rests before the row moves on by one. */
const AUTOPLAY_MS = 5500;

/** Card surfaces, cycled: warm cream, a breath of terracotta, a breath of turquoise. */
const SURFACES = ["bg-ivory", "bg-[#f3e2d9]", "bg-[#dce9e5]"];

/**
 * Section F — "Words from Our Guests". A horizontal row of review cards that
 * moves on by one card every few seconds and loops back at the end. It pauses
 * while the visitor hovers, focuses or touches it, while the tab is hidden,
 * and never auto-scrolls with reduced motion. Swipe or use the arrows to move
 * by hand. `preview` marks every card as a placeholder.
 */
export function Testimonials({ items, preview = false }: { items: Testimonial[]; preview?: boolean }) {
  const track = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  /** Move one card along (or back), wrapping at either end. */
  const step = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const by = card.getBoundingClientRect().width + gap;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    const atStart = el.scrollLeft <= 4;
    const behavior = reduce ? "auto" : "smooth";
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior });
    else if (dir === -1 && atStart) el.scrollTo({ left: el.scrollWidth, behavior });
    else el.scrollBy({ left: dir * by, behavior });
  };

  useEffect(() => {
    if (reduce || paused || hidden || items.length < 2) return;
    const t = window.setInterval(() => step(1), AUTOPLAY_MS);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, paused, hidden, items.length]);

  const navButton =
    "inline-flex size-11 items-center justify-center rounded-full border border-charcoal/25 text-charcoal transition-colors hover:border-terracotta hover:bg-terracotta hover:text-ivory";

  return (
    <section aria-labelledby="guests-title" className={clsx("bg-[#efe5d6] py-14 md:py-14", cormorant.variable)}>
      <div className="shell">
        <Reveal className="flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:justify-between md:text-left">
          <div>
            <p className="eyebrow text-turquoise-deep">In their words</p>
            <h2 id="guests-title" className="mt-4 font-[family-name:var(--font-cormorant)] text-[clamp(2.6rem,1.6rem+3vw,4.5rem)] font-normal leading-[0.95] tracking-[-0.02em]">
              Words from <em className="text-terracotta-deep">Our</em> Guests
            </h2>
          </div>
          {items.length > 1 && (
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => step(-1)} aria-label="Previous review" aria-controls="guest-reviews" className={navButton}>
                <ArrowLeft />
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Next review" aria-controls="guest-reviews" className={navButton}>
                <ArrowRight />
              </button>
            </div>
          )}
        </Reveal>

        {/* Development-only note (preview is never true in a production build). */}
        {preview && (
          <p className="mt-6 text-center text-[0.7rem] text-ink-soft md:text-left">
            Dev preview: placeholder cards, not real reviews — add genuine ones in <code>content/guests.ts</code>.
          </p>
        )}

        <ul
          ref={track}
          id="guest-reviews"
          aria-label="Guest reviews"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
          }}
          onPointerDown={(e) => e.pointerType !== "mouse" && setPaused(true)}
          onPointerUp={(e) => e.pointerType !== "mouse" && setPaused(false)}
          className="no-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:mt-10 md:scroll-px-0 md:gap-6 md:px-0"
        >
          {items.map((t, i) => (
            <li key={t.id} className="shrink-0 basis-[86%] snap-start sm:basis-[60%] md:basis-[calc((100%-1.5rem)/2)] lg:basis-[calc((100%-3rem)/3)]">
              <Reveal delay={Math.min(i, 3) * 0.08} className="h-full">
                <figure className={clsx("relative flex h-full flex-col rounded-[6px] px-7 pb-7 pt-8 md:px-8", SURFACES[i % SURFACES.length])}>
                  <span aria-hidden className="absolute right-7 top-3 font-[family-name:var(--font-cormorant)] text-[5.5rem] leading-none text-terracotta/20">
                    “
                  </span>
                  <Stars rating={t.rating} />
                  <blockquote className="mt-5 flex-1 font-[family-name:var(--font-cormorant)] text-[1.4rem] leading-[1.35] text-charcoal md:text-[1.5rem]">
                    {t.text}
                  </blockquote>
                  <figcaption className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-charcoal/10 pt-5">
                    <span className="eyebrow text-charcoal">{t.name}</span>
                    {(t.source || t.date) && <span className="text-xs text-ink-soft">{[t.source, t.date].filter(Boolean).join(" · ")}</span>}
                    {preview && (
                      <span className="ml-auto rounded-full border border-terracotta/40 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-terracotta-deep">
                        Placeholder
                      </span>
                    )}
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>

        {/* A quiet sign-off beneath the reviews, before the photographic closing quote. */}
        <Reveal className="mt-10 text-center">
          <p className="font-[family-name:var(--font-cormorant)] text-[1.3rem] italic leading-tight text-charcoal/85 md:text-[1.45rem]">
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
