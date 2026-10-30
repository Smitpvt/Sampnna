import { fetchApi } from "@/lib/api";
import { galleryMedia } from "@/lib/media";
import type { GalleryCategory, GalleryImageDTO } from "@/types/content";

function getFallbackGallery(category?: GalleryCategory): GalleryImageDTO[] {
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
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  const data = await fetchApi<GalleryImageDTO[]>(`/api/gallery${query}`, { next: { revalidate: 300 } });
  if (data && data.length > 0) return data;
  return getFallbackGallery(category);
}
