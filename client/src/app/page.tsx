import { CategoryShowcase, type CourseCard } from "@/components/home/CategoryShowcase";
import { FeaturedDishes } from "@/components/home/FeaturedDishes";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { Hero } from "@/components/home/Hero";
import { Highlights } from "@/components/home/Highlights";
import { Reviews } from "@/components/home/Reviews";
import { Story } from "@/components/home/Story";
import { ReservationSection } from "@/components/reservations/ReservationSection";
import { site } from "@/config/site";
import { COURSES } from "@/content/courses";
import { HOME_MEDIA } from "@/content/home";
import { media } from "@/lib/media";
import { getFeaturedPlates } from "@/services/featured";
import { getMenu } from "@/services/menu";
import { getGoogleSummary, getPublishedTestimonials } from "@/services/reviews";
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
  const [menu, google, testimonials] = await Promise.all([getMenu(), getGoogleSummary(), getPublishedTestimonials()]);
  const plates = getFeaturedPlates();
  const dishCount = menu.reduce((n, c) => n + c.dishes.length, 0);

  return (
    <>
      <Hero backdrops={HOME_MEDIA.heroBackdrops.map(media)} />
      <Story images={HOME_MEDIA.storyImages.map(media)} />
      {plates.length > 0 && <FeaturedDishes plates={plates} />}
      <CategoryShowcase courses={buildCourses(menu)} />
      <Highlights dishes={dishCount} categories={menu.length} kitchens={site.cuisines} google={google} />
      <Reviews google={google} testimonials={testimonials} />
      <GalleryPreview images={HOME_MEDIA.gallery.map(media)} />
      <ReservationSection image={media(HOME_MEDIA.reservation)} />
    </>
  );
}
