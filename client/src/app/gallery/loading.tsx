import { cormorant } from "@/lib/fonts";
import clsx from "clsx";

export default function GalleryLoading() {
  return (
    <div className={clsx("min-h-screen bg-charcoal text-ivory", cormorant.variable)}>
      {/* Editorial Page Header skeleton matching actual layout */}
      <header className="shell pb-10 pt-32 md:pb-14 md:pt-40 lg:pt-44">
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
      </header>

      {/* Main Skeleton Bento */}
      <section aria-label="Loading photographs" className="shell pb-16 md:pb-20 lg:pb-24">
        <div className="border-b border-ivory/15 pb-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-16 rounded-full bg-terracotta/70 animate-pulse" />
            <div className="h-8 w-18 rounded-full bg-ivory/[0.06] animate-pulse" />
            <div className="h-8 w-20 rounded-full bg-ivory/[0.06] animate-pulse" />
            <div className="h-8 w-22 rounded-full bg-ivory/[0.06] animate-pulse" />
            <div className="h-8 w-20 rounded-full bg-ivory/[0.06] animate-pulse" />
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-[14px] md:mt-12">
          <div className="grid gap-[14px] grid-cols-2 lg:grid-cols-12 lg:grid-rows-3 lg:aspect-[1312/643]">
            <div className="col-span-2 lg:col-span-5 lg:row-span-2 rounded-[6px] bg-ivory/[0.04] aspect-[4/3] lg:aspect-auto animate-pulse" />
            <div className="col-span-1 lg:col-span-2 lg:row-span-2 rounded-[6px] bg-ivory/[0.04] aspect-[4/5] lg:aspect-auto animate-pulse" />
            <div className="col-span-1 lg:col-span-3 lg:row-span-1 rounded-[6px] bg-ivory/[0.04] aspect-square lg:aspect-auto animate-pulse" />
            <div className="col-span-1 lg:col-span-2 lg:row-span-1 rounded-[6px] bg-ivory/[0.04] aspect-square lg:aspect-auto animate-pulse" />
            <div className="col-span-2 lg:col-span-5 lg:row-span-2 rounded-[6px] bg-ivory/[0.04] aspect-[4/3] lg:aspect-auto animate-pulse" />
          </div>
        </div>
      </section>
    </div>
  );
}
