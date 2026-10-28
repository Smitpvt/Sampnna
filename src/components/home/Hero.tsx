"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { copy } from "@/content/copy";
import type { MediaAsset } from "@/lib/media";
import { ArrowRight } from "@/components/ui/Icons";

const ease = [0.22, 1, 0.36, 1] as const;

type Props = { backdrop: MediaAsset; inset: MediaAsset; insetLabel: { name: string; category: string } };

/**
 * Cinematic, image-led hero: the dining room full-bleed, a portrait dish
 * photograph set asymmetrically against it, and a short entrance sequence.
 * Parallax is limited to two layers moving at slightly different speeds.
 */
export function Hero({ backdrop, inset, insetLabel }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const insetY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative isolate flex min-h-[640px] h-[100svh] overflow-hidden bg-charcoal text-ivory">
      <motion.div className="absolute inset-0 -z-20" style={{ y: bgY }}>
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08, opacity: 0.4 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease }}
        >
          <Image
            src={backdrop.src}
            alt={backdrop.alt}
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            placeholder="blur"
            blurDataURL={backdrop.blurDataUrl}
            className="object-cover object-[50%_45%]"
          />
        </motion.div>
      </motion.div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal via-charcoal/45 to-charcoal/20" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal/70 via-charcoal/10 to-transparent" />

      <div className="shell relative flex w-full flex-col justify-end pb-16 pt-32 md:pb-20 lg:pb-24">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <motion.div className="lg:col-span-8" style={{ opacity: fade }}>
            {/* Text entrance is CSS so it plays before hydration. */}
            <p className="eyebrow anim-fade-up text-sand [animation-delay:250ms]">{copy.hero.eyebrow}</p>
            <h1 id="hero-title" className="mt-6 text-display">
              {copy.hero.lines.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.08em]">
                  <span className={`anim-rise block ${i === 1 ? "italic text-sand" : ""}`} style={{ animationDelay: `${350 + i * 120}ms` }}>
                    {line}
                  </span>
                </span>
              ))}
            </h1>
            <div className="anim-fade-up [animation-delay:750ms]">
              <p className="mt-7 max-w-md text-base leading-relaxed text-ivory/85 md:text-lg">{copy.hero.body}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/menu" className="btn btn-primary">
                  Explore Menu <ArrowRight />
                </Link>
                <Link href="#reserve" className="btn btn-light">
                  Reserve a Table
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.figure
            className="relative hidden justify-self-end lg:col-span-4 lg:block"
            style={{ y: insetY }}
            initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 1.3, delay: 0.9, ease }}
          >
            <div className="relative aspect-[4/5] w-[min(22vw,320px)] overflow-hidden">
              <Image
                src={inset.src}
                alt={inset.alt}
                fill
                sizes="320px"
                placeholder="blur"
                blurDataURL={inset.blurDataUrl}
                className="object-cover"
              />
            </div>
            <figcaption className="mt-3 flex items-baseline justify-between gap-4 text-sm">
              <span className="font-serif text-lg">{insetLabel.name}</span>
              <span className="eyebrow text-ivory/60">{insetLabel.category}</span>
            </figcaption>
          </motion.figure>
        </div>
      </div>

      <motion.a
        href="#story"
        aria-label="Scroll to the story of Sampann"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-ivory/70 md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
      >
        <span className="eyebrow text-[0.62rem]">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-ivory/25">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-ivory"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.6 }}
          />
        </span>
      </motion.a>
    </section>
  );
}
