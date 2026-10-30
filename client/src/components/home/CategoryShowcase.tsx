import clsx from "clsx";
import { Cormorant_Garamond } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { ImageReveal, Reveal } from "@/components/ui/Reveal";
import type { ImageRef } from "@/types/content";
import styles from "./CategoryShowcase.module.css";

/** Cormorant Garamond, loaded for this section only — the rest of the site keeps its own serif. */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export type CourseCard = {
  slug: string;
  name: string;
  image: ImageRef;
  /** CSS object-position for the photo. */
  focus?: string;
  /** Optional second, smaller photo (the drink beside the dessert). */
  inset?: { image: ImageRef; focus?: string };
};

/** The five featured courses, in chapter order. Soups & Salads stays reachable from the full menu. */
const FEATURED = ["starters", "indian-mains", "maharashtrian-specials", "continental-and-asian", "desserts-and-drinks"] as const;

/**
 * Section D — "One Table. Many Kitchens." The headline sits beside a large
 * Maharashtrian Specials block; Starters is an arched column on the right,
 * Indian Mains sits beneath the headline, and Continental & Asian and
 * Desserts & Drinks are panel-and-photo blocks along the bottom. Each block
 * opens the menu filtered to its course; the link under the headline opens
 * the full menu. Layout and styling live in CategoryShowcase.module.css.
 */
export function CategoryShowcase({ courses }: { courses: CourseCard[] }) {
  const bySlug = new Map(courses.map((c) => [c.slug, c]));
  const get = (slug: (typeof FEATURED)[number]) => bySlug.get(slug);
  const number = (slug: (typeof FEATURED)[number]) => String(FEATURED.indexOf(slug) + 1).padStart(2, "0");

  const starters = get("starters");
  const indian = get("indian-mains");
  const maharashtrian = get("maharashtrian-specials");
  const continental = get("continental-and-asian");
  const desserts = get("desserts-and-drinks");

  return (
    <section aria-labelledby="courses-title" className={clsx(styles.section, cormorant.variable)}>
      <div className={styles.comp}>
        <Reveal y={16} className={styles.head}>
          <p className={styles.eyebrow}>A world of flavours</p>
          <h2 id="courses-title" className={styles.headline}>
            One Table.<em>Many Kitchens.</em>
          </h2>
          <p className={styles.lede}>From familiar favourites to flavours from around the world.</p>
          <div className={styles.more}>
            <Link href="/menu" className={styles.moreLink}>
              Explore the full menu <span aria-hidden>↗</span>
            </Link>
            <span className={clsx(styles.eyebrow, styles.place)}>Chaul · Alibag</span>
          </div>
        </Reveal>

        {maharashtrian && (
          <Block area={styles.m} delay={0.1} course={maharashtrian} sizes="(min-width: 1024px) 50vw, 100vw">
            <span className={clsx(styles.tab, styles.tabBl)}>
              <span className={styles.num}>{number("maharashtrian-specials")}</span>
              <span className={styles.eyebrow}>The heart of the kitchen</span>
              <Title name={maharashtrian.name} />
            </span>
          </Block>
        )}

        {starters && (
          <Block area={styles.s} delay={0.2} course={starters} sizes="(min-width: 1024px) 17vw, 42vw">
            <span className={clsx(styles.tab, styles.tabBl)}>
              <span className={styles.num}>{number("starters")}</span>
              <Title name={starters.name} />
            </span>
          </Block>
        )}

        {indian && (
          <Block area={styles.i} delay={0.28} course={indian} sizes="(min-width: 1024px) 34vw, 58vw">
            <span className={clsx(styles.tab, styles.tabTr)}>
              <span className={styles.num}>{number("indian-mains")}</span>
              <Title name={indian.name} />
            </span>
          </Block>
        )}

        {continental && (
          <PanelBlock area={styles.c} delay={0.36} course={continental} num={number("continental-and-asian")} eyebrow="Further afield" sizes="(min-width: 1024px) 19vw, 56vw" />
        )}

        {desserts && <PanelBlock area={styles.d} delay={0.44} course={desserts} num={number("desserts-and-drinks")} sizes="(min-width: 1024px) 21vw, 62vw" />}
      </div>
    </section>
  );
}

function Title({ name }: { name: string }) {
  return (
    <span className={styles.title}>
      {name}
      <span aria-hidden className={styles.go}>
        ↗
      </span>
    </span>
  );
}

function Photo({ image, focus, sizes, alt = image.alt }: { image: ImageRef; focus?: string; sizes: string; alt?: string }) {
  return (
    <Image
      src={image.src}
      alt={alt}
      fill
      sizes={sizes}
      placeholder={image.blurDataUrl ? "blur" : "empty"}
      blurDataURL={image.blurDataUrl}
      className={styles.img}
      style={focus ? { objectPosition: focus } : undefined}
    />
  );
}

/** A photo block with its title in a cut-out tab (passed as children). */
function Block({ area, delay, course, sizes, children }: { area: string; delay: number; course: CourseCard; sizes: string; children: React.ReactNode }) {
  return (
    <ImageReveal delay={delay} className={clsx(styles.cell, area)}>
      <Link href={`/menu?course=${course.slug}`} className={styles.blk}>
        <span className={styles.photo}>
          <Photo image={course.image} focus={course.focus} sizes={sizes} />
        </span>
        {children}
      </Link>
    </ImageReveal>
  );
}

/** A coloured panel carrying the title, beside an inset photo — plus the drink arch when the course has one. */
function PanelBlock({ area, delay, course, num, eyebrow, sizes }: { area: string; delay: number; course: CourseCard; num: string; eyebrow?: string; sizes: string }) {
  return (
    <ImageReveal delay={delay} className={clsx(styles.cell, area)}>
      <Link href={`/menu?course=${course.slug}`} className={styles.blk}>
        <span className={styles.side}>
          {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
          <span>
            <span className={styles.num}>{num}</span>
            <Title name={course.name} />
          </span>
        </span>
        <span className={styles.pic}>
          <Photo image={course.image} focus={course.focus} sizes={sizes} />
        </span>
        {course.inset && (
          <span className={styles.arch}>
            <Photo image={course.inset.image} focus={course.inset.focus} sizes="120px" />
          </span>
        )}
      </Link>
    </ImageReveal>
  );
}
