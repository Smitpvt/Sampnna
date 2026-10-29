import { Tiro_Devanagari_Marathi } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { copy } from "@/content/copy";
import type { MediaAsset } from "@/lib/media";
import { ArrowRight } from "@/components/ui/Icons";
import { ImageReveal, Reveal } from "@/components/ui/Reveal";

/** Fraunces and Manrope have no Devanagari glyphs; this Marathi serif sets संपन्न and inline Marathi words properly. */
const devanagari = Tiro_Devanagari_Marathi({ subsets: ["devanagari"], weight: "400", display: "swap" });

/** Wrap runs of Devanagari inside English copy so they render in the Marathi serif. */
function withDevanagari(text: string) {
  return text.split(/([ऀ-ॿ]+(?:\s+[ऀ-ॿ]+)*)/).map((part, i) =>
    /[ऀ-ॿ]/.test(part) ? (
      <span key={i} lang="mr" className={devanagari.className}>
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/**
 * Section B — what Sampann means. A wide landscape photo of the dining room
 * with two smaller photos overlapping its top-left and bottom-right corners,
 * beside the word and a short welcome. On laptops the collage takes the wider
 * column and the text is set compactly so both sides match in height and the
 * whole section fits on one screen; phones stack and scroll.
 */
export function Story({ images }: { images: MediaAsset[] }) {
  const [large, topLeft, bottomRight] = images;

  // Laptops: the hero is exactly one screen tall, so one screen down this
  // section starts at the top of the window with the fixed 72px header over
  // it. It therefore spans a full screen (100vh, equal to svh on desktop),
  // with the header's height added to its top padding so the content centres
  // in the visible area and the next section starts exactly at the fold.
  return (
    <section
      id="story"
      aria-labelledby="story-title"
      className="relative flex items-center overflow-hidden bg-ivory py-16 md:py-20 lg:min-h-screen lg:pb-10 lg:pt-[calc(4.5rem+2.5rem)]"
    >
      <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-14 xl:grid-cols-[7fr_5fr]">
        {/* Words */}
        <div className="lg:order-2">
          <Reveal>
            <p className="eyebrow text-terracotta">{copy.story.eyebrow}</p>
            <span aria-hidden className="mt-3 block h-px w-12 bg-terracotta/70" />
            <p className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1">
              <span lang="mr" className={`${devanagari.className} text-[clamp(3.5rem,2.5rem+2.4vw,4.5rem)] leading-[1.1] text-turquoise`}>
                {copy.story.word}
              </span>
              <span className="eyebrow text-ink-soft">{copy.story.pronunciation}</span>
            </p>
            <h2 id="story-title" className="mt-3 max-w-xl text-[clamp(1.875rem,1.2rem+1.6vw,2.5rem)] leading-[1.1]">
              {copy.story.heading}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-5 max-w-xl space-y-3.5 text-base leading-[1.7] text-ink-soft">
              {copy.story.body.map((p) => (
                <p key={p.slice(0, 24)}>{withDevanagari(p)}</p>
              ))}
            </div>
            <Link href="/about" className="eyebrow group mt-7 inline-flex items-center gap-2 py-2 text-terracotta transition-colors hover:text-terracotta-deep">
              <span className="underline decoration-1 underline-offset-[6px]">{copy.story.cta}</span>
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        {/*
          Collage: a wide 3:2 dining-room photo filling its column, with a small
          portrait photo over the top-left corner and a landscape one over the
          bottom-right. The 2rem margin is exactly the corner photos' overhang,
          so nothing spills outside the column.
        */}
        <div className="relative m-8 lg:order-1">
          <ImageReveal className="relative aspect-[3/2] overflow-hidden">
            <Image
              src={large.src}
              alt={large.alt}
              fill
              sizes="(min-width: 1280px) 640px, (min-width: 1024px) 45vw, 85vw"
              placeholder="blur"
              blurDataURL={large.blurDataUrl}
              className="object-cover"
            />
          </ImageReveal>
          <ImageReveal
            delay={0.15}
            className="absolute -left-8 -top-8 aspect-[3/4] w-[32%] overflow-hidden border-[6px] border-ivory lg:w-[26%]"
          >
            <Image src={topLeft.src} alt={topLeft.alt} fill sizes="(min-width: 1024px) 170px, 25vw" placeholder="blur" blurDataURL={topLeft.blurDataUrl} className="object-cover" />
          </ImageReveal>
          <ImageReveal
            delay={0.25}
            className="absolute -bottom-8 -right-8 aspect-[4/3] w-[46%] overflow-hidden border-[6px] border-ivory lg:w-[38%]"
          >
            <Image src={bottomRight.src} alt={bottomRight.alt} fill sizes="(min-width: 1024px) 250px, 35vw" placeholder="blur" blurDataURL={bottomRight.blurDataUrl} className="object-cover" />
          </ImageReveal>
        </div>
      </div>
    </section>
  );
}
