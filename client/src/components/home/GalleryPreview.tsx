import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icons";
import { ImageReveal, Reveal } from "@/components/ui/Reveal";
import { cormorant } from "@/lib/fonts";
import type { MediaAsset } from "@/lib/media";

/**
 * The eight tiles, in the order of HOME_MEDIA.gallery: grid area, per-breakpoint
 * aspect/crop, and responsive `sizes`. Desktop and tablet tiles fill their grid
 * cells; phones give each tile its own aspect ratio.
 */
const TILES = [
  // Dining room — large; 4:3 on phones with the arched doorway centred.
  { area: "[grid-area:d]", mobile: "aspect-[4/3]", pos: "object-[50%_50%]", sizes: "(min-width: 1024px) 42vw, (min-width: 768px) 66vw, 100vw" },
  // Tandoori skewer — tall; 4:5 on phones.
  { area: "[grid-area:s]", mobile: "aspect-[4/5]", pos: "object-[50%_40%]", sizes: "(min-width: 768px) 17vw, 50vw" },
  // Table for four — square on phones.
  { area: "[grid-area:t]", mobile: "aspect-square", pos: "object-[50%_50%]", sizes: "(min-width: 1024px) 25vw, (min-width: 768px) 34vw, 50vw" },
  // Mojito — square on phones.
  { area: "[grid-area:m]", mobile: "aspect-square", pos: "object-[50%_55%]", sizes: "(min-width: 768px) 17vw, 50vw" },
  // Seafood thali — large; 4:3 on phones, keeping the whole plate.
  { area: "[grid-area:h]", mobile: "aspect-[4/3]", pos: "object-[50%_52%]", sizes: "(min-width: 1024px) 42vw, (min-width: 768px) 66vw, 100vw" },
  // Flame — square on phones.
  { area: "[grid-area:f]", mobile: "aspect-square", pos: "object-[30%_50%]", sizes: "(min-width: 1024px) 25vw, (min-width: 768px) 34vw, 50vw" },
  // Modak — 4:5 on phones.
  { area: "[grid-area:o]", mobile: "aspect-[4/5]", pos: "object-[42%_60%]", sizes: "(min-width: 768px) 17vw, 50vw" },
  // Brownie — square on phones, framed so the pitcher and the chocolate pour stay in view.
  { area: "[grid-area:b]", mobile: "aspect-square", pos: "object-[56%_35%]", sizes: "(min-width: 768px) 17vw, 50vw" },
];

/**
 * Section G — "Come in. Look around. Feel at home." An eight-photo bento grid
 * on charcoal that leads into /gallery. 14px gaps at every size.
 *
 * Desktop (12 columns, three equal rows): the dining room and the seafood
 * thali are the two large tiles, on opposite corners; the skewer runs tall
 * between them. Tablet (6 columns, five rows) and phone (2 columns, natural
 * heights) re-stack the same tiles keeping that hierarchy.
 */
export function GalleryPreview({ images }: { images: MediaAsset[] }) {
  return (
    <section aria-labelledby="gallery-preview-title" className={clsx("overflow-hidden bg-charcoal pb-24 pt-20 text-ivory md:pb-32 md:pt-24 lg:pb-36 lg:pt-24", cormorant.variable)}>
      <div className="shell flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <p className="eyebrow flex items-center gap-4 text-sand/70">
            <span aria-hidden className="h-px w-10 bg-turquoise" />A closer look at Sampann
          </p>
          <h2
            id="gallery-preview-title"
            className="mt-6 max-w-3xl font-[family-name:var(--font-cormorant)] text-[clamp(2.6rem,1.4rem+3.4vw,4.6rem)] font-normal leading-[1.02] tracking-[-0.015em]"
          >
            Come in. Look around. <em className="text-turquoise">Feel at home.</em>
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-ivory/70">A glimpse of the flavours, spaces and little moments that make every visit special.</p>
        </Reveal>
        <Link href="/gallery" className="btn btn-light shrink-0 self-start md:self-auto">
          Explore the gallery <ArrowRight />
        </Link>
      </div>

      <div
        className={clsx(
          "shell mt-12 grid gap-[14px] md:mt-16",
          // Phone: two columns, each tile at its own aspect ratio.
          "grid-cols-2 [grid-template-areas:'d_d''s_o''h_h''t_m''f_b']",
          // Tablet: six columns × five rows, rows as tall as a column is wide.
          "md:aspect-[6/5] md:grid-cols-6 md:grid-rows-5 md:[grid-template-areas:'d_d_d_d_s_s''d_d_d_d_s_s''h_h_h_h_t_t''h_h_h_h_m_m''f_f_o_o_b_b']",
          // Desktop: the approved twelve-column bento, three square-ish rows.
          "lg:aspect-[1312/643] lg:grid-cols-12 lg:grid-rows-3 lg:[grid-template-areas:'d_d_d_d_d_s_s_t_t_t_m_m''d_d_d_d_d_s_s_h_h_h_h_h''f_f_f_o_o_b_b_h_h_h_h_h']",
        )}
      >
        {images.slice(0, TILES.length).map((img, i) => {
          const tile = TILES[i];
          return (
            <ImageReveal key={img.slug} delay={i * 0.06} className={clsx("relative min-h-0 overflow-hidden rounded-[6px] md:aspect-auto", tile.area, tile.mobile)}>
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes={tile.sizes}
                placeholder="blur"
                blurDataURL={img.blurDataUrl}
                className={clsx("object-cover transition-transform duration-[1.4s] ease-out-soft hover:scale-[1.03]", tile.pos)}
              />
            </ImageReveal>
          );
        })}
      </div>
    </section>
  );
}
