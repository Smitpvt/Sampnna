import { CategoryShowcase, type CourseCard } from "@/components/home/CategoryShowcase";
import { FeaturedDishes } from "@/components/home/FeaturedDishes";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { Hero } from "@/components/home/Hero";
import { ClosingNote } from "@/components/home/ClosingNote";
import { Highlights } from "@/components/home/Highlights";
import { Story } from "@/components/home/Story";
import { Testimonials } from "@/components/home/Testimonials";
import { ReservationSection } from "@/components/reservations/ReservationSection";
import { COURSES } from "@/content/courses";
import { PREVIEW_TESTIMONIALS, TESTIMONIALS } from "@/content/guests";
import { HOME_MEDIA } from "@/content/home";
import { media } from "@/lib/media";
import { getFeaturedPlates } from "@/services/featured";
import { getMenu } from "@/services/menu";
import type { CategoryDTO } from "@/types/content";

export const revalidate = 3600;

const imageRef = (slug: string) => {
  const img = media(slug);
  return { src: img.src, alt: img.alt, width: img.width, height: img.height, blurDataUrl: img.blurDataUrl };
};

/** Course cards for every course that has at least one of its menu sections live. */
function buildCourses(menu: CategoryDTO[]): CourseCard[] {
  const live = new Set(menu.filter((c) => c.dishes.length > 0).map((c) => c.slug));
  return COURSES.filter((course) => course.categories.some((slug) => live.has(slug))).map((course) => ({
    slug: course.slug,
    name: course.name,
    image: imageRef(course.image),
    focus: course.focus,
    inset: course.inset && { image: imageRef(course.inset.image), focus: course.inset.focus },
  }));
}

export default async function HomePage() {
  const menu = await getMenu();
  const plates = getFeaturedPlates();
  const dishCount = menu.reduce((n, c) => n + c.dishes.length, 0);
  // Genuine reviews only on the live site; the clearly labelled placeholders appear in development alone.
  const preview = TESTIMONIALS.length === 0 && process.env.NODE_ENV === "development";
  const reviews = preview ? PREVIEW_TESTIMONIALS : TESTIMONIALS;

  return (
    <>
      <Hero backdrops={HOME_MEDIA.heroBackdrops.map(media)} />
      <Story images={HOME_MEDIA.storyImages.map(media)} />
      {plates.length > 0 && <FeaturedDishes plates={plates} />}
      <CategoryShowcase courses={buildCourses(menu)} />
      <Highlights dishes={dishCount} />
      {reviews.length > 0 && <Testimonials items={reviews} preview={preview} />}
      <ClosingNote main={imageRef(HOME_MEDIA.closing.main)} detail={imageRef(HOME_MEDIA.closing.detail)} />
      <GalleryPreview images={HOME_MEDIA.gallery.map(media)} />
      <ReservationSection image={media(HOME_MEDIA.reservation)} />
    </>
  );
}
