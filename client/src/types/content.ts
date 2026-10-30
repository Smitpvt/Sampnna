/** Serializable shapes passed from server services to (client) components. */

export type ImageRef = {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataUrl?: string;
};

export type PriceOption = { label: string; price: number | null; priceNote: string | null };

export type DishDTO = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  priceNote: string | null;
  options: PriceOption[];
  image: ImageRef | null;
  tags: string[];
  isFeatured: boolean;
  categorySlug: string;
  categoryName: string;
  /** Only set when verified; null means unknown and nothing is shown. */
  isVegetarian: boolean | null;
};

export type CategoryDTO = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: ImageRef | null;
  dishes: DishDTO[];
};

export type GalleryCategory = "FOOD" | "DRINKS" | "AMBIENCE" | "KITCHEN";

export type GalleryImageDTO = {
  id: string;
  src: string;
  alt: string;
  caption: string | null;
  category: GalleryCategory;
  width: number;
  height: number;
  blurDataUrl: string | null;
};

export type ReviewDTO = {
  id: string;
  authorName: string;
  authorUrl?: string | null;
  rating: number | null;
  text: string;
  date: string | null;
  source: "GOOGLE" | "ADMIN";
  sourceUrl: string | null;
};

export type GoogleSummary = {
  rating: number;
  reviewCount: number;
  mapsUrl: string | null;
  reviews: ReviewDTO[];
};
