import generated from "@/data/media.generated.json";
import sources from "@/data/media-sources.json";
import featured from "@/data/featured.generated.json";
import type { ImageRef } from "@/types/content";

export type MediaAsset = {
  slug: string;
  src: string;
  width: number;
  height: number;
  blurDataUrl: string;
  alt: string;
  caption: string;
  category: "FOOD" | "DRINKS" | "AMBIENCE" | "KITCHEN";
};

const manifest = generated as Record<string, Omit<MediaAsset, "slug" | "alt" | "caption" | "category">>;

const assets: Record<string, MediaAsset> = Object.fromEntries(
  (sources as { slug: string; alt: string; caption: string; category: MediaAsset["category"] }[])
    .filter((s) => manifest[s.slug])
    .map((s) => [s.slug, { ...manifest[s.slug], slug: s.slug, alt: s.alt, caption: s.caption, category: s.category }]),
);

/** Look up a curated photo by slug. Throws at build time if the slug is unknown. */
export function media(slug: string): MediaAsset {
  const asset = assets[slug];
  if (!asset) throw new Error(`Unknown media slug "${slug}". Run \`npm run images\`?`);
  return asset;
}

export function allMedia(): MediaAsset[] {
  return Object.values(assets);
}

const gallerySlugs = new Set((sources as { slug: string; gallery?: boolean }[]).filter((s) => s.gallery !== false).map((s) => s.slug));

/** Photos flagged for the public gallery (some, e.g. featured-dish photos, are used elsewhere only). */
export function galleryMedia(): MediaAsset[] {
  return Object.values(assets).filter((a) => gallerySlugs.has(a.slug));
}

/** A square, plate-centred Featured Dishes photo (see server/scripts/featured-images.mjs). */
export function featuredImage(slug: string): ImageRef {
  const image = (featured as Record<string, ImageRef>)[slug];
  if (!image) throw new Error(`Unknown featured image "${slug}". Run \`node server/scripts/featured-images.mjs\`?`);
  return image;
}

/** Resolve a stored image reference (media slug or absolute URL) to dimensions/blur when known. */
export function resolveImage(ref: string | null | undefined): MediaAsset | null {
  if (!ref) return null;
  return assets[ref] ?? Object.values(assets).find((a) => a.src === ref) ?? null;
}
