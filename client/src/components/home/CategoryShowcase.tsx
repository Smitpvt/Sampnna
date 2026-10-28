import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { Price } from "@/components/menu/Price";
import { ArrowRight } from "@/components/ui/Icons";
import { ImageReveal, Reveal } from "@/components/ui/Reveal";
import type { DishDTO, ImageRef } from "@/types/content";

export type ShowcaseEntry = {
  key: string;
  title: string;
  intro: string;
  href: string;
  image: ImageRef | null;
  imageCaption?: string;
  dishes: DishDTO[];
};

type Layout = "split" | "split-reverse" | "band";
const LAYOUTS: Layout[] = ["split", "split-reverse", "band"];

/** Section D — the culinary range, each category art-directed differently. */
export function CategoryShowcase({ entries }: { entries: ShowcaseEntry[] }) {
  return (
    <section aria-labelledby="range-title" className="bg-sand/60 py-24 md:py-36">
      <div className="shell">
        <Reveal className="grid gap-6 md:grid-cols-12">
          <p className="eyebrow text-terracotta md:col-span-3">The menu, in chapters</p>
          <h2 id="range-title" className="text-headline md:col-span-8">
            One table. <em className="text-terracotta">Many</em> kitchens.
          </h2>
        </Reveal>
      </div>

      <ol className="mt-20 space-y-24 md:mt-28 md:space-y-36">
        {entries.map((entry, i) => (
          <li key={entry.key}>
            <Chapter entry={entry} index={i} total={entries.length} layout={LAYOUTS[i % LAYOUTS.length]} />
          </li>
        ))}
      </ol>
    </section>
  );
}

function Chapter({ entry, index, total, layout }: { entry: ShowcaseEntry; index: number; total: number; layout: Layout }) {
  const headingId = `chapter-${entry.key}`;
  const counter = (
    <p className="eyebrow tabular-nums text-ink-soft">
      {String(index + 1).padStart(2, "0")} <span className="opacity-50">/ {String(total).padStart(2, "0")}</span>
    </p>
  );
  const accent = index % 2 === 0 ? "text-terracotta" : "text-turquoise-deep";

  const header = (
    <Reveal>
      {counter}
      <h3 id={headingId} className="mt-4 text-title md:text-[2.8rem]">
        {entry.title}
      </h3>
      <p className="mt-4 max-w-md leading-relaxed text-ink-soft">{entry.intro}</p>
    </Reveal>
  );

  const list = <DishList dishes={entry.dishes} accent={accent} />;
  const cta = (
    <Link href={entry.href} className={clsx("eyebrow mt-10 inline-flex items-center gap-3", accent)}>
      <span className="link-line">Explore Full Menu</span> <ArrowRight />
    </Link>
  );

  const figure = entry.image && (
    <ImageReveal className="relative h-full min-h-[280px] overflow-hidden">
      <Image
        src={entry.image.src}
        alt={entry.image.alt}
        fill
        sizes={layout === "band" ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
        placeholder={entry.image.blurDataUrl ? "blur" : "empty"}
        blurDataURL={entry.image.blurDataUrl}
        className="object-cover"
      />
    </ImageReveal>
  );

  if (layout === "band") {
    return (
      <article aria-labelledby={headingId}>
        <div className="shell">
          <div className="relative aspect-[16/10] sm:aspect-[21/9]">{figure}</div>
        </div>
        <div className="shell mt-10 grid gap-10 md:mt-14 md:grid-cols-12">
          <div className="md:col-span-4">{header}</div>
          <div className="md:col-span-7 md:col-start-6">
            {list}
            {cta}
          </div>
        </div>
      </article>
    );
  }

  const reverse = layout === "split-reverse";
  return (
    <article aria-labelledby={headingId} className="shell grid gap-10 md:grid-cols-12 md:gap-12">
      <div className={clsx("relative aspect-[4/5] md:col-span-5 md:aspect-auto md:min-h-[560px]", reverse ? "md:order-2 md:col-start-8" : "md:col-start-1")}>
        {figure}
      </div>
      <div className={clsx("flex flex-col justify-center md:col-span-6", reverse ? "md:order-1 md:col-start-1" : "md:col-start-7")}>
        {header}
        <div className="mt-10">{list}</div>
        {cta}
      </div>
    </article>
  );
}

function DishList({ dishes, accent }: { dishes: DishDTO[]; accent: string }) {
  return (
    <ul className="divide-y divide-charcoal/10 border-y border-charcoal/10">
      {dishes.map((d) => (
        <li key={d.id} className="py-4">
          <div className="flex items-baseline">
            <span className="font-serif text-xl leading-tight">{d.name}</span>
            <span className="leader" aria-hidden />
            <Price dish={d} className={clsx("text-base", accent)} />
          </div>
          {d.description && <p className="mt-1 max-w-lg text-sm leading-relaxed text-ink-soft">{d.description}</p>}
        </li>
      ))}
    </ul>
  );
}
