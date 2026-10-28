import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icons";
import { ImageReveal, Reveal } from "@/components/ui/Reveal";
import type { MediaAsset } from "@/lib/media";

/** Placement for each of the five tiles on a 12-column editorial grid. */
const TILES = [
  "col-span-12 md:col-span-7 md:row-span-2 aspect-[4/3] md:aspect-auto",
  "col-span-6 md:col-span-5 aspect-square md:aspect-[5/4]",
  "col-span-6 md:col-span-3 aspect-[3/4] md:aspect-auto",
  "col-span-7 md:col-span-2 md:col-start-11 md:row-start-2 aspect-[3/4] md:aspect-auto",
  "col-span-5 md:col-span-5 md:col-start-8 aspect-[4/5] md:aspect-[16/9]",
];

/** Section G — an asymmetric glimpse that leads into /gallery. */
export function GalleryPreview({ images }: { images: MediaAsset[] }) {
  return (
    <section aria-labelledby="gallery-preview-title" className="overflow-hidden bg-charcoal py-24 text-ivory md:py-36">
      <div className="shell flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <p className="eyebrow text-sand/70">The room, the plates</p>
          <h2 id="gallery-preview-title" className="mt-5 max-w-xl text-headline">
            Brick, glass &amp; <em className="text-turquoise">turquoise</em>.
          </h2>
        </Reveal>
        <Link href="/gallery" className="btn btn-light self-start md:self-auto">
          View Full Gallery <ArrowRight />
        </Link>
      </div>

      <div className="shell mt-14 grid grid-cols-12 gap-3 md:mt-20 md:auto-rows-[minmax(220px,auto)] md:gap-5">
        {images.slice(0, TILES.length).map((img, i) => (
          <ImageReveal key={img.slug} delay={i * 0.07} className={clsx("relative overflow-hidden", TILES[i])}>
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes={i === 0 ? "(min-width: 768px) 58vw, 100vw" : "(min-width: 768px) 40vw, 50vw"}
              placeholder="blur"
              blurDataURL={img.blurDataUrl}
              className="object-cover transition-transform duration-[1.4s] ease-out-soft hover:scale-[1.03]"
            />
          </ImageReveal>
        ))}
      </div>
    </section>
  );
}
