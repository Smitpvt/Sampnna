import fs from "node:fs";
import path from "node:path";
import { FEATURED_PLATES } from "@/content/home";

export type FeaturedPlate = { src: string; name: string; alt: string; plate: [number, number, number, number] };

const FOLDER = "images/featured_dishes";
const IMAGE = /\.(png|jpe?g|webp|avif)$/i;
/** Unmeasured photos: assume the plate fills the frame. */
const DEFAULT_PLATE: [number, number, number, number] = [50, 50, 50, 50];

/**
 * Every photo in public/images/featured_dishes, in filename order — drop a
 * plate photo into the folder and it joins the homepage row. Alt text and the
 * plate outline come from FEATURED_PLATES, falling back to the filename and a
 * frame-filling plate.
 */
export function getFeaturedPlates(): FeaturedPlate[] {
  let files: string[];
  try {
    files = fs.readdirSync(path.join(process.cwd(), "public", FOLDER));
  } catch {
    return [];
  }
  return files
    .filter((f) => IMAGE.test(f))
    .sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }))
    .map((f) => ({
      src: `/${FOLDER}/${encodeURIComponent(f)}`,
      name: FEATURED_PLATES[f]?.name ?? f.replace(IMAGE, "").replace(/[_-]+/g, " "),
      alt: FEATURED_PLATES[f]?.alt ?? f.replace(IMAGE, "").replace(/[_-]+/g, " "),
      plate: FEATURED_PLATES[f]?.plate ?? DEFAULT_PLATE,
    }));
}
