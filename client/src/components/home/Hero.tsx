"use client";

import clsx from "clsx";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { copy } from "@/content/copy";
import type { MediaAsset } from "@/lib/media";
import { ArrowRight } from "@/components/ui/Icons";

const ease = [0.22, 1, 0.36, 1] as const;
const ROTATE_MS = 7000;
const FADE_MS = 1200;

type Props = { backdrops: MediaAsset[] };

/**
 * Slow crossfade between interior photographs. Each image is mounted (and so
 * fetched) only once the one before it has loaded, and the reel never advances
 * to an image that isn't ready, so there are no blank frames. The outgoing image
 * stays fully opaque underneath while the next fades in on top, so the scene
 * never dips to the background colour. Reduced-motion users see the first image only.
 */
function HeroBackdrop({ images }: { images: MediaAsset[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [lastActive, setLastActive] = useState(0);
  const [mounted, setMounted] = useState(1);
  const loaded = useRef(new Set<number>());

  // Remember the outgoing image for the duration of the crossfade.
  if (lastActive !== active) {
    setPrevious(lastActive);
    setLastActive(active);
  }
  useEffect(() => {
    if (previous === null) return;
    const t = setTimeout(() => setPrevious(null), FADE_MS + 100);
    return () => clearTimeout(t);
  }, [previous]);

  const handleLoad = useCallback(
    (i: number) => {
      loaded.current.add(i);
      setMounted((m) => Math.max(m, Math.min(images.length, i + 2)));
    },
    [images.length],
  );

  useEffect(() => {
    if (reduce !== false || images.length < 2) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      setActive((a) => {
        const next = (a + 1) % images.length;
        return loaded.current.has(next) ? next : a;
      });
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [reduce, images.length]);

  return images.slice(0, reduce === false ? mounted : 1).map((img, i) => (
    <Image
      key={img.slug}
      src={img.src}
      alt={i === active ? img.alt : ""}
      aria-hidden={i === active ? undefined : true}
      fill
      priority={i === 0}
      fetchPriority={i === 0 ? "high" : undefined}
      loading={i === 0 ? undefined : "eager"}
      sizes="100vw"
      placeholder={i === 0 ? "blur" : "empty"}
      blurDataURL={i === 0 ? img.blurDataUrl : undefined}
      onLoad={() => handleLoad(i)}
      className={clsx(
        "object-cover object-[50%_45%] transition-opacity ease-in-out",
        i === active || i === previous ? "opacity-100" : "opacity-0",
        i === active ? "z-[1]" : "z-0",
      )}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    />
  ));
}

/**
 * Cinematic, centred hero: the real dining room full-bleed and rotating, with
 * a single column of eyebrow, headline, description and actions over a
 * balanced overlay. A gentle background parallax and a short entrance sequence.
 */
export function Hero({ backdrops }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate flex flex-col min-h-screen overflow-hidden bg-charcoal text-ivory supports-[min-height:100svh]:min-h-[100svh] sm:h-[100svh] sm:min-h-[600px] sm:items-center sm:justify-center"
    >
      <motion.div className="absolute inset-x-0 -bottom-6 -top-6 -z-20 sm:inset-y-0" style={{ y: bgY }}>
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08, opacity: 0.4 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease }}
        >
          <HeroBackdrop images={backdrops} />
        </motion.div>
      </motion.div>
      {/* Even wash + a soft pool of shade behind the centred text, deepening toward the edges and foot. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-charcoal/40" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_62%_at_50%_54%,rgba(39,38,34,0.62)_0%,rgba(39,38,34,0.3)_55%,rgba(39,38,34,0.1)_100%)]"
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-2/5 bg-gradient-to-t from-charcoal/85 to-transparent" />

      {/*
        Mobile-first spacing matching approved visual reference:
        Dedicated mobile content wrapper positioned at ~33.5svh from top of viewport,
        placing Eyebrow at 34%, Heading at 39%, Description spanning 49-64%,
        Explore Menu at 70%, and Reserve a Table finishing at 83% (17% floor clearance).
        From sm up, the desktop centered layout is completely preserved.
      */}
      <div className="shell relative flex w-full flex-col min-h-[100svh] supports-[min-height:100svh]:min-h-[100svh] sm:min-h-0 sm:justify-center sm:pb-8 sm:pt-24 md:pb-12 md:pt-32 lg:pt-40">
        {/* Dedicated mobile content wrapper with viewport-relative positioning */}
        <div className="relative w-full max-sm:top-[33.5svh] sm:static">
          {/* Text entrance is CSS so it plays before hydration. */}
          <motion.div
            className="mx-auto flex w-full max-w-4xl flex-col items-center text-center lg:max-w-5xl"
            style={{ opacity: fade }}
          >
            {/* A lightened tint of the brand gold: the pure tone is too dark to read over brick. */}
            <p className="eyebrow anim-fade-up flex items-center gap-4 text-[color-mix(in_oklab,var(--color-gold)_72%,var(--color-ivory))] [animation-delay:250ms] md:text-[0.78rem] lg:gap-5 lg:text-[0.82rem]">
              <span aria-hidden className="h-px w-8 bg-gold/60 md:w-12 lg:w-16" />
              {copy.hero.eyebrow}
              <span aria-hidden className="h-px w-8 bg-gold/60 md:w-12 lg:w-16" />
            </p>
            <h1
              id="hero-title"
              className="mt-[2.75svh] text-[clamp(2.75rem,11.5vw,3.25rem)] font-[340] leading-none tracking-[0.015em] [font-variation-settings:'SOFT'_30,'WONK'_0,'opsz'_144] sm:mt-4 sm:text-[clamp(4.25rem,1.8rem+8.6vw,9.5rem)] md:mt-6"
            >
              <span className="block overflow-hidden pb-[0.1em]">
                <span className="anim-rise block [animation-delay:350ms]">{copy.hero.heading}</span>
              </span>
            </h1>
            <p className="anim-fade-up mt-[4.25svh] w-[82%] max-w-[340px] px-1 text-[0.9375rem] leading-[1.75] text-ivory/85 [animation-delay:600ms] sm:mt-4 sm:w-auto sm:max-w-[36rem] sm:px-0 sm:text-base sm:leading-[1.7] md:mt-6 md:text-[1.0625rem] lg:max-w-[42rem] lg:text-[1.1875rem]">
              {copy.hero.body}
            </p>
            <div className="anim-fade-up mt-[6svh] flex w-[78%] max-w-[330px] flex-col gap-4 [animation-delay:750ms] sm:w-auto sm:max-w-none sm:flex-row sm:gap-4 sm:mt-8 md:mt-12 lg:mt-14">
              <Link
                href="/menu"
                className="btn min-h-[50px] w-full rounded-[10px] border border-ivory/35 bg-ivory/[0.06] px-8 py-0 text-sm font-semibold tracking-[0.12em] text-ivory hover:border-ivory/70 hover:bg-ivory/[0.14] sm:min-h-[3.25rem] sm:py-[0.85rem] sm:w-auto lg:min-h-14 lg:px-10"
              >
                Explore Menu
              </Link>
              <Link
                href="#reserve"
                className="btn btn-primary min-h-[50px] w-full rounded-[10px] px-8 py-0 text-sm font-semibold tracking-[0.12em] sm:min-h-[3.25rem] sm:py-[0.85rem] sm:w-auto lg:min-h-14 lg:px-10"
              >
                Reserve a Table <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
