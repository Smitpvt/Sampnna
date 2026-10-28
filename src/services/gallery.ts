import "server-only";
import type { GalleryCategory } from "@prisma/client";
import { db } from "@/lib/db";
import type { GalleryImageDTO } from "@/types/content";

export async function getGalleryImages(category?: GalleryCategory): Promise<GalleryImageDTO[]> {
  const rows = await db.galleryImage.findMany({
    where: { isPublished: true, ...(category ? { category } : {}) },
    orderBy: { displayOrder: "asc" },
  });
  return rows.map((r) => ({
    id: r.id,
    src: r.imageUrl,
    alt: r.altText,
    caption: r.caption,
    category: r.category,
    width: r.width,
    height: r.height,
    blurDataUrl: r.blurDataUrl,
  }));
}
