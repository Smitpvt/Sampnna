"use client";

import clsx from "clsx";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ImageReveal } from "@/components/ui/Reveal";
import type { GalleryCategory, GalleryImageDTO } from "@/types/content";
import { Lightbox } from "./Lightbox";

const CATEGORY_ORDER: GalleryCategory[] = ["FOOD", "DRINKS", "AMBIENCE", "KITCHEN"];

const LABELS: Record<GalleryCategory, string> = {
  FOOD: "Food",
  DRINKS: "Drinks",
  AMBIENCE: "Ambience",
  KITCHEN: "Kitchen",
};

/**
 * 8-tile Bento A (matches homepage GalleryPreview rhythm):
 * - Large dining room / signature dish hero (top-left)
 * - Tall portrait skewer / vertical architectural accent (center)
 * - Detail squares (top-right)
 * - Large seafood thali / garden arch hero (bottom-right)
 * - Detail squares (bottom-left)
 * Sized with responsive breakpoints capped at max shell width (1280px) to prevent over-fetching.
 */
const BENTO_A = [
  { area: "lg:[grid-area:d] md:[grid-area:d]", mobile: "col-span-2 aspect-[4/3]", sizes: "(min-width: 1280px) 540px, (min-width: 1024px) 42vw, (min-width: 768px) 66vw, 100vw" },
  { area: "lg:[grid-area:s] md:[grid-area:s]", mobile: "col-span-1 aspect-[4/5]", sizes: "(min-width: 1280px) 220px, (min-width: 768px) 17vw, 50vw" },
  { area: "lg:[grid-area:t] md:[grid-area:t]", mobile: "col-span-1 aspect-square", sizes: "(min-width: 1280px) 320px, (min-width: 1024px) 25vw, (min-width: 768px) 34vw, 50vw" },
  { area: "lg:[grid-area:m] md:[grid-area:m]", mobile: "col-span-1 aspect-square", sizes: "(min-width: 1280px) 220px, (min-width: 768px) 17vw, 50vw" },
  { area: "lg:[grid-area:h] md:[grid-area:h]", mobile: "col-span-2 aspect-[4/3]", sizes: "(min-width: 1280px) 540px, (min-width: 1024px) 42vw, (min-width: 768px) 66vw, 100vw" },
  { area: "lg:[grid-area:f] md:[grid-area:f]", mobile: "col-span-1 aspect-square", sizes: "(min-width: 1280px) 320px, (min-width: 1024px) 25vw, (min-width: 768px) 34vw, 50vw" },
  { area: "lg:[grid-area:o] md:[grid-area:o]", mobile: "col-span-1 aspect-[4/5]", sizes: "(min-width: 1280px) 220px, (min-width: 768px) 17vw, 50vw" },
  { area: "lg:[grid-area:b] md:[grid-area:b]", mobile: "col-span-1 aspect-square", sizes: "(min-width: 1280px) 220px, (min-width: 768px) 17vw, 50vw" },
];

const BENTO_A_AREAS = clsx(
  "grid-cols-2 [grid-template-areas:'d_d''s_o''h_h''t_m''f_b']",
  "md:aspect-[6/5] md:grid-cols-6 md:grid-rows-5 md:[grid-template-areas:'d_d_d_d_s_s''d_d_d_d_s_s''h_h_h_h_t_t''h_h_h_h_m_m''f_f_o_o_b_b']",
  "lg:aspect-[1312/643] lg:grid-cols-12 lg:grid-rows-3 lg:[grid-template-areas:'d_d_d_d_d_s_s_t_t_t_m_m''d_d_d_d_d_s_s_h_h_h_h_h''f_f_f_o_o_b_b_h_h_h_h_h']",
);

/**
 * 8-tile Bento B (Mirrored Flow to keep repeating clusters visually exciting):
 * - Large hero (top-right)
 * - Tall portrait accent (center)
 * - Detail squares (top-left)
 * - Large hero (bottom-left)
 * - Detail squares (bottom-right)
 */
