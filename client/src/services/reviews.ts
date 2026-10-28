import { fetchApi } from "@/lib/api";
import type { GoogleSummary, ReviewDTO } from "@/types/content";

type TestimonialsResponse = {
  google: GoogleSummary | null;
  testimonials: ReviewDTO[];
};

export async function getGoogleSummary(): Promise<GoogleSummary | null> {
  const data = await fetchApi<TestimonialsResponse>("/api/testimonials", { next: { revalidate: 300 } });
  return data?.google ?? null;
}

export async function getPublishedTestimonials(): Promise<ReviewDTO[]> {
  const data = await fetchApi<TestimonialsResponse>("/api/testimonials", { next: { revalidate: 300 } });
  return data?.testimonials ?? [];
}
