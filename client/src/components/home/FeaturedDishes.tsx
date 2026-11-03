"use client";

import clsx from "clsx";
import { useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { FeaturedPlate } from "@/services/featured";

/** Share of the circle's diameter that every plate fills, leaving an even margin around it. */
const PLATE_FILL = 0.88;

/**
 * Clip the photo to its own plate outline (a hair inside, so none of the
 * file's surround shows), then scale and centre it so the plate's widest
 * span is PLATE_FILL of the circle — the same size for every dish.
 */
function plateStyle([cx, cy, rx, ry]: [number, number, number, number]): React.CSSProperties {
  const scale = PLATE_FILL / ((2 * Math.max(rx, ry)) / 100);
  return {
    clipPath: `ellipse(${(rx * 0.995).toFixed(2)}% ${(ry * 0.995).toFixed(2)}% at ${cx}% ${cy}%)`,
    transform: `scale(${scale.toFixed(4)}) translate(${(50 - cx).toFixed(2)}%, ${(50 - cy).toFixed(2)}%)`,
  };
}

/** Stationary rest duration per dish before auto-advancing. */
const STATIONARY_MS = 3000;
/** Autoplay glide duration — smooth, fluid, premium momentum. */
const AUTOPLAY_MOVE_MS = 1400;
/** Manual swipe/drag snap duration. */
const MANUAL_MOVE_MS = 600;
/** Classic luxury ease-in-out curve. */
const EASING = "cubic-bezier(0.65, 0, 0.35, 1)";

/**
 * Section C — "Flavours of Sampann".
 *
 * Buttery smooth, fluid autoplay carousel that rests stationary for 3 seconds per dish,
 * then glides over 1.4 seconds with a gentle ease-in-out curve. Seamless infinite looping
 * with zero visual jumps. Supports responsive mobile touch swiping (1 plate per view, centered)
 * and desktop mouse dragging (multi-plate row), pausing gracefully during interaction.
 */
export function FeaturedDishes({ plates }: { plates: FeaturedPlate[] }) {
  const n = plates.length;
  // 3 copies to support seamless infinite looping in both forward and backward directions
  const allPlates = plates.concat(plates, plates);

  // Start in the middle copy (index n)
  const [index, setIndex] = useState(n);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animDuration, setAnimDuration] = useState(AUTOPLAY_MOVE_MS);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [paused, setPaused] = useState(false);

  const trackRef = useRef<HTMLUListElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const isHorizontalRef = useRef<boolean | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reduce = useReducedMotion();

  // Helper to measure step distance between consecutive items
  const getStepWidth = useCallback(() => {
    if (trackRef.current && trackRef.current.children.length >= 2) {
      const first = trackRef.current.children[0] as HTMLElement;
      const second = trackRef.current.children[1] as HTMLElement;
      const diff = second.offsetLeft - first.offsetLeft;
      if (diff > 0) return diff;
    }
    return typeof window !== "undefined" ? window.innerWidth : 360;
  }, []);

  // Step forward or backward with specified transition duration
  const step = useCallback((dir: 1 | -1, duration = AUTOPLAY_MOVE_MS) => {
    setAnimDuration(duration);
    setIsAnimating(true);
    setIndex((prev) => prev + dir);
  }, []);

  // Start or schedule the 3-second stationary hold
  const scheduleNextAutoplay = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (reduce || paused || n < 2) return;
    timerRef.current = setTimeout(() => {
      step(1, AUTOPLAY_MOVE_MS);
    }, STATIONARY_MS);
  }, [reduce, paused, n, step]);

  // Seamless wrap at clone boundaries with zero flicker/jump
  const handleTransitionEnd = useCallback((e: React.TransitionEvent) => {
    if (e.target !== trackRef.current) return;
    const el = trackRef.current;
    if (!el) return;

    setIndex((current) => {
      let next = current;
      if (current >= 2 * n) {
        next = current - n;
      } else if (current < n) {
        next = current + n;
      }

      if (next !== current) {
        // Force synchronous non-animated repositioning so the jump is completely invisible
        el.style.transition = "none";
        el.style.transform = `translate3d(calc(${-next} * var(--step)), 0, 0)`;
        void el.offsetWidth; // Commit layout without transition
        setIsAnimating(false);
        return next;
      }

      setIsAnimating(false);
      return current;
    });

    // Each dish remains stationary for 3 seconds after transition completes
    scheduleNextAutoplay();
  }, [n, scheduleNextAutoplay]);

  // Handle autoplay scheduling on mount / unpause
  useEffect(() => {
    if (!paused && !reduce && !isDragging) {
      scheduleNextAutoplay();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [paused, reduce, isDragging, scheduleNextAutoplay]);

  // Pause when tab is hidden
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        setPaused(true);
        if (timerRef.current) clearTimeout(timerRef.current);
      } else {
        setPaused(false);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Pointer event handlers for mobile touch swipe & desktop mouse drag
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    isHorizontalRef.current = null;
    setIsDragging(true);
    setIsAnimating(false);
    setPaused(true);

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - startXRef.current;
    const dy = e.clientY - startYRef.current;

    // Detect gesture direction on touch
    if (isHorizontalRef.current === null) {
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
        if (Math.abs(dy) > Math.abs(dx)) {
          // Vertical gesture — allow browser to scroll page normally
          isHorizontalRef.current = false;
          isDraggingRef.current = false;
          setIsDragging(false);
          try {
            (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
          } catch {}
          return;
        } else {
          // Horizontal gesture — capture for carousel
          isHorizontalRef.current = true;
        }
      } else {
        return;
      }
    }

    if (!isHorizontalRef.current) return;
    setDragOffset(dx);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current && isHorizontalRef.current !== true) {
      isDraggingRef.current = false;
      setIsDragging(false);
      return;
    }

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    isDraggingRef.current = false;
    setIsDragging(false);

    const dx = dragOffset;
    const stepWidth = getStepWidth();
    const threshold = Math.max(stepWidth * 0.12, 40);

    setDragOffset(0);

    if (Math.abs(dx) >= threshold) {
      const rawSteps = Math.round(-dx / stepWidth);
      const steps = rawSteps !== 0 ? rawSteps : dx < 0 ? 1 : -1;
      step(steps > 0 ? 1 : -1, MANUAL_MOVE_MS);
    } else {
      // Spring back to current dish smoothly
      setAnimDuration(MANUAL_MOVE_MS);
      setIsAnimating(true);
    }

    // Resume stationary timer after manual interaction
    setPaused(false);
  };

  const onPointerCancel = onPointerUp;

  // Keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (timerRef.current) clearTimeout(timerRef.current);
      step(-1, MANUAL_MOVE_MS);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (timerRef.current) clearTimeout(timerRef.current);
      step(1, MANUAL_MOVE_MS);
    }
  };

  return (
    <section
      aria-labelledby="featured-title"
      className="relative bg-turquoise-deep py-14 text-ivory md:py-16 lg:flex lg:min-h-svh lg:flex-col lg:justify-center lg:pb-10 lg:pt-[calc(4.5rem+1.25rem)]"
    >
      <style>{`
        /* Mobile: 1 complete plate per view, centered */
        .plate-carousel-track {
          --gap: 0px;
          --step: 100vw;
        }
        .plate-carousel-slide {
          width: 100vw;
          margin-right: var(--gap);
        }
        .plate-carousel-circle {
          width: min(68vw, 17.5rem);
        }

        /* Desktop/tablet: original multi-plate row restored */
        @media (min-width: 640px) {
          .plate-carousel-track {
            --gap: 2rem;
            --plate: min(38vw, 20rem);
            --step: calc(var(--plate) + var(--gap));
          }
          .plate-carousel-slide {
            width: var(--plate);
            margin-right: var(--gap);
            display: block;
          }
          .plate-carousel-circle {
            width: 100%;
          }
        }

        @media (min-width: 1024px) {
          .plate-carousel-track {
            --gap: 2.5rem;
            --plate: min(23vw, calc(100svh - 22.5rem), 27rem);
            --step: calc(var(--plate) + var(--gap));
          }
        }
      `}</style>

      {/* Centered heading */}
      <div className="shell text-center">
        <p className="eyebrow text-sand/80">A taste of Sampann</p>
        <h2 id="featured-title" className="mt-3 text-headline">
          Flavours of <em className="text-sand">Sampann</em>
        </h2>
      </div>

      {/* Interactive carousel container */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured dishes"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => !isDraggingRef.current && setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => !isDraggingRef.current && setPaused(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        className={clsx(
          "mt-6 overflow-hidden pb-3 pt-6 md:mt-8 lg:mt-6 select-none touch-pan-y focus:outline-none",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
      >
        <ul
          ref={trackRef}
          onTransitionEnd={handleTransitionEnd}
          aria-label="Dishes from the Sampann kitchen"
          className="plate-carousel-track flex w-max items-start will-change-transform"
          style={{
            transform: `translate3d(calc(${-index} * var(--step) + ${dragOffset}px), 0, 0)`,
            transition: isAnimating ? `transform ${animDuration}ms ${EASING}` : "none",
          }}
        >
          {allPlates.map((plate, i) => (
            <li
              key={`${i}-${plate.src}`}
              aria-hidden={i < n || i >= 2 * n ? true : undefined}
              className="plate-carousel-slide flex shrink-0 flex-col items-center sm:block"
            >
              <div className="plate-carousel-circle pointer-events-none aspect-square rounded-full shadow-[0_10px_22px_-14px_rgb(0_0_0/0.55)]">
                <div className="relative size-full overflow-hidden rounded-full bg-ivory/[0.08] [clip-path:circle(50%)]">
                  <Image
                    src={plate.src}
                    alt={i >= n && i < 2 * n ? plate.alt : ""}
                    fill
                    sizes="(min-width: 1024px) 27rem, (min-width: 640px) 20rem, 17.5rem"
                    draggable={false}
                    className="pointer-events-none object-cover"
                    style={plateStyle(plate.plate)}
                  />
                </div>
              </div>
              <p className="mx-auto mt-3 line-clamp-2 max-w-[90%] text-center text-[0.95rem] font-medium leading-snug tracking-[0.01em] text-ivory/90 pointer-events-none md:mt-4">
                {plate.name}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Restored original Explore full menu button */}
      <div className="mt-6 text-center md:mt-8 lg:mt-6">
        <Link href="/menu" className="btn btn-light">
          Explore full menu
        </Link>
      </div>
    </section>
  );
}
