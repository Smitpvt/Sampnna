import clsx from "clsx";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { cormorant } from "@/lib/fonts";
import { ReservationForm } from "./ReservationForm";

/**
 * Section H — reservations, as a wide invitation postcard. The section keeps
 * its deep terracotta background; on it rests an ivory card with a fine double
 * terracotta border, spanning the screen with ~4.5% side margins. Left: the
 * Sampann building sketch with "A warm welcome, always.". Right: the
 * invitation heading, a small stamp and postmark, and the reservation request
 * form. On desktop the vertical spacing and the sketch's height follow the
 * screen height, so the whole section fits one laptop screen below the
 * navbar; on phones the sketch sits above the form and the page scrolls.
 */
export function ReservationSection() {
  return (
    <section
      id="reserve"
      aria-labelledby="reserve-title"
      className={clsx(
        // Desktop: the top padding just clears the fixed 4.5rem navbar, so the card sits high in the section;
        // the bottom padding carries the remaining terracotta.
        "relative isolate bg-terracotta-deep px-4 py-12 md:px-8 md:py-14",
        "lg:px-[clamp(1.5rem,4.5vw,5rem)] lg:pb-[clamp(2.5rem,6svh,4rem)] lg:pt-[calc(4.5rem+0.25rem)]",
        cormorant.variable,
      )}
    >
      <Reveal className="relative mx-auto w-full max-w-[110rem] rounded-[6px] bg-[#fcf8f0] text-charcoal shadow-[0_30px_60px_-30px_rgb(39_20_12/0.6),0_8px_20px_-12px_rgb(39_20_12/0.35)]">
        {/* Fine double-line terracotta border, inset from the card's edge. */}
        <span aria-hidden className="pointer-events-none absolute inset-[10px] rounded-[2px] border border-terracotta/35" />
        <span aria-hidden className="pointer-events-none absolute inset-[14px] rounded-[1px] border border-terracotta/20" />

        <div className="relative grid gap-10 px-6 py-10 sm:px-10 md:py-12 lg:grid-cols-[50fr_50fr] lg:gap-0 lg:px-[clamp(2.5rem,4vw,4.5rem)] lg:py-[clamp(1.25rem,3svh,2.5rem)]">
          {/* Left: the building sketch and the postcard greeting */}
          <div className="flex flex-col lg:pr-[clamp(2rem,3.5vw,4rem)]">
            <div className="relative flex flex-1 items-center justify-center">
              {/* The sketch's own soft edges are carried into the card with a gentle mask — no colour change.
                  On desktop its height is capped by the screen height so the whole card fits one laptop screen. */}
              <Image
                src="/images/other/sampann-sketch.webp"
                alt="Pencil sketch of the Sampann building: a brick pavilion with a large central arch, steps up to the entrance and palms around it"
                width={1232}
                height={848}
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="h-auto w-full max-w-[36rem] [mask-image:radial-gradient(ellipse_75%_75%_at_50%_50%,#000_70%,transparent_100%)] lg:max-h-[min(30rem,calc(100svh-17.5rem))] lg:w-auto lg:max-w-full"
              />
            </div>
            <div className="mt-8 flex items-baseline justify-between gap-4 border-t border-terracotta/40 pt-4 lg:mt-5 lg:pt-3">
              <p className="font-[family-name:var(--font-cormorant)] text-[1.35rem] italic text-turquoise-deep md:text-[1.5rem]">A warm welcome, always.</p>
              <p className="eyebrow text-[0.62rem] text-ink-soft">Chaul · Alibaug</p>
            </div>
          </div>

          {/* Right: invitation and form, set off by a fine vertical rule on desktop */}
          <div className="relative lg:border-l lg:border-terracotta/25 lg:pl-[clamp(2rem,3.5vw,4rem)]">
            {/* Hidden on 1024–1279px screens only, where the right column is too narrow for the stamp beside the heading. */}
            <Stamp className="absolute -top-2 right-0 hidden w-[7.5rem] sm:block lg:hidden xl:block" />

            <p className="eyebrow flex items-center gap-3 text-turquoise-deep">
              <span aria-hidden className="h-px w-8 bg-turquoise-deep/60" />
              Your table awaits
            </p>
            <h2 id="reserve-title" className="mt-4 font-[family-name:var(--font-cormorant)] text-[clamp(2.2rem,1.6rem+1.8vw,3.2rem)] font-normal leading-[1.04] tracking-[-0.01em] sm:pr-32 lg:mt-3 lg:pr-0 xl:pr-32 lg:text-[clamp(2.4rem,1.1rem+1.6vw,3.1rem)]">
              Come for the flavours.
              <br />
              <em className="text-terracotta-deep">Stay for the moments.</em>
            </h2>
            <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-ink-soft sm:pr-6 lg:mt-3 lg:max-w-[30rem]">
              Every visit deserves a place of its own. Tell us when you&apos;re coming, and we&apos;ll make sure there&apos;s a table waiting for you.
            </p>

            <div className="mt-7 lg:mt-4">
              <ReservationForm />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/** A small printed stamp (terracotta, perforated, with a line drawing of the arch) and a turquoise postmark over its corner. */
function Stamp({ className }: { className?: string }) {
  const card = "#fcf8f0";
  // Perforations: little card-coloured circles around the stamp's edge.
  const holes: [number, number][] = [];
  for (let x = 4; x <= 76; x += 6) holes.push([x, 0], [x, 100]);
  for (let y = 4; y <= 96; y += 6) holes.push([0, y], [80, y]);

  return (
    <svg viewBox="-34 -6 120 132" aria-hidden className={className}>
      <g transform="rotate(3 40 50)">
        <rect x="0" y="0" width="80" height="100" fill="var(--color-terracotta)" />
        {holes.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.3" fill={card} />
        ))}
        <rect x="6" y="6" width="68" height="88" fill="none" stroke={card} strokeOpacity="0.55" strokeWidth="0.6" />
        <text x="40" y="15" textAnchor="middle" fontSize="4.6" letterSpacing="0.8" fill={card} fontFamily="var(--font-manrope), sans-serif">
          CHAUL · ALIBAUG
        </text>
        {/* Roof line, the big arch, the inner arch and the steps — the building in a few strokes. */}
        <g fill="none" stroke={card} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" opacity="0.92">
          <path d="M14 34 L40 22 L66 34" />
          <path d="M18 34 V66 M62 34 V66" />
          <path d="M27 66 V48 A13 13 0 0 1 53 48 V66" />
          <path d="M34 66 V52 A6 6 0 0 1 46 52 V66" />
          <path d="M24 70 H56 M21 74 H59 M18 78 H62" />
        </g>
        <text x="40" y="90" textAnchor="middle" fontSize="6.2" letterSpacing="1.2" fontWeight="700" fill={card} fontFamily="var(--font-manrope), sans-serif">
          SAMPANN
        </text>
      </g>
      {/* Postmark */}
      <g fill="none" stroke="var(--color-turquoise-deep)" opacity="0.75">
        <circle cx="-4" cy="88" r="27" strokeWidth="0.9" />
        <circle cx="-4" cy="88" r="17" strokeWidth="0.6" />
        <path id="postmark-arc" d="M -27 88 A 23 23 0 1 1 19 88 A 23 23 0 1 1 -27 88" stroke="none" />
      </g>
      <text fontSize="4.4" letterSpacing="1.4" fill="var(--color-turquoise-deep)" opacity="0.8" fontFamily="var(--font-manrope), sans-serif">
        <textPath href="#postmark-arc">SAMPANN · ALIBAUG · SAMPANN · ALIBAUG ·</textPath>
      </text>
      <text textAnchor="middle" fontSize="4.2" letterSpacing="0.5" fill="var(--color-turquoise-deep)" opacity="0.8" fontFamily="var(--font-manrope), sans-serif">
        <tspan x="-4" y="86.5">MADE WITH</tspan>
        <tspan x="-4" y="92.5">WARMTH</tspan>
      </text>
    </svg>
  );
}
