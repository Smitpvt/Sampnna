import "server-only";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { resolveImage } from "@/lib/media";
import type { CategoryDTO, DishDTO, ImageRef } from "@/types/content";

const dishInclude = {
  priceOptions: { orderBy: { displayOrder: "asc" } },
  category: { select: { slug: true, name: true } },
} satisfies Prisma.DishInclude;

type DishRow = Prisma.DishGetPayload<{ include: typeof dishInclude }>;

function toImage(src: string | null, alt: string | null, fallbackAlt: string): ImageRef | null {
  if (!src) return null;
  const known = resolveImage(src);
  return {
    src,
    alt: alt ?? known?.alt ?? fallbackAlt,
    width: known?.width ?? 1600,
    height: known?.height ?? 1067,
    blurDataUrl: known?.blurDataUrl,
  };
}

function toDish(d: DishRow): DishDTO {
  return {
    id: d.id,
    name: d.name,
    slug: d.slug,
    description: d.description,
    price: d.price,
    priceNote: d.priceNote,
    options: d.priceOptions.map((o) => ({ label: o.label, price: o.price, priceNote: o.priceNote })),
    image: toImage(d.image, d.imageAlt, d.name),
    tags: d.tags,
    isFeatured: d.isFeatured,
    categorySlug: d.category.slug,
    categoryName: d.category.name,
    isVegetarian: d.isVegetarian,
  };
}

const availableDish = { isAvailable: true, category: { isActive: true } } satisfies Prisma.DishWhereInput;

/** All active categories with their available dishes — the full menu. */
export async function getMenu(): Promise<CategoryDTO[]> {
  const categories = await db.menuCategory.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    include: {
      dishes: { where: { isAvailable: true }, orderBy: { displayOrder: "asc" }, include: dishInclude },
    },
  });
  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: toImage(c.image, c.imageAlt, c.name),
    dishes: c.dishes.map(toDish),
  }));
}

export async function listCategories() {
  const rows = await db.menuCategory.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    select: { id: true, name: true, slug: true, description: true, image: true, imageAlt: true, _count: { select: { dishes: { where: { isAvailable: true } } } } },
  });
  return rows.map(({ _count, image, imageAlt, ...c }) => ({ ...c, image: toImage(image, imageAlt, c.name), dishCount: _count.dishes }));
}

export async function getCategoryBySlug(slug: string): Promise<CategoryDTO | null> {
  const c = await db.menuCategory.findFirst({
    where: { slug, isActive: true },
    include: { dishes: { where: { isAvailable: true }, orderBy: { displayOrder: "asc" }, include: dishInclude } },
  });
  if (!c) return null;
  return { id: c.id, name: c.name, slug: c.slug, description: c.description, image: toImage(c.image, c.imageAlt, c.name), dishes: c.dishes.map(toDish) };
}

export async function getFeaturedDishes(): Promise<DishDTO[]> {
  const rows = await db.dish.findMany({
    where: { ...availableDish, isFeatured: true },
    orderBy: [{ category: { displayOrder: "asc" } }, { displayOrder: "asc" }],
    include: dishInclude,
  });
  return rows.map(toDish);
}

export async function getDishesByTag(tag: string): Promise<DishDTO[]> {
  const rows = await db.dish.findMany({
    where: { ...availableDish, tags: { has: tag } },
    orderBy: [{ category: { displayOrder: "asc" } }, { displayOrder: "asc" }],
    include: dishInclude,
  });
  return rows.map(toDish);
}

export async function searchDishes(query: string, limit = 30): Promise<DishDTO[]> {
  const q = query.trim().slice(0, 60);
  if (q.length < 2) return [];
  const rows = await db.dish.findMany({
    where: {
      ...availableDish,
      OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }],
    },
    orderBy: [{ category: { displayOrder: "asc" } }, { displayOrder: "asc" }],
    take: limit,
    include: dishInclude,
  });
  return rows.map(toDish);
}

export async function getMenuStats() {
  const [dishes, categories] = await Promise.all([
    db.dish.count({ where: availableDish }),
    db.menuCategory.count({ where: { isActive: true } }),
  ]);
  return { dishes, categories };
}