const BENTO_B = [
  { area: "lg:[grid-area:d2] md:[grid-area:d2]", mobile: "col-span-2 aspect-[4/3]", sizes: "(min-width: 1280px) 540px, (min-width: 1024px) 42vw, (min-width: 768px) 66vw, 100vw" },
  { area: "lg:[grid-area:s2] md:[grid-area:s2]", mobile: "col-span-1 aspect-[4/5]", sizes: "(min-width: 1280px) 220px, (min-width: 768px) 17vw, 50vw" },
  { area: "lg:[grid-area:t2] md:[grid-area:t2]", mobile: "col-span-1 aspect-square", sizes: "(min-width: 1280px) 320px, (min-width: 1024px) 25vw, (min-width: 768px) 34vw, 50vw" },
  { area: "lg:[grid-area:m2] md:[grid-area:m2]", mobile: "col-span-1 aspect-square", sizes: "(min-width: 1280px) 220px, (min-width: 768px) 17vw, 50vw" },
  { area: "lg:[grid-area:h2] md:[grid-area:h2]", mobile: "col-span-2 aspect-[4/3]", sizes: "(min-width: 1280px) 540px, (min-width: 1024px) 42vw, (min-width: 768px) 66vw, 100vw" },
  { area: "lg:[grid-area:f2] md:[grid-area:f2]", mobile: "col-span-1 aspect-square", sizes: "(min-width: 1280px) 320px, (min-width: 1024px) 25vw, (min-width: 768px) 34vw, 50vw" },
  { area: "lg:[grid-area:o2] md:[grid-area:o2]", mobile: "col-span-1 aspect-[4/5]", sizes: "(min-width: 1280px) 220px, (min-width: 768px) 17vw, 50vw" },
  { area: "lg:[grid-area:b2] md:[grid-area:b2]", mobile: "col-span-1 aspect-square", sizes: "(min-width: 1280px) 220px, (min-width: 768px) 17vw, 50vw" },
];

const BENTO_B_AREAS = clsx(
  "grid-cols-2 [grid-template-areas:'d2_d2''s2_o2''h2_h2''t2_m2''f2_b2']",
  "md:aspect-[6/5] md:grid-cols-6 md:grid-rows-5 md:[grid-template-areas:'s2_s2_d2_d2_d2_d2''s2_s2_d2_d2_d2_d2''t2_t2_m2_m2_h2_h2''f2_f2_o2_o2_h2_h2''b2_b2_o2_o2_h2_h2']",
  "lg:aspect-[1312/643] lg:grid-cols-12 lg:grid-rows-3 lg:[grid-template-areas:'t2_t2_t2_m2_m2_s2_s2_d2_d2_d2_d2_d2''h2_h2_h2_h2_h2_s2_s2_d2_d2_d2_d2_d2''h2_h2_h2_h2_h2_f2_f2_f2_o2_o2_b2_b2']",
);

function GalleryTile({
  img,
  globalIndex,
  areaClass,
  mobileAspect,
  sizes,
  onOpen,
  delay = 0,
  priority = false,
}: {
  img: GalleryImageDTO;
  globalIndex: number;
  areaClass?: string;
  mobileAspect?: string;
  sizes: string;
  onOpen: (index: number) => void;
  delay?: number;
  priority?: boolean;
}) {
  return (
    <ImageReveal
      delay={delay}
      className={clsx(
        "group relative min-h-0 overflow-hidden rounded-[6px] bg-ivory/[0.04] focus-within:ring-2 focus-within:ring-turquoise focus-within:ring-offset-2 focus-within:ring-offset-charcoal md:aspect-auto",
        areaClass,
        mobileAspect,
      )}
    >
      <button
        type="button"
        onClick={() => onOpen(globalIndex)}
        className="relative block size-full text-left cursor-pointer"
        aria-label={`View photograph: ${img.caption ?? img.alt}`}
      >
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes={sizes}
          priority={priority}
          quality={80}
          loading={priority ? "eager" : "lazy"}
          placeholder={img.blurDataUrl ? "blur" : "empty"}
          blurDataURL={img.blurDataUrl ?? undefined}
          className="object-cover transition-transform duration-[1.4s] ease-out-soft group-hover:scale-[1.03]"
        />

        {/* Hover / focus overlay matching the homepage GalleryPreview editorial tone */}
        <span
          className="pointer-events-none absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 md:p-5"
          aria-hidden="true"
        >
          <span className="self-end rounded-full bg-charcoal/70 p-2 text-ivory/90 shadow-sm backdrop-blur-sm border border-ivory/10">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
              <path d="M7 3H3v4M13 3h4v4M7 17H3v-4M13 17h4v-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>

          <span className="flex flex-col gap-1">
            <span className="font-[family-name:var(--font-cormorant)] text-base font-normal leading-tight text-ivory md:text-xl">
              {img.caption ?? img.alt}
            </span>
            <span className="eyebrow text-[0.6rem] tracking-[0.2em] text-turquoise">
              {LABELS[img.category]}
            </span>
          </span>
        </span>
      </button>
    </ImageReveal>
  );
}

