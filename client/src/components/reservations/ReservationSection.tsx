import Image from "next/image";
import { copy } from "@/content/copy";
import { site } from "@/config/site";
import type { MediaAsset } from "@/lib/media";
import { Reveal } from "@/components/ui/Reveal";
import { ReservationForm } from "./ReservationForm";

/** Section H — reservation request, in the deep terracotta of the brick. */
export function ReservationSection({ image }: { image?: MediaAsset }) {
  return (
    <section id="reserve" aria-labelledby="reserve-title" className="relative isolate overflow-hidden bg-terracotta-deep text-ivory">
      <div className="grid lg:grid-cols-12">
        {image && (
          <div className="relative hidden min-h-full lg:col-span-4 lg:block">
            <Image src={image.src} alt={image.alt} fill sizes="33vw" placeholder="blur" blurDataURL={image.blurDataUrl} className="object-cover" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-transparent to-terracotta-deep/60" />
          </div>
        )}
        <div className={image ? "lg:col-span-8" : "lg:col-span-12"}>
          <div className="mx-auto grid max-w-5xl gap-12 px-5 py-24 md:px-10 md:py-32 xl:grid-cols-5 xl:px-16">
            <Reveal className="xl:col-span-2">
              <p className="eyebrow text-sand">{copy.reserve.eyebrow}</p>
              <h2 id="reserve-title" className="mt-5 text-headline">
                {copy.reserve.heading}
              </h2>
              <p className="mt-6 leading-relaxed text-ivory/85">{copy.reserve.body}</p>
              <p className="mt-8 text-sm text-ivory/75">
                Prefer to talk?{" "}
                <a href={`tel:${site.phone.tel}`} className="link-line text-ivory">
                  {site.phone.display}
                </a>
              </p>
            </Reveal>
            <div className="xl:col-span-3">
              <ReservationForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
