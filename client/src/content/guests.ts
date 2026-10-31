/**
 * Guest-facing figures and reviews for the homepage Highlights and
 * "Words from Our Guests" sections. Edit here — nothing is fetched from Google.
 *
 * GOOGLE_RATING is copied by hand from Sampann's Google Maps listing; update
 * `rating`, `reviewCount` and `checked` together when it changes. The dishes
 * figure is not here: it is counted from the live menu.
 */

import { site } from "@/config/site";

export const GOOGLE_RATING = {
  rating: 4.7,
  /** Shown with a "+" — the listing's total at the time it was checked. */
  reviewCount: 291,
  checked: "2026-10",
} as const;

/**
 * Where "Review us on Google ↗" points — a plain Google Maps link, opened in a
 * new tab (no API). Currently Sampann's Google Maps search link from
 * config/site.ts. TODO: replace with the listing's own "Write a review" share
 * link (Google Maps → Sampann → Reviews → Write a review → copy link) once
 * the restaurant provides it.
 */
export const GOOGLE_REVIEW_URL: string = site.mapsUrl;

export type Testimonial = {
  id: string;
  /** As the guest chose to be named (e.g. on Google). */
  name: string;
  /** 1–5, as the guest gave it. */
  rating: number;
  text: string;
  /** Where the review was published, e.g. "Google". */
  source?: string;
  /** Month and year, e.g. "Oct 2026". */
  date?: string;
};

/**
 * Genuine guest reviews, copied word for word with the guest's public name,
 * star rating and source. Empty until real reviews are added — the carousel
 * only appears on the live site when this has entries.
 */
export const TESTIMONIALS: Testimonial[] = [];

/**
 * Design-preview placeholders. Shown only in development (never in a
 * production build), and every card carries a visible "Placeholder" label.
 * They are not reviews from real guests.
 */
export const PREVIEW_TESTIMONIALS: Testimonial[] = [
  { id: "preview-1", name: "Guest name", rating: 5, text: "Placeholder review — a guest's words about the food and the welcome will appear here once a genuine review is added." },
  { id: "preview-2", name: "Guest name", rating: 5, text: "Placeholder review — this card previews how a longer review wraps across several lines in the carousel, so the layout can be checked before real reviews arrive." },
  { id: "preview-3", name: "Guest name", rating: 4, text: "Placeholder review — short." },
  { id: "preview-4", name: "Guest name", rating: 5, text: "Placeholder review — replace with a genuine review copied from Google or the guest book, with the guest's public name and rating." },
  { id: "preview-5", name: "Guest name", rating: 5, text: "Placeholder review — a fifth card, so the carousel has enough to scroll on wide screens." },
];