/** Lightweight skeleton placeholder to eliminate Cumulative Layout Shift (CLS) for upcoming clusters */
function ClusterSkeleton({ isBentoB }: { isBentoB: boolean }) {
  const bentoConfig = isBentoB ? BENTO_B : BENTO_A;
  const bentoAreas = isBentoB ? BENTO_B_AREAS : BENTO_A_AREAS;

  return (
    <div aria-hidden className={clsx("grid gap-[14px]", bentoAreas)}>
      {bentoConfig.map((tile, i) => (
        <div
          key={i}
          className={clsx(
            "relative rounded-[6px] bg-ivory/[0.03] md:aspect-auto",
            tile.area,
            tile.mobile,
          )}
        />
      ))}
    </div>
  );
}

function RemainderGrid({
  items,
  startIndex,
  onOpen,
}: {
  items: GalleryImageDTO[];
  startIndex: number;
  onOpen: (index: number) => void;
}) {
  const count = items.length;

  if (count === 1) {
    return (
      <div className="grid grid-cols-1 gap-[14px]">
        <GalleryTile
          img={items[0]}
          globalIndex={startIndex}
          mobileAspect="aspect-[16/9]"
          sizes="(min-width: 1280px) 1200px, 100vw"
          onOpen={onOpen}
        />
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
        {items.map((img, i) => (
          <GalleryTile
            key={img.id}
            img={img}
            globalIndex={startIndex + i}
            mobileAspect="aspect-[4/3] md:aspect-[16/10]"
            sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw"
            onOpen={onOpen}
            delay={i * 0.08}
          />
        ))}
      </div>
    );
  }

  if (count === 3) {
    return (
      <div className="grid grid-cols-1 gap-[14px] md:grid-cols-3">
        {items.map((img, i) => (
          <GalleryTile
            key={img.id}
            img={img}
            globalIndex={startIndex + i}
            mobileAspect="aspect-[4/3]"
            sizes="(min-width: 1280px) 400px, (min-width: 768px) 33vw, 100vw"
            onOpen={onOpen}
            delay={i * 0.06}
          />
        ))}
      </div>
    );
  }

  if (count === 4) {
    return (
      <div className="grid grid-cols-2 gap-[14px] lg:grid-cols-4">
        {items.map((img, i) => (
          <GalleryTile
            key={img.id}
            img={img}
            globalIndex={startIndex + i}
            mobileAspect="aspect-square md:aspect-[3/4]"
            sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 768px) 50vw, 50vw"
            onOpen={onOpen}
            delay={i * 0.05}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-[14px] md:grid-cols-3 lg:grid-cols-6">
      {items.map((img, i) => {
        const isWide = i === 0 && count % 2 === 1;
        return (
          <GalleryTile
            key={img.id}
            img={img}
            globalIndex={startIndex + i}
            areaClass={isWide ? "col-span-2 aspect-[16/10]" : "col-span-1 aspect-square md:aspect-[4/5]"}
            mobileAspect={isWide ? "col-span-2 aspect-[4/3]" : "col-span-1 aspect-square"}
            sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, 50vw"
            onOpen={onOpen}
            delay={i * 0.05}
          />
        );
      })}
    </div>
  );
}

/**
 * Filterable, rhythmic editorial bento gallery expanding the homepage GalleryPreview.
 * Features eager above-the-fold loading, progressive incremental batching, and zero layout shift.
 */
export function GalleryGrid({ images }: { images: GalleryImageDTO[] }) {
  const [filter, setFilter] = useState<GalleryCategory | "ALL">("ALL");
  const [open, setOpen] = useState<number | null>(null);

  // Progressive viewport cluster rendering: start with first 2 clusters (16 tiles), load subsequent clusters as user scrolls
  const [visibleClusters, setVisibleClusters] = useState(2);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const available = useMemo(
    () => CATEGORY_ORDER.filter((c) => images.some((i) => i.category === c)),
    [images],
  );

  const shown = useMemo(() => (filter === "ALL" ? images : images.filter((i) => i.category === filter)), [images, filter]);

  // Reset progressive cluster window whenever filter changes
  useEffect(() => {
    setVisibleClusters(2);
  }, [filter]);

  // Divide into 8-item clusters and a remainder for perfect layout rhythm
  const { clusters, remainder } = useMemo(() => {
    // If 4 items (like DRINKS), treat as remainder for an intentional 4-tile spread
    if (shown.length <= 4) {
      return { clusters: [] as GalleryImageDTO[][], remainder: shown };
    }

    const fullClusterCount = Math.floor(shown.length / 8);
    const resultClusters: GalleryImageDTO[][] = [];

    for (let c = 0; c < fullClusterCount; c++) {
      resultClusters.push(shown.slice(c * 8, (c + 1) * 8));
    }

    const rest = shown.slice(fullClusterCount * 8);
    return { clusters: resultClusters, remainder: rest };
  }, [shown]);

  // Progressive observer: load the next cluster 800px before reaching the end of the viewport
  useEffect(() => {
    if (visibleClusters >= clusters.length) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleClusters((prev) => Math.min(prev + 1, clusters.length));
        }
      },
      { rootMargin: "800px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleClusters, clusters.length]);

  return (
    <>
      {/* Category filter toolbar */}
      <div className="border-b border-ivory/15 pb-6">
        <div
          role="toolbar"
          aria-label="Filter gallery by category"
          className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 sm:mx-0 sm:gap-2.5 sm:px-0"
        >
          {(["ALL", ...available] as const).map((c) => {
            const isSelected = filter === c;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setFilter(c)}
                className={clsx(
                  "relative inline-flex items-center rounded-full px-5 py-2 text-xs font-medium tracking-[0.14em] uppercase transition-all duration-300 md:px-6 md:py-2.5 cursor-pointer",
                  isSelected
                    ? "bg-terracotta text-ivory shadow-[0_2px_12px_rgba(185,99,73,0.35)]"
                    : "bg-ivory/[0.06] text-ivory/70 hover:bg-ivory/[0.12] hover:text-ivory",
                )}
              >
                <span>{c === "ALL" ? "All" : LABELS[c]}</span>
              </button>
            );
          })}
        </div>

        <p className="sr-only" aria-live="polite">
          Showing {shown.length} photographs
        </p>
      </div>

      {/* Rhythmic Bento Layout */}
      <div className="mt-8 flex flex-col gap-[14px] md:mt-12">
        {clusters.map((cluster, clusterIndex) => {
          const isBentoB = clusterIndex % 2 === 1;
          const isVisible = clusterIndex < visibleClusters;

          // Render skeleton placeholder for clusters that have not yet approached the viewport to prevent CLS
          if (!isVisible) {
            return <ClusterSkeleton key={`cluster-skel-${clusterIndex}`} isBentoB={isBentoB} />;
          }

          const bentoConfig = isBentoB ? BENTO_B : BENTO_A;
          const bentoAreas = isBentoB ? BENTO_B_AREAS : BENTO_A_AREAS;

          return (
            <div key={`cluster-${clusterIndex}`} className="flex flex-col gap-[14px]">
              <div className={clsx("grid gap-[14px]", bentoAreas)}>
                {cluster.map((img, i) => {
                  const tile = bentoConfig[i];
                  const globalIndex = clusterIndex * 8 + i;
                  // Eagerly load the first 4 visible tiles in cluster 0 for instantaneous LCP
                  const isPriority = clusterIndex === 0 && i < 4;

                  return (
                    <GalleryTile
                      key={img.id}
                      img={img}
                      globalIndex={globalIndex}
                      areaClass={tile.area}
                      mobileAspect={tile.mobile}
                      sizes={tile.sizes}
                      onOpen={setOpen}
                      delay={Math.min(i * 0.04, 0.28)}
                      priority={isPriority}
                    />
                  );
                })}
              </div>

              {/* Sentinel placed immediately at the boundary of active clusters */}
              {clusterIndex === visibleClusters - 1 && visibleClusters < clusters.length && (
                <div ref={sentinelRef} className="h-6 w-full pointer-events-none" aria-hidden="true" />
              )}
            </div>
          );
        })}

        {/* Remainder items (rendered when user reaches the end clusters) */}
        {remainder.length > 0 && visibleClusters >= clusters.length && (
          <RemainderGrid
            items={remainder}
            startIndex={clusters.length * 8}
            onOpen={setOpen}
          />
        )}
      </div>

      <Lightbox images={shown} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </>
  );
}
