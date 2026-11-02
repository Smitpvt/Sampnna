import clsx from "clsx";
import type { Metadata } from "next";
import { Tiro_Devanagari_Marathi } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { ArrowRight } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/config/site";
import { copy } from "@/content/copy";
import { cormorant } from "@/lib/fonts";
import { media, type MediaAsset } from "@/lib/media";
import { getMenu } from "@/services/menu";
import styles from "./about.module.css";

/** The same Marathi serif the homepage uses for संपन्न; the site's Latin fonts have no Devanagari glyphs. */
const devanagari = Tiro_Devanagari_Marathi({ subsets: ["devanagari"], weight: "400", display: "swap" });

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About",
  description: "Sampann Resort & Restaurant in Chaul, Alibag: good food from Indian, Konkani, Maharashtrian and Continental kitchens, and a warm place for family and friends.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About · Sampann, Alibag", images: [{ url: "/images/og/lantern-brick-arch.jpg", alt: "Lantern on a brick arch at Sampann" }] },
};

/** A photo that fills its positioned parent. */
function Photo({ asset, sizes, focus, priority = false }: { asset: MediaAsset; sizes: string; focus?: string; priority?: boolean }) {
  return (
    <Image
      src={asset.src}
      alt={asset.alt}
      fill
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      blurDataURL={asset.blurDataUrl}
      className="object-cover"
      style={focus ? { objectPosition: focus } : undefined}
    />
  );
}

function Kitchen({ kitchen, wide = false }: { kitchen: (typeof copy.about.table.kitchens)[number]; wide?: boolean }) {
  return (
    <Reveal className={wide ? styles.kitchenWide : styles.kitchenNarrow}>
      <figure>
        <div className={styles.kitchenFig}>
          {/* A landscape photo cropped by height renders wider than its box, so `sizes` follows that, not the box — too small a value is what makes it blurry. */}
          <Photo asset={media(kitchen.image)} focus={kitchen.focus} sizes="(min-width: 1101px) 26vw, 60vw" />
        </div>
        <figcaption>
          <h3 className={styles.kitchenName}>{kitchen.name}</h3>
          <span className={styles.pictured}>Pictured: {kitchen.pictured}</span>
        </figcaption>
      </figure>
    </Reveal>
  );
}

