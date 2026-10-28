import { Star } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import type { GoogleSummary, ReviewDTO } from "@/types/content";

type Props = { google: GoogleSummary | null; testimonials: ReviewDTO[] };

/**
 * Section F — verified Google reviews (Places API) and admin-published
 * testimonials, always labelled by source. Renders nothing when neither
 * exists, so no placeholder can be mistaken for a real review.
 */
export function Reviews({ google, testimonials }: Props) {
  const googleReviews = google?.reviews ?? [];
  const guestNotes = testimonials.filter((t) => t.source === "ADMIN");
  const storedGoogle = testimonials.filter((t) => t.source === "GOOGLE");
  const verified = googleReviews.length ? googleReviews : storedGoogle;

  if (!verified.length && !guestNotes.length) {
    if (process.env.NODE_ENV !== "development") return null;
    return (
      <section className="bg-ivory py-16">
        <p className="shell border border-dashed border-charcoal/25 p-6 text-sm text-ink-soft">
          Dev note: the reviews section is hidden until verified Google reviews (GOOGLE_PLACES_API_KEY + GOOGLE_PLACE_ID) or
          published testimonials exist. No placeholder reviews are shown in production.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="reviews-title" className="bg-ivory py-24 md:py-36">
      <div className="shell grid gap-12 md:grid-cols-12">
        <Reveal className="md:col-span-4">
          <p className="eyebrow text-terracotta">Guests at the table</p>
          <h2 id="reviews-title" className="mt-5 text-headline">
            In <em>their</em> words.
          </h2>
          {google && (
            <div className="mt-8 flex items-center gap-3">
              <span className="font-serif text-5xl">{google.rating.toFixed(1)}</span>
              <span className="text-sm text-ink-soft">
                <Stars rating={google.rating} />
                {google.reviewCount.toLocaleString("en-IN")} reviews on Google
              </span>
            </div>
          )}
          {google?.mapsUrl && (
            <a href={google.mapsUrl} target="_blank" rel="noopener noreferrer" className="link-line eyebrow mt-6 inline-block text-turquoise-deep">
              Read all reviews on Google
            </a>
          )}
        </Reveal>

        <div className="space-y-16 md:col-span-8">
          {verified.length > 0 && <ReviewList reviews={verified.slice(0, 4)} label="Google reviews" />}
          {guestNotes.length > 0 && <ReviewList reviews={guestNotes.slice(0, 4)} label="Notes from our guests (shared with the restaurant)" />}
        </div>
      </div>
    </section>
  );
}

function ReviewList({ reviews, label }: { reviews: ReviewDTO[]; label: string }) {
  return (
    <div>
      <h3 className="eyebrow text-ink-soft">{label}</h3>
      <ul className="mt-6 grid gap-10 sm:grid-cols-2">
        {reviews.map((r, i) => (
          <li key={r.id}>
            <Reveal delay={i * 0.06}>
              <figure className="border-t border-charcoal/15 pt-6">
                {r.rating != null && <Stars rating={r.rating} />}
                <blockquote className="mt-3 line-clamp-[8] font-serif text-xl leading-snug">“{r.text}”</blockquote>
                <figcaption className="mt-5 text-sm text-ink-soft">
                  {r.authorUrl ? (
                    <a href={r.authorUrl} target="_blank" rel="noopener noreferrer" className="link-reveal font-semibold text-charcoal">
                      {r.authorName}
                    </a>
                  ) : (
                    <span className="font-semibold text-charcoal">{r.authorName}</span>
                  )}
                  {r.date && <> · {new Date(r.date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</>}
                  {r.source === "GOOGLE" && <> · via Google</>}
                </figcaption>
              </figure>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5 text-gold" role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} filled={rating >= n - 0.25} />
      ))}
    </span>
  );
}
