import { db } from "../lib/db";
import type { ReviewDTO } from "../types/content";

/** Published testimonials from the database, separated by source. */
export async function getPublishedTestimonials(): Promise<ReviewDTO[]> {
  const rows = await db.testimonial.findMany({
    where: { isPublished: true },
    orderBy: [{ reviewDate: "desc" }, { createdAt: "desc" }],
    take: 12,
  });
  return rows.map((r) => ({
    id: r.id,
    authorName: r.authorName,
    rating: r.rating,
    text: r.reviewText,
    date: r.reviewDate?.toISOString() ?? null,
    source: r.source === "GOOGLE" && r.isVerified ? "GOOGLE" : "ADMIN",
    sourceUrl: r.sourceUrl,
  }));
}

