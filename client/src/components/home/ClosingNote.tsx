import clsx from "clsx";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { cormorant } from "@/lib/fonts";
import type { ImageRef } from "@/types/content";

/**
 * The closing quote. The quote sits on the left; on the right, a tall arched
 * photograph of the dining room by the garden window, a muted turquoise arch
 * set behind it and offset down-right, and a smaller food photograph
 * overlapping its lower-left corner.
 *
 * The whole composition is sized from one value, --h (the arch height). On
 * desktop it is the screen height left after the fixed navbar, the padding
 * and the photos' overhang (capped at 46rem), so the section fits one screen
 * at 1366×768 and 1440×900 and grows on larger monitors; below lg it follows
 * the width instead, and the columns stack.
 */
export function ClosingNote({ main, detail }: { main: ImageRef; detail: ImageRef }) {
  return (
    <section aria-label="A note from Sampann" className={clsx("overflow-hidden bg-[#f5eee3]", cormorant.variable)}>
      {/* Desktop: a wide container (side margins ~5vw) split into the quote column and the photo group.
          Top padding clears the fixed 4.5rem navbar, so the top of the arch is never hidden under it.
          --h (the arch height) is set here so the quote column can align with the main photo too. */}
      <div
        className={clsx(
          "mx-auto grid w-full max-w-[120rem] items-center gap-14 px-5 py-16 md:px-10 md:py-20",
          "[--h:min(30rem,calc((100vw-2rem)/1.1))] md:[--h:34rem]",
          "lg:min-h-svh lg:grid-cols-[auto_auto] lg:justify-center lg:gap-[clamp(3rem,5.5vw,6.5rem)] lg:px-[clamp(2.5rem,4.5vw,6rem)] lg:pb-[clamp(1.5rem,4svh,3rem)] lg:pt-[calc(4.5rem+clamp(1rem,3svh,2rem))]",
          // Arch height = the screen height left after the navbar, padding and the photos' overhang.
          "lg:[--h:clamp(20rem,calc((100svh-4.5rem-clamp(1rem,3svh,2rem)-clamp(1.5rem,4svh,3rem))/1.08),46rem)]",
        )}
      >
        {/* Left-aligned. On desktop both columns size to their content and are centred together, so extra
            width on large screens goes to the outer margins evenly rather than opening a gap in the middle.
            The bottom margin matches the photo group's overhang so the quote lines up with the main photo. */}
        {/* On wide screens the text block is nudged left (up to 4.5rem) so it sits a little nearer the page edge;
            translate leaves the photos and the grid exactly where they are. No shift at 1440px and below. */}
        <Reveal className="lg:mb-[calc(var(--h)*0.07)] lg:justify-self-start lg:-translate-x-[clamp(0rem,calc((100vw-1440px)*0.2),4.5rem)]">
          <p className="eyebrow text-[0.74rem] text-turquoise-deep md:text-[0.78rem]">A little something from Sampann</p>
          {/* Three natural phrases on desktop; balanced wrapping on smaller screens. Sized by both height and
              width so the longest phrase always fits beside the photos. */}
          <blockquote className="mt-[clamp(1.25rem,3.5svh,2.25rem)] max-w-[11em] text-balance font-[family-name:var(--font-cormorant)] text-[clamp(3rem,9svh,5.6rem)] font-normal leading-[1.02] tracking-[-0.02em] text-charcoal lg:max-w-none lg:text-[clamp(3.4rem,min(10.3svh,5.6vw),6.8rem)]">
            <span className="lg:block">Our greatest reward</span> <span className="lg:block">is seeing you leave</span>{" "}
            <span className="lg:block">
              with a{" "}
              <em className="text-terracotta-deep">
                <span className="relative inline-block">
                  smile
                  {/* A hand-drawn-feeling smile curve under the word, in the same terracotta. */}
                  <svg
                    aria-hidden
                    viewBox="0 0 100 20"
                    preserveAspectRatio="none"
                    className="absolute -bottom-[0.14em] left-[4%] h-[0.22em] w-[92%] overflow-visible"
                  >
                    <path d="M3 5 C 28 19, 72 19, 97 4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  </svg>
                </span>
                .
              </em>
            </span>
          </blockquote>
          <div className="mt-[clamp(1.25rem,4svh,2.25rem)]">
            <span aria-hidden className="block h-px w-12 bg-terracotta/60" />
            <p className="eyebrow mt-4 text-[0.74rem] text-ink-soft md:text-[0.78rem]">With love, from Sampann</p>
            <p className="eyebrow mt-2 text-[0.64rem] text-ink-soft/70">Chaul · Alibaug</p>
          </div>
        </Reveal>

        {/* Margins leave room for the turquoise arch (right, below) and the food photo (left, below) that overhang. */}
        <Reveal
          delay={0.12}
          className={clsx(
            // 2xl: a wider arch and larger modak photo on big monitors only — at laptop widths they would overflow.
            "relative mx-auto w-[calc(var(--h)*0.78)] lg:mx-0 2xl:w-[calc(var(--h)*0.9)]",
            "mb-[calc(var(--h)*0.07)] ml-[calc(var(--h)*0.17)] mr-[calc(var(--h)*0.1)] 2xl:ml-[calc(var(--h)*0.2)]",
          )}
        >
          <span
            aria-hidden
            className="absolute inset-0 translate-x-[calc(var(--h)*0.1)] translate-y-[calc(var(--h)*0.065)] rounded-b-[18px] rounded-t-full bg-[#d9e7e3]"
          />
          <div className="relative h-[var(--h)] overflow-hidden rounded-b-[14px] rounded-t-full">
            <Image
              src={main.src}
              alt={main.alt}
              fill
              sizes="(min-width: 1024px) 36rem, 80vw"
              placeholder={main.blurDataUrl ? "blur" : "empty"}
              blurDataURL={main.blurDataUrl}
              className="object-cover object-[46%_0%]"
            />
          </div>
          <div className="absolute bottom-[calc(var(--h)*-0.07)] left-[calc(var(--h)*-0.17)] aspect-[4/5] w-[calc(var(--h)*0.34)] overflow-hidden 2xl:left-[calc(var(--h)*-0.2)] 2xl:w-[calc(var(--h)*0.38)] rounded-[10px] ring-[6px] ring-[#f5eee3]">
            <Image
              src={detail.src}
              alt={detail.alt}
              fill
              sizes="(min-width: 1024px) 15rem, 34vw"
              placeholder={detail.blurDataUrl ? "blur" : "empty"}
              blurDataURL={detail.blurDataUrl}
              className="object-cover object-[45%_60%]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
