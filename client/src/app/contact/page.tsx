import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/contact/ContactForm";
import { ReservationSection } from "@/components/reservations/ReservationSection";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/config/site";
import { media } from "@/lib/media";

export const metadata: Metadata = {
  title: "Contact & Reservations",
  description: `Request a table at Sampann Resort & Restaurant, ${site.locality}. Call ${site.phone.display}, get directions, or send us a message about events and banquets.`,
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact & Reservations · Sampann, Alibag", images: [{ url: "/images/og/exterior-sign-dusk.jpg", alt: "Sampann sign at dusk" }] },
};

export default function ContactPage() {
  const arrival = media("exterior-sign-dusk");

  return (
    <>
      <section aria-labelledby="contact-title" className="relative isolate overflow-hidden bg-turquoise-deep text-ivory">
        <div className="shell grid gap-12 pb-16 pt-32 md:grid-cols-12 md:pb-24 md:pt-44">
          <Reveal className="md:col-span-7">
            <p className="eyebrow text-sand/80">Contact &amp; reservations</p>
            <h1 id="contact-title" className="mt-5 text-display">
              Come <em className="text-sand">find</em> us.
            </h1>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-ivory/85">
              In {site.locality}. Call us, request a table below, or send a note about events and larger gatherings.
            </p>
          </Reveal>
          <div className="relative aspect-[3/4] w-full max-w-xs justify-self-end overflow-hidden md:col-span-4 md:col-start-9">
            <Image src={arrival.src} alt={arrival.alt} fill priority sizes="(min-width: 768px) 320px, 80vw" placeholder="blur" blurDataURL={arrival.blurDataUrl} className="object-cover" />
          </div>
        </div>
      </section>

      <section aria-label="Contact details" className="bg-ivory">
        <dl className="shell grid gap-10 py-16 sm:grid-cols-2 md:py-20 lg:grid-cols-4">
          <div>
            <dt className="eyebrow text-terracotta">Call</dt>
            <dd className="mt-3 font-serif text-2xl">
              <a href={`tel:${site.phone.tel}`} className="link-line">
                {site.phone.display}
              </a>
            </dd>
          </div>
          <div>
            <dt className="eyebrow text-terracotta">Address</dt>
            <dd className="mt-3">
              <address className="not-italic leading-relaxed">
                {site.legalName}
                <br />
                {site.locality}, {site.region}
              </address>
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="link-line mt-3 inline-block text-sm font-semibold">
                Get directions
              </a>
            </dd>
          </div>
          <div>
            <dt className="eyebrow text-terracotta">Hours</dt>
            <dd className="mt-3 leading-relaxed">
              {site.openingHours
                ? site.openingHours.map((h) => (
                    <span key={h.days} className="block">
                      {h.days}: {h.hours}
                    </span>
                  ))
                : "Please call ahead to confirm today's timings."}
            </dd>
          </div>
          <div>
            <dt className="eyebrow text-terracotta">Follow</dt>
            <dd className="mt-3">
              <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="link-line">
                Instagram {site.instagram.handle}
              </a>
              {site.email && (
                <a href={`mailto:${site.email}`} className="link-line mt-2 block">
                  {site.email}
                </a>
              )}
            </dd>
          </div>
        </dl>
      </section>

      <ReservationSection />

      <section aria-labelledby="enquiry-title" className="bg-ivory py-24 md:py-32">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-turquoise-deep">Write to us</p>
            <h2 id="enquiry-title" className="mt-5 text-headline">
              Events, banquets &amp; questions.
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-ink-soft">
              We also host engagements, weddings, birthdays and party orders, with a banquet hall for larger gatherings. Tell us what
              you have in mind.
            </p>
            <div className="relative mt-10 aspect-[4/3] w-full overflow-hidden bg-sand">
              <iframe
                title={`Map: ${site.legalName}, ${site.locality}`}
                src={site.mapsEmbedUrl}
                className="absolute inset-0 size-full border-0 grayscale-[0.3]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="mt-3 text-xs text-ink-soft">Map shows a search for “{site.legalName}, {site.locality}”.</p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-4">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
