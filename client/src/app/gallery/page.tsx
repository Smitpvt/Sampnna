import clsx from "clsx";
import type { Metadata } from "next";
import Link from "next/link";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { ArrowRight } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { cormorant } from "@/lib/fonts";
import { getGalleryImages } from "@/services/gallery";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photographs of Sampann's dining room, kitchen, drinks and dishes — brick arches, stained glass, turquoise banquettes and food from the menu.",
  alternates: { canonical: "/gallery" },
  openGraph: { title: "Gallery · Sampann, Alibag", images: [{ url: "/images/og/dining-room-long-view.jpg", alt: "The Sampann dining room" }] },
};

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className={clsx("min-h-screen bg-charcoal text-ivory", cormorant.variable)}>
      {/* Editorial Page Header matching GalleryPreview aesthetic */}
      <header className="shell pb-10 pt-32 md:pb-14 md:pt-40 lg:pt-44">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="eyebrow flex items-center gap-4 text-sand/70">
                <span aria-hidden className="h-px w-10 bg-turquoise" />
                A GLIMPSE INTO SAMPANN
              </p>
              <h1 className="mt-5 font-[family-name:var(--font-cormorant)] text-[clamp(2.8rem,1.4rem+4vw,5.5rem)] font-normal leading-[1.02] tracking-[-0.015em] text-ivory">
                A place for every
                <br />
                <em className="text-terracotta italic font-normal">moment.</em>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ivory/75">
                From the warmth of our dining room to the flavours on your plate, take a little look around Sampann — where good food and good company come together.
              </p>
            </div>
            <div className="flex items-center md:self-end">
              <span className="eyebrow text-[0.68rem] tracking-[0.24em] text-sand/70">
                CHAUL · ALIBAG · MAHARASHTRA
              </span>
            </div>
          </div>
        </Reveal>
      </header>

      {/* Main Filterable Bento Gallery */}
      <section aria-label="Photographs" className="shell pb-16 md:pb-20 lg:pb-24">
        {images.length ? (
          <GalleryGrid images={images} />
        ) : (
          <p className="py-24 text-center text-ivory/70">New photographs are on their way.</p>
        )}
      </section>

      {/* Closing Invitation CTA */}
      <section className="border-t border-ivory/10 bg-charcoal">
        <div className="shell flex flex-col items-start justify-between gap-8 pt-8 pb-16 md:flex-row md:items-center md:pt-12 md:pb-24 lg:pt-14">
          <div>
            <p className="eyebrow flex items-center gap-3 text-sand/70 uppercase">
              <span aria-hidden className="h-px w-6 bg-terracotta" />
              EXPERIENCE SAMPANN
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl font-normal text-ivory md:text-4xl lg:text-5xl">
              Seen enough? <em className="text-turquoise">Come and taste it.</em>
            </h2>
            <p className="mt-2 text-ivory/65">We cook from four kitchens and keep the table warm for you.</p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link href="/menu" className="btn btn-light uppercase">
              EXPLORE MENU
            </Link>
            <Link href="/contact#reserve" className="btn btn-primary uppercase">
              RESERVE A TABLE <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
