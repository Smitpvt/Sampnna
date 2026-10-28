import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import type { GoogleSummary } from "@/types/content";

type Props = {
  dishes: number;
  categories: number;
  kitchens: readonly string[];
  google: GoogleSummary | null;
};

/**
 * Section E — figures computed from the live menu, plus Google rating only
 * when it comes from the Places API. Nothing here is typed in by hand.
 */
export function Highlights({ dishes, categories, kitchens, google }: Props) {
  const stats: { value: React.ReactNode; label: string; sub?: string }[] = [
    { value: <CountUp to={dishes} />, label: "Dishes on the menu", sub: "Breakfast to dessert" },
    { value: <CountUp to={categories} />, label: "Menu chapters", sub: "From tandoor to tawa" },
    { value: <CountUp to={kitchens.length} />, label: "Kitchens, one menu", sub: kitchens.join(" · ") },
  ];
  if (google) {
    stats.push({
      value: <CountUp to={google.rating} decimals={1} />,
      label: "Google rating",
      sub: `${google.reviewCount.toLocaleString("en-IN")} Google reviews`,
    });
  }

  return (
    <section aria-label="Sampann in numbers" className="border-y border-charcoal/10 bg-ivory py-16 md:py-20">
      <dl className={`shell grid grid-cols-1 gap-y-12 sm:grid-cols-2 ${stats.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} className="flex flex-col gap-3 sm:border-l sm:border-charcoal/10 sm:px-8 sm:first:border-l-0 sm:first:pl-0">
            <dt className="eyebrow order-2 text-ink-soft">{s.label}</dt>
            <dd className="order-1 font-serif text-6xl leading-none text-terracotta md:text-7xl">{s.value}</dd>
            {s.sub && <dd className="order-3 text-sm text-ink-soft">{s.sub}</dd>}
          </Reveal>
        ))}
      </dl>
      {!google && process.env.NODE_ENV === "development" && (
        <p className="shell mt-10 text-xs text-ink-soft/70">
          Dev note: Google rating hidden — awaiting verified data (set GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID).
        </p>
      )}
    </section>
  );
}
