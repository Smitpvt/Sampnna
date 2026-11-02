import { fetchApi } from "@/lib/api";
import { galleryMedia } from "@/lib/media";
import type { GalleryCategory, GalleryImageDTO } from "@/types/content";

export function getFallbackGallery(category?: GalleryCategory): GalleryImageDTO[] {
  const assets = galleryMedia();
  return assets
    .filter((a) => !category || a.category === category)
    .map((a, i) => ({
      id: `fb-gallery-${i}`,
      src: a.src,
      alt: a.alt,
      caption: a.caption,
      category: a.category,
      width: a.width,
      height: a.height,
      blurDataUrl: a.blurDataUrl,
    }));
}

export async function getGalleryImages(category?: GalleryCategory): Promise<GalleryImageDTO[]> {
  const fallback = getFallbackGallery(category);

  // When developing or running standalone, resolve instantly in 0ms without waiting for a backend
  if (process.env.NODE_ENV === "development" && (!process.env.INTERNAL_API_URL || process.env.INTERNAL_API_URL.includes("localhost"))) {
    return fallback;
  }

  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  try {
    const data = await fetchApi<GalleryImageDTO[]>(`/api/gallery${query}`, {
      signal: AbortSignal.timeout(200),
      next: { revalidate: 300 },
    });
    if (data && data.length > 0) return data;
  } catch {
    // fallback instantly
  }

  return fallback;
}
