import Image from "next/image";
import Link from "next/link";
import { copy } from "@/content/copy";
import type { MediaAsset } from "@/lib/media";
import { ArrowRight } from "@/components/ui/Icons";
import { ImageReveal, Reveal } from "@/components/ui/Reveal";

/** Section B — the meaning of Sampann. Image left, editorial text right. */
export function Story({ image, detail }: { image: MediaAsset; detail: MediaAsset }) {
  return (
    <section id="story" aria-labelledby="story-title" className="relative overflow-hidden bg-ivory py-24 md:py-36">
      <div className="shell grid items-center gap-14 md:grid-cols-12 md:gap-10">
        <div className="relative md:col-span-6 lg:col-span-5">
          <ImageReveal className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
              placeholder="blur"
              blurDataURL={image.blurDataUrl}
              className="object-cover"
            />
          </ImageReveal>
          <ImageReveal
            delay={0.25}
            className="absolute -bottom-10 -right-4 hidden aspect-square w-40 overflow-hidden border-8 border-ivory sm:block md:-right-16 lg:w-52"
          >
            <Image src={detail.src} alt={detail.alt} fill sizes="208px" placeholder="blur" blurDataURL={detail.blurDataUrl} className="object-cover" />
          </ImageReveal>
        </div>

        <div className="md:col-span-6 md:col-start-7 lg:col-span-6 lg:col-start-7">
          <Reveal>
            <p className="eyebrow text-terracotta">{copy.story.eyebrow}</p>
            <p className="mt-8 flex items-baseline gap-4" lang="mr">
              <span className="font-serif text-6xl text-turquoise-deep md:text-7xl">{copy.story.word}</span>
              <span className="eyebrow text-ink-soft" lang="en">
                {copy.story.pronunciation}
              </span>
            </p>
            <h2 id="story-title" className="mt-6 max-w-xl text-headline">
              {copy.story.heading}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8 max-w-lg space-y-5 text-lg leading-relaxed text-ink-soft">
              {copy.story.body.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
            </div>
            <Link href="/about" className="btn btn-dark mt-10">
              Discover Our Story <ArrowRight />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
