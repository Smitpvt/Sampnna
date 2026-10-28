import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icons";
import { ImageReveal, Reveal } from "@/components/ui/Reveal";
import { site } from "@/config/site";
import { copy } from "@/content/copy";
import { media } from "@/lib/media";

export const metadata: Metadata = {
  title: "About",
  description:
    "Sampann means abundance — rich, fulfilled, complete. Discover the idea behind Sampann Resort & Restaurant in Chaul, Alibag: many kitchens, one warm dining room.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About · Sampann, Alibag", images: [{ url: "/images/og/lantern-brick-arch.jpg", alt: "Lantern on a brick arch at Sampann" }] },
};

const KITCHEN_IMAGES = ["kombadi-vade", "chongqing-mala-chicken", "pasta-parmesan", "tandoori-board"] as const;

export default function AboutPage() {
  const hero = media("dining-room-windows");
  const lantern = media("lantern-brick-arch");
  const room = [media("arched-window-garden"), media("table-setting-banquette"), media("exterior-sign-dusk")];
  const kitchen = media("kitchen-wok");

  return (
    <>
      {/* Hero: a quieter, typographic entrance than the homepage */}
      <section aria-labelledby="about-title" className="relative isolate flex min-h-[85svh] items-end overflow-hidden bg-charcoal text-ivory">
        <Image src={hero.src} alt={hero.alt} fill priority sizes="100vw" placeholder="blur" blurDataURL={hero.blurDataUrl} className="-z-20 object-cover opacity-55" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/30" />
        <div className="shell pb-16 pt-40 md:pb-24">
          <Reveal>
            <p className="eyebrow text-sand">About Sampann</p>
            <h1 id="about-title" className="mt-6 max-w-5xl text-display">
              Rich. Fulfilled. <em className="text-sand">Complete.</em>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ivory/85">{copy.about.intro}</p>
          </Reveal>
        </div>
      </section>

      {/* The word */}
      <section aria-labelledby="meaning-title" className="bg-ivory py-24 md:py-36">
        <div className="shell grid gap-14 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <p className="eyebrow text-terracotta">The meaning</p>
            <p lang="mr" className="mt-6 font-serif text-[clamp(5rem,14vw,11rem)] leading-[0.85] text-turquoise-deep">
              {copy.story.word}
            </p>
            <h2 id="meaning-title" className="mt-6 font-serif text-2xl text-ink-soft">
              <span className="italic">sampann</span> — abundant, prosperous, complete
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="space-y-6 text-lg leading-relaxed text-ink-soft md:col-span-6 md:col-start-7 md:pt-20">
            {copy.about.meaning.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Many kitchens */}
      <section aria-labelledby="kitchens-title" className="bg-turquoise-deep py-24 text-ivory md:py-36">
        <div className="shell">
          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            <Reveal className="md:col-span-6">
              <p className="eyebrow text-sand/80">Culinary philosophy</p>
              <h2 id="kitchens-title" className="mt-5 text-headline">
                Many kitchens, <em className="text-sand">one</em> table.
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="md:col-span-5 md:col-start-8">
              <p className="text-lg leading-relaxed text-ivory/85">{copy.about.kitchens}</p>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
                {site.cuisines.map((c) => (
                  <li key={c} className="eyebrow text-sand">
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <ul className="mt-16 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {KITCHEN_IMAGES.map((slug, i) => {
              const m = media(slug);
              return (
                <li key={slug} className={i % 2 ? "md:mt-16" : ""}>
                  <ImageReveal delay={i * 0.08} className="relative aspect-[3/4] overflow-hidden">
                    <Image src={m.src} alt={m.alt} fill sizes="(min-width: 768px) 25vw, 50vw" placeholder="blur" blurDataURL={m.blurDataUrl} className="object-cover" />
                  </ImageReveal>
                  <p className="mt-3 font-serif text-lg text-ivory/90">{m.caption}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* The room */}
      <section aria-labelledby="room-title" className="overflow-hidden bg-ivory py-24 md:py-36">
        <div className="shell grid gap-12 md:grid-cols-12">
          <div className="relative md:col-span-5">
            <ImageReveal className="relative aspect-[2/3] overflow-hidden">
              <Image src={lantern.src} alt={lantern.alt} fill sizes="(min-width: 768px) 40vw, 100vw" placeholder="blur" blurDataURL={lantern.blurDataUrl} className="object-cover" />
            </ImageReveal>
          </div>
          <div className="flex flex-col justify-center md:col-span-6 md:col-start-7">
            <Reveal>
              <p className="eyebrow text-terracotta">Atmosphere &amp; hospitality</p>
              <h2 id="room-title" className="mt-5 text-headline">
                Brick, glass and <em className="text-turquoise-deep">turquoise</em>.
              </h2>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-ink-soft">{copy.about.room}</p>
            </Reveal>
            <div className="mt-12 grid grid-cols-3 gap-3">
              {room.map((m, i) => (
                <ImageReveal key={m.slug} delay={i * 0.08} className="relative aspect-[3/4] overflow-hidden">
                  <Image src={m.src} alt={m.alt} fill sizes="(min-width: 768px) 16vw, 33vw" placeholder="blur" blurDataURL={m.blurDataUrl} className="object-cover" />
                </ImageReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The dining experience */}
      <section aria-labelledby="experience-title" className="relative isolate overflow-hidden bg-charcoal py-24 text-ivory md:py-36">
        <Image src={kitchen.src} alt="" fill sizes="100vw" className="-z-10 object-cover opacity-20" />
        <div className="shell">
          <Reveal>
            <p className="eyebrow text-sand/70">The dining experience</p>
            <h2 id="experience-title" className="mt-5 max-w-3xl text-headline">
              Unhurried, generous, <em className="text-sand">shared</em>.
            </h2>
          </Reveal>
          <ol className="mt-16 grid gap-10 md:grid-cols-3 md:gap-12">
            {copy.about.experience.map((item, i) => (
              <li key={item.title}>
                <Reveal delay={i * 0.1} className="border-t border-ivory/20 pt-6">
                  <p className="eyebrow tabular-nums text-terracotta">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-4 font-serif text-3xl">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-ivory/75">{item.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
          <p className="mt-16 text-sm text-ivory/60">We also host: {site.events.join(" · ")}.</p>
        </div>
      </section>

      {/* CTAs */}
      <section className="bg-sand/60">
        <div className="shell grid md:grid-cols-2">
          <Link href="/menu" className="group flex flex-col justify-between gap-10 border-b border-charcoal/10 py-16 md:border-b-0 md:border-r md:py-24 md:pr-12">
            <p className="eyebrow text-terracotta">Explore</p>
            <p className="font-serif text-4xl leading-tight md:text-5xl">
              Read the full menu <ArrowRight className="inline size-8 transition-transform duration-500 group-hover:translate-x-2" />
            </p>
          </Link>
          <Link href="/contact#reserve" className="group flex flex-col justify-between gap-10 py-16 md:py-24 md:pl-12">
            <p className="eyebrow text-turquoise-deep">Visit</p>
            <p className="font-serif text-4xl leading-tight md:text-5xl">
              Reserve a table <ArrowRight className="inline size-8 transition-transform duration-500 group-hover:translate-x-2" />
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
