import { MENU } from "@/data/menu";
import { fetchApi } from "@/lib/api";
import { resolveImage } from "@/lib/media";
import { slugify } from "@/lib/slug";
import type { CategoryDTO, DishDTO, ImageRef } from "@/types/content";

function toImage(src: string | null | undefined, alt: string | null | undefined, fallbackAlt: string): ImageRef | null {
  if (!src) return null;
  const known = resolveImage(src);
  return {
    src: known?.src ?? src,
    alt: alt ?? known?.alt ?? fallbackAlt,
    width: known?.width ?? 1600,
    height: known?.height ?? 1067,
    blurDataUrl: known?.blurDataUrl,
  };
}

function getFallbackMenu(): CategoryDTO[] {
  const seen = new Set<string>();
  return MENU.map((c, ci) => {
    const dishes: DishDTO[] = c.dishes.map((d, di) => {
      let slug = slugify(d.name);
      if (seen.has(slug)) slug = `${slug}-${c.slug}`;
      seen.add(slug);

      return {
        id: `fb-dish-${ci}-${di}`,
        name: d.name,
        slug,
        description: d.description ?? null,
        price: d.price ?? null,
        priceNote: d.priceNote ?? null,
        options: (d.options ?? []).map((o) => ({
          label: o.label,
          price: o.price ?? null,
          priceNote: o.priceNote ?? null,
        })),
        image: toImage(d.image, null, d.name),
        tags: d.tags ?? [],
        isFeatured: Boolean(d.featured),
        categorySlug: c.slug,
        categoryName: c.name,
        isVegetarian: null,
      };
    });

    return {
      id: `fb-cat-${ci}`,
      name: c.name,
      slug: c.slug,
      description: c.description ?? null,
      image: toImage(c.image, null, c.name),
      dishes,
    };
  });
}

/** All active categories with their available dishes — fetched from the API with graceful fallback. */
export async function getMenu(): Promise<CategoryDTO[]> {
  const data = await fetchApi<CategoryDTO[]>("/api/menu", { next: { revalidate: 300 } });
  if (data && data.length > 0) return data;
  return getFallbackMenu();
}

export async function listCategories() {
  const data = await fetchApi<{ id: string; name: string; slug: string; description: string | null; image: ImageRef | null; dishCount: number }[]>("/api/menu/categories", { next: { revalidate: 300 } });
  if (data && data.length > 0) return data;
  const menu = getFallbackMenu();
  return menu.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: c.image,
    dishCount: c.dishes.length,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<CategoryDTO | null> {
  const data = await fetchApi<CategoryDTO>(`/api/menu/categories/${encodeURIComponent(slug)}`, { next: { revalidate: 300 } });
  if (data) return data;
  const menu = getFallbackMenu();
  return menu.find((c) => c.slug === slug) ?? null;
}

export async function getFeaturedDishes(): Promise<DishDTO[]> {
  const data = await fetchApi<DishDTO[]>("/api/menu/featured", { next: { revalidate: 300 } });
  if (data && data.length > 0) return data;
  const menu = getFallbackMenu();
  return menu.flatMap((c) => c.dishes).filter((d) => d.isFeatured);
}

export async function getDishesByTag(tag: string): Promise<DishDTO[]> {
  const menu = await getMenu();
  return menu.flatMap((c) => c.dishes).filter((d) => d.tags.includes(tag));
}

export async function searchDishes(query: string, limit = 30): Promise<DishDTO[]> {
  const q = query.trim().slice(0, 60);
  if (q.length < 2) return [];
  const data = await fetchApi<DishDTO[]>(`/api/menu/search?q=${encodeURIComponent(q)}`, { next: { revalidate: 60 } });
  if (data) return data;
  const menu = getFallbackMenu();
  const lower = q.toLowerCase();
  return menu
    .flatMap((c) => c.dishes)
    .filter((d) => d.name.toLowerCase().includes(lower) || (d.description && d.description.toLowerCase().includes(lower)))
    .slice(0, limit);
}

export async function getMenuStats() {
  const menu = await getMenu();
  const dishes = menu.reduce((acc, c) => acc + c.dishes.length, 0);
  return { dishes, categories: menu.length };
}
