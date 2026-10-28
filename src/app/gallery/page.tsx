import type { Metadata } from "next";
import Link from "next/link";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { ArrowRight } from "@/components/ui/Icons";
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
    <div className="bg-charcoal text-ivory">
      <header className="shell pb-12 pt-32 md:pb-16 md:pt-44">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="eyebrow text-sand/70">Gallery</p>
            <h1 className="mt-5 text-display">
              A room <em className="text-turquoise">to linger</em> in.
            </h1>
          </div>
          <p className="max-w-sm text-lg leading-relaxed text-ivory/75 md:col-span-4">
            The dining room, the kitchen at work and plates from the menu — photographed at Sampann.
          </p>
        </div>
      </header>

      <section aria-label="Photographs" className="shell pb-24 md:pb-32">
        {images.length ? (
          <GalleryGrid images={images} />
        ) : (
          <p className="py-24 text-center text-ivory/70">New photographs are on their way.</p>
        )}
      </section>

      <section className="border-t border-ivory/10">
        <div className="shell flex flex-col items-start justify-between gap-6 py-16 md:flex-row md:items-center">
          <p className="max-w-lg font-serif text-3xl leading-tight">Seen enough? Come and taste it.</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/menu" className="btn btn-light">
              Explore Menu
            </Link>
            <Link href="/contact#reserve" className="btn btn-primary">
              Reserve a Table <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