export default async function AboutPage() {
  const about = copy.about;
  const menu = await getMenu();
  const dishes = menu.flatMap((c) => c.dishes);
  const [indian, maharashtrian, konkani, continental] = about.table.kitchens;
  const chef = media("kitchen-wok");
  const hands = media("kitchen-dough");
  const finishing = media("kitchen-finishing");

  return (
    <div className={styles.page}>
      {/* Opening: the word and what it means, filling one screen on laptops; the dining room follows below */}
      <header className={styles.hero}>
        <div className={styles.top}>
          <p className={clsx("eyebrow", styles.heroEyebrow)}>{about.hero.eyebrow}</p>
          <p className={clsx("eyebrow", styles.topLocation)}>{about.hero.location}</p>
        </div>
        <Reveal y={18} className={styles.wordWrap}>
          <p lang="mr" className={clsx(devanagari.className, styles.deva)}>
            {copy.story.word}
          </p>
          <h1 className={styles.word}>Sampann</h1>
        </Reveal>
        <div className={clsx(styles.g12, styles.entry)}>
          <div className={styles.lab}>
            <b>{copy.story.pronunciation}</b>
            <span>
              {about.hero.meanings.map((m) => (
                <span key={m.word} className="block">
                  <span lang="mr" className={clsx(devanagari.className, styles.dv)}>
                    {m.word}
                  </span>{" "}
                  — {m.gloss}
                </span>
              ))}
            </span>
          </div>
          <ul className={styles.senses}>
            {about.hero.senses.map((sense, i) => (
              <li key={sense.href}>
                <a href={sense.href} className={styles.sense}>
                  <span className={styles.senseNum}>{i + 1}</span>
                  <span className={styles.senseTitle}>{sense.title}</span>
                  <span className={styles.senseLabel}>
                    {sense.label}
                    <svg viewBox="0 0 24 24" aria-hidden className="size-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M12 5v14M6 13l6 6 6-6" />
                    </svg>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className={styles.heroLogo}>
            <Logo className="h-8 w-auto xl:h-11" />
            <p className="eyebrow text-[0.62rem]">{about.hero.location}</p>
          </div>
        </div>
      </header>
      <figure className={styles.room}>
        <Photo asset={media("dining-room-arches")} focus="50% 58%" sizes="100vw" />
        <figcaption className={styles.notch}>{about.hero.roomCaption}</figcaption>
      </figure>

      {/* 1. A Table Full of Flavours */}
      <section aria-labelledby="about-table" className={styles.tableSection}>
        <div className={clsx("shell", styles.g12, styles.split)}>
          <div className={styles.tableLeft}>
            <div className={clsx(styles.g12, styles.chead)}>
              <p className={styles.num}>
                <b>1.</b>
                <span>{about.table.label}</span>
              </p>
              <h2 id="about-table">
                A Table Full
                <br />
                of <em>Flavours</em>
              </h2>
            </div>
            <Reveal>
              <p className={styles.lead}>{about.table.lead}</p>
              <p className={styles.splitBody}>{about.table.body}</p>
            </Reveal>
          </div>
          <div className={styles.tablePhotos}>
            <Kitchen kitchen={indian} wide />
            <Kitchen kitchen={konkani} />
            <Kitchen kitchen={maharashtrian} />
            <Kitchen kitchen={continental} wide />
          </div>
        </div>
      </section>

      {/* 2. The chef and the kitchen. No chef's name or story has been supplied, so none is shown until copy.ts has one. */}
      <section aria-labelledby="about-kitchen" className={clsx(styles.chapter, cormorant.variable)}>
        <div className={clsx("shell", styles.chefHead)}>
          <div>
            <p className={styles.num}>
              <b>2.</b>
              <span>{about.kitchen.label}</span>
            </p>
            <h2 id="about-kitchen" className={styles.spreadTitle}>
              The Hands Behind
              <br />
              the <em>Flavours</em>
            </h2>
          </div>
          <div className={styles.chefLeadWrap}>
            <p className={styles.chefLead}>{about.kitchen.lead}</p>
            {about.kitchen.chefName && <p className={clsx("eyebrow", styles.chefName)}>{about.kitchen.chefName}</p>}
          </div>
        </div>

        <div className={clsx("shell", styles.stage)}>
          {/* The chef, with the closing line in a tab cut out of the photo's lower-left corner. */}
          <Reveal className={styles.stageChef}>
            <figure className={styles.chefFigure}>
              <Photo asset={chef} focus="58% 15%" sizes="(min-width: 1101px) 66vw, 100vw" />
            </figure>
            <p className={styles.chefNote}>{about.kitchen.note}</p>
          </Reveal>

          <div className={styles.stageBody}>
            {about.kitchen.chefStory && <p className={styles.chefBody}>{about.kitchen.chefStory}</p>}
            <p className={styles.chefBody}>{about.kitchen.body}</p>
          </div>

          {/* Dough, framed in the page colour, stepping over the chef photo's right edge. */}
          <Reveal delay={0.15} className={styles.stageDough}>
            <figure className={styles.doughFrame}>
              <Photo asset={hands} focus="50% 40%" sizes="(min-width: 1101px) 32vw, 50vw" />
            </figure>
          </Reveal>

          <Reveal delay={0.2} className={styles.stageFinish}>
            <figure className={styles.finishFigure}>
              <Photo asset={finishing} focus="62% 60%" sizes="(min-width: 1101px) 32vw, 50vw" />
            </figure>
          </Reveal>
        </div>
      </section>

      <div className={styles.tally}>
        <div className={clsx("shell", styles.tallyRow)}>
          <p>
            <b>{dishes.length}</b>dishes on the menu.
          </p>
          <Link href="/menu" className={styles.lnk}>
            Explore the Menu <ArrowRight />
          </Link>
        </div>
      </div>

      {/* 3. A Place to Come Together — the dark section; its heading crosses the top edge */}
      <section aria-labelledby="about-place" className={clsx(styles.dark, cormorant.variable)}>
        <div className={clsx("shell", styles.g12, styles.chead, styles.cross, styles.placeHead)}>
          <h2 id="about-place">
            A Place to
            <br />
            Come <em>Together</em>
          </h2>
        </div>
        <div className={clsx("shell", styles.placeEyebrow)}>
          <p className={styles.num}>
            <b>3.</b>
            <span>{about.place.label}</span>
          </p>
        </div>
        <div className={clsx("shell", styles.placeStage)}>
          <Reveal className={styles.placeLead}>
            <p className={styles.placeIntro}>{about.place.body}</p>
          </Reveal>
          <Reveal className={styles.placeMain}>
            <figure className={styles.placeMainFigure}>
              <div className={clsx(styles.placeMainPhoto, styles.vivid)}>
                <Photo asset={media("dining-room-windows")} sizes="(min-width: 1024px) 62vw, 100vw" />
              </div>
              <figcaption className={styles.roomCaption}>
                {about.place.photoCaption} <span>Chaul · Alibag</span>
              </figcaption>
            </figure>
          </Reveal>
          {/* The laid table, in a cut-out of the room photo's lower-left corner. */}
          <Reveal delay={0.15} className={styles.placeSmall}>
            <div className={styles.placeRing}>
              <figure className={clsx(styles.placeSmallPhoto, styles.vivid)}>
                <Photo asset={media("table-setting-banquette")} sizes="(min-width: 1024px) 36vw, 70vw" />
              </figure>
            </div>
          </Reveal>
        </div>
        <div className={clsx("shell", styles.g12, styles.where)}>
          <Reveal className={styles.name}>
            <p className="eyebrow">{about.place.findUs}</p>
            <h3>
              {about.place.town}
              <em>{about.place.area}</em>
            </h3>
          </Reveal>
          <Reveal delay={0.1} className={styles.feat}>
            <ul>
              {about.place.features.map((feature, i) => (
                <li key={feature}>
                  {feature}
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <div className="shell">
          <Reveal className={styles.placeWideWrap}>
            <figure className={clsx(styles.placeWide, styles.vivid)}>
              <Photo asset={media("arched-window-garden")} focus="50% 55%" sizes="100vw" />
            </figure>
          </Reveal>
        </div>
      </section>

      {/* 4. Moments Worth Sharing — its heading crosses back out of the dark section */}
      <section aria-labelledby="about-moments" className={styles.moments}>
        <div className={clsx("shell", styles.momentsInner)}>
          <div className={clsx(styles.g12, styles.chead, styles.cross, styles.momentsHead)}>
            <h2 id="about-moments">
              Moments Worth
              <br />
              <em>Sharing</em>
            </h2>
          </div>
          <p className={clsx(styles.num, styles.momentsNum)}>
            <b>4.</b>
            <span>{about.moments.label}</span>
          </p>
          <div className={styles.peopleStage}>
            <Reveal className={styles.peopleLine}>
              <p>
                {about.moments.lines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
                <em>{about.moments.lineAccent}</em>
              </p>
            </Reveal>
            <Reveal className={styles.peopleFrame}>
              <figure className={styles.peopleTable}>
                <Photo asset={media("table-setting-overhead")} focus="50% 45%" sizes="(min-width: 900px) 46vw, 80vw" />
              </figure>
              {/* The drink's foot rests on the event band's top rule. */}
              <figure className={styles.peopleDrink}>
                <Photo asset={media("mocktail-coupe")} focus="30% 55%" sizes="(min-width: 900px) 20vw, 40vw" />
              </figure>
            </Reveal>
            <div className={styles.peopleEvents}>
              <p className={clsx("eyebrow", styles.peopleLabel)}>{about.moments.hostLabel}</p>
              <ul>
                {site.events.map((event, i) => (
                  <li key={event}>
                    <span className={styles.eventNum}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={styles.eventName}>{event}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The Table Is Set */}
      <section aria-labelledby="about-close" className={clsx("shell", styles.close, cormorant.variable)}>
        <Reveal className={styles.closeText}>
          <p lang="mr" className={clsx(devanagari.className, styles.deva)}>
            {copy.story.word}
          </p>
          <h2 id="about-close">
            The Table
            <br />
            Is <em>Set</em>
          </h2>
          <p className={styles.closeBody}>
            {about.close.body}{" "}
            <span lang="mr" className={clsx(devanagari.className, styles.closeInvite)}>
              {about.close.invite}
            </span>
          </p>
          <div className={styles.ctas}>
            <Link href="/menu" className="btn btn-dark">
              Explore the Menu <ArrowRight />
            </Link>
            <Link href="/contact#reserve" className="btn btn-primary">
              Reserve a Table <ArrowRight />
            </Link>
          </div>
        </Reveal>
        <div className={styles.closePhotos}>
          <figure className={styles.closeMain}>
            {/* A landscape photo cropped by height renders wider than its box, so `sizes` follows that. */}
            <Photo asset={media("dining-room-arches")} focus="50% 78%" priority sizes="(min-width: 900px) 72vw, 100vw" />
            <figcaption className={styles.closeNotch}>{about.close.location}</figcaption>
          </figure>
          <figure className={styles.closeInset}>
            <Photo asset={media("table-setting-row")} sizes="(min-width: 900px) 36vw, 50vw" />
          </figure>
        </div>
      </section>
      <div className={styles.endRule} />
    </div>
  );
}
