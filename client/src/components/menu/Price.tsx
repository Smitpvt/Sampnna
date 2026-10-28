import clsx from "clsx";
import type { DishDTO } from "@/types/content";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** Renders exactly what the menu prints: a price, variant prices, or a note. Nothing is invented. */
export function Price({ dish, className }: { dish: Pick<DishDTO, "price" | "priceNote" | "options">; className?: string }) {
  if (dish.options.length) {
    return (
      <span className={clsx("inline-flex flex-wrap justify-end gap-x-3 gap-y-0.5 tabular-nums", className)}>
        {dish.options.map((o) => (
          <span key={o.label} className="whitespace-nowrap">
            <span className="mr-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] opacity-60">{o.label}</span>
            {o.price != null ? inr(o.price) : o.priceNote}
          </span>
        ))}
      </span>
    );
  }
  if (dish.price != null) return <span className={clsx("tabular-nums whitespace-nowrap", className)}>{inr(dish.price)}</span>;
  if (dish.priceNote) return <span className={clsx("whitespace-nowrap text-[0.8em] italic opacity-80", className)}>{dish.priceNote}</span>;
  return null;
}
