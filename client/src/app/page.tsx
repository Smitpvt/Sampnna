import { CategoryShowcase, type ShowcaseEntry } from "@/components/home/CategoryShowcase";
import { FeaturedDishes } from "@/components/home/FeaturedDishes";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { Hero } from "@/components/home/Hero";
import { Highlights } from "@/components/home/Highlights";
import { Reviews } from "@/components/home/Reviews";
import { Story } from "@/components/home/Story";
import { ReservationSection } from "@/components/reservations/ReservationSection";
import { site } from "@/config/site";
import { FEATURED_DISHES, HOME_CHAPTERS, HOME_MEDIA } from "@/content/home";
import { featuredImage, media } from "@/lib/media";
import { getMenu } from "@/services/menu";
import { getGoogleSummary, getPublishedTestimonials } from "@/services/reviews";
import type { CategoryDTO, DishDTO, FeaturedDishDTO } from "@/types/content";

export const revalidate = 3600;

function buildChapters(menu: CategoryDTO[]): ShowcaseEntry[] {
  const allDishes = menu.flatMap((c) => c.dishes);
  return HOME_CHAPTERS.flatMap((ch) => {
    const pool: DishDTO[] =
      "category" in ch.source
        ? (menu.find((c) => c.slug === (ch.source as { category: string }).category)?.dishes ?? [])
        : allDishes.filter((d) => d.tags.includes((ch.source as { tag: string }).tag));
    if (!pool.length) return [];

    const picked = ch.picks.map((slug) => pool.find((d) => d.slug === slug)).filter((d): d is DishDTO => Boolean(d));
    const dishes = (picked.length ? picked : pool).slice(0, 5);
    const img = media(ch.image);
    const href = "category" in ch.source ? `/menu?category=${ch.source.category}` : `/menu?collection=${ch.source.tag}`;

    return [{ key: ch.key, title: ch.title, intro: ch.intro, href, dishes, image: { src: img.src, alt: img.alt, width: img.width, height: img.height, blurDataUrl: img.blurDataUrl } }];
  });
}

/**
 * Resolve the curated Featured Dishes against the live menu. A dish is shown only
 * if it is on the menu and has a verified photograph — no placeholder plates.
 */
function buildFeatured(menu: CategoryDTO[]): FeaturedDishDTO[] {
  const byName = new Map(menu.flatMap((c) => c.dishes).map((d) => [d.name, d]));
  return FEATURED_DISHES.flatMap((f) => {
    const dish = byName.get(f.dish);
    if (!dish) return [];
    return [
      {
        key: dish.slug,
        name: dish.name,
        categoryName: dish.categoryName,
        categorySlug: dish.categorySlug,
        // The dish's own menu description, or its section's printed note.
        description: dish.description ?? menu.find((c) => c.slug === dish.categorySlug)?.description ?? null,
        image: featuredImage(f.image),
      },
    ];
  });
}

export default async function HomePage() {
  const [menu, google, testimonials] = await Promise.all([getMenu(), getGoogleSummary(), getPublishedTestimonials()]);
  const featured = buildFeatured(menu);
  const dishCount = menu.reduce((n, c) => n + c.dishes.length, 0);

  return (
    <>
      <Hero backdrops={HOME_MEDIA.heroBackdrops.map(media)} />
      <Story images={HOME_MEDIA.storyImages.map(media)} />
      {featured.length > 0 && <FeaturedDishes dishes={featured} />}
      <CategoryShowcase entries={buildChapters(menu)} />
      <Highlights dishes={dishCount} categories={menu.length} kitchens={site.cuisines} google={google} />
      <Reviews google={google} testimonials={testimonials} />
      <GalleryPreview images={HOME_MEDIA.gallery.map(media)} />
      <ReservationSection image={media(HOME_MEDIA.reservation)} />
    </>
  );
}
