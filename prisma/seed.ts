/**
 * Seeds menu and gallery content from the single sources of truth:
 *   src/data/menu.ts            — the printed menu
 *   src/data/media-sources.json — curated photography (+ media.generated.json)
 *
 * Idempotent: safe to re-run after editing those files. Never touches
 * reservations, enquiries or testimonials.
 */
import { PrismaClient, type GalleryCategory } from "@prisma/client";
import { MENU } from "../src/data/menu";
import sources from "../src/data/media-sources.json";
import generated from "../src/data/media.generated.json";
import { slugify } from "../src/lib/slug";

const prisma = new PrismaClient();
const manifest = generated as Record<string, { src: string; width: number; height: number; blurDataUrl: string }>;

function imageSrc(slug?: string) {
  if (!slug) return null;
  const entry = manifest[slug];
  if (!entry) throw new Error(`Menu references unknown image "${slug}"`);
  return entry.src;
}

function imageAlt(slug?: string) {
  return slug ? ((sources as { slug: string; alt: string }[]).find((s) => s.slug === slug)?.alt ?? null) : null;
}

async function seedMenu() {
  const seen = new Set<string>();
  let dishCount = 0;

  for (const [ci, cat] of MENU.entries()) {
    const category = await prisma.menuCategory.upsert({
      where: { slug: cat.slug },
      create: {
        slug: cat.slug,
        name: cat.name,
        description: cat.description ?? null,
        image: imageSrc(cat.image),
        imageAlt: imageAlt(cat.image),
        displayOrder: ci,
      },
      update: {
        name: cat.name,
        description: cat.description ?? null,
        image: imageSrc(cat.image),
        imageAlt: imageAlt(cat.image),
        displayOrder: ci,
      },
    });

    for (const [di, d] of cat.dishes.entries()) {
      let slug = slugify(d.name);
      if (seen.has(slug)) slug = `${slug}-${cat.slug}`;
      if (seen.has(slug)) throw new Error(`Duplicate dish slug ${slug}`);
      seen.add(slug);

      const data = {
        name: d.name,
        description: d.description ?? null,
        price: d.price ?? null,
        priceNote: d.priceNote ?? null,
        image: imageSrc(d.image),
        imageAlt: imageAlt(d.image),
        categoryId: category.id,
        tags: d.tags ?? [],
        isFeatured: d.featured ?? false,
        displayOrder: di,
      };
      const dish = await prisma.dish.upsert({ where: { slug }, create: { slug, ...data }, update: data });

      await prisma.dishPriceOption.deleteMany({ where: { dishId: dish.id } });
      if (d.options?.length) {
        await prisma.dishPriceOption.createMany({
          data: d.options.map((o, oi) => ({
            dishId: dish.id,
            label: o.label,
            price: o.price ?? null,
            priceNote: o.priceNote ?? null,
            displayOrder: oi,
          })),
        });
      }
      dishCount++;
    }
  }
  console.log(`Menu: ${MENU.length} categories, ${dishCount} dishes`);
}

async function seedGallery() {
  const items = (sources as { slug: string; alt: string; caption: string; category: GalleryCategory; gallery: boolean }[]).filter(
    (s) => s.gallery,
  );
  for (const [i, s] of items.entries()) {
    const m = manifest[s.slug];
    if (!m) throw new Error(`Missing generated image for ${s.slug}`);
    const data = {
      altText: s.alt,
      caption: s.caption,
      category: s.category,
      width: m.width,
      height: m.height,
      blurDataUrl: m.blurDataUrl,
      displayOrder: i,
    };
    // Web copies moved from .jpg to .webp: re-point rows seeded before the
    // switch instead of creating duplicates that reference missing files.
    const legacyUrl = m.src.replace(/\.webp$/, ".jpg");
    if (legacyUrl !== m.src && !(await prisma.galleryImage.findUnique({ where: { imageUrl: m.src } }))) {
      await prisma.galleryImage.updateMany({ where: { imageUrl: legacyUrl }, data: { imageUrl: m.src } });
    }
    await prisma.galleryImage.upsert({ where: { imageUrl: m.src }, create: { imageUrl: m.src, ...data }, update: data });
  }
  console.log(`Gallery: ${items.length} images`);
}

seedMenu()
  .then(seedGallery)
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
