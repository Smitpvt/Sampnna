import Image from "next/image";
import type { DishDTO } from "@/types/content";
import { Price } from "./Price";

/** One menu line: name · leader dots · price, with description and photo when the menu has them. */
export function DishRow({ dish, highlight }: { dish: DishDTO; highlight?: string }) {
  return (
    <li id={`dish-${dish.slug}`} className="flex gap-4 py-5">
      {dish.image && (
        <div className="relative size-20 shrink-0 overflow-hidden bg-sand sm:size-24">
          <Image
            src={dish.image.src}
            alt={dish.image.alt}
            fill
            sizes="96px"
            placeholder={dish.image.blurDataUrl ? "blur" : "empty"}
            blurDataURL={dish.image.blurDataUrl}
            className="object-cover"
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline">
          <h3 className="font-serif text-xl leading-tight">
            <Highlight text={dish.name} term={highlight} />
            {dish.isVegetarian != null && <DietMark veg={dish.isVegetarian} />}
          </h3>
          <span className="leader" aria-hidden />
          <Price dish={dish} className="text-base text-terracotta-deep" />
        </div>
        {dish.description && (
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-soft">
            <Highlight text={dish.description} term={highlight} />
          </p>
        )}
      </div>
    </li>
  );
}

/** Only rendered when the attribute has been verified (non-null). */
function DietMark({ veg }: { veg: boolean }) {
  return (
    <span
      role="img"
      aria-label={veg ? "Vegetarian" : "Non-vegetarian"}
      title={veg ? "Vegetarian" : "Non-vegetarian"}
      className={`ml-2 inline-flex size-3.5 items-center justify-center border align-middle ${veg ? "border-green-700" : "border-red-800"}`}
    >
      <span className={`size-1.5 rounded-full ${veg ? "bg-green-700" : "bg-red-800"}`} />
    </span>
  );
}

function Highlight({ text, term }: { text: string; term?: string }) {
  if (!term || term.length < 2) return <>{text}</>;
  const i = text.toLowerCase().indexOf(term.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-turquoise/20 text-inherit">{text.slice(i, i + term.length)}</mark>
      {text.slice(i + term.length)}
    </>
  );
}
