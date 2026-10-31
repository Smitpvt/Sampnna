import clsx from "clsx";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { GOOGLE_RATING, GOOGLE_REVIEW_URL } from "@/content/guests";
import { cormorant } from "@/lib/fonts";

/**
 * Section E — three figures in a row: the Google rating and review count
 * (kept by hand in content/guests.ts) and the number of dishes, counted from
 * the live menu. Opens the guest-voices run that continues with the
 * testimonials and the closing note.
 */
export function Highlights({ dishes }: { dishes: number }) {
  const stats = [
    {
      label: "Google Rating",
      value: (
        <>
          <CountUp to={GOOGLE_RATING.rating} decimals={1} />
          <span aria-hidden className="ml-2 align-[0.32em] text-[0.42em] text-terracotta">
            ★
          </span>
        </>
      ),
      sr: `${GOOGLE_RATING.rating} out of 5`,
    },
    { label: "Guest Reviews", value: <><CountUp to={GOOGLE_RATING.reviewCount} />+</>, sr: `More than ${GOOGLE_RATING.reviewCount}` },
    { label: "Dishes on the Menu", value: <><CountUp to={dishes} />+</>, sr: `More than ${dishes}` },
  ];

  return (
    <section aria-label="Sampann at a glance" className={clsx("bg-ivory pt-8 md:pt-10", cormorant.variable)}>
      <dl className="shell grid grid-cols-1 border-y border-charcoal/10 sm:grid-cols-3">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 0.1}
            className={clsx(
              "flex flex-col items-center justify-center gap-3 py-6 text-center md:py-8",
              i > 0 && "border-t border-charcoal/10 sm:border-l sm:border-t-0",
            )}
          >
            <dt className="eyebrow order-2 text-ink-soft">{s.label}</dt>
            <dd className="order-1 font-[family-name:var(--font-cormorant)] text-[clamp(3.4rem,2.4rem+3vw,5.5rem)] font-normal leading-none text-charcoal">
              <span aria-hidden>{s.value}</span>
              <span className="sr-only">{s.sr}</span>
            </dd>
          </Reveal>
        ))}
      </dl>
      {/* A quiet invitation to review — a plain Google Maps link, nothing fetched. Sits just under the figures. */}
      <p className="shell flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 pb-8 pt-5 text-center text-sm text-ink-soft md:pb-10 md:pt-6">
        <span>Want to share your experience?</span>
        <a
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="link-line font-semibold text-terracotta-deep transition-colors hover:text-terracotta"
        >
          Review us on Google <span aria-hidden>↗</span>
          <span className="sr-only">(opens Google Maps in a new tab)</span>
        </a>
      </p>
    </section>
  );
}
