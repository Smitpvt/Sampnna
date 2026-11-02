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
  const room = media("dining-room-arches");

  return (
    <>
      {/* Spacious Premium Editorial Hero Section */}
      <div className="relative bg-turquoise-deep">
        <section
          aria-labelledby="contact-title"
          className="relative isolate overflow-hidden bg-turquoise-deep text-ivory pt-28 pb-16 md:pt-36 md:pb-20 lg:pt-40 lg:pb-24"
        >
          <div className="shell grid gap-12 lg:grid-cols-12 lg:items-center xl:gap-16">
            {/* Left Content Column (offset ~36px downward on desktop) */}
            <Reveal className="lg:col-span-6 xl:col-span-6 lg:pt-9">
              <div className="flex items-center gap-3">
                <span aria-hidden className="h-px w-8 bg-terracotta" />
                <p className="eyebrow text-xs tracking-[0.22em] text-sand/90">CONTACT &amp; RESERVATIONS</p>
              </div>

              {/* Expressive, visually dominant headline matching mockup */}
              <h1
                id="contact-title"
                className="mt-6 font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[4.75rem] xl:text-[5.5rem] font-normal leading-[0.98] tracking-[-0.01em]"
              >
                Come <em className="italic font-serif font-normal text-ivory">find</em>
                <br />
                us.
              </h1>

              <p className="mt-8 max-w-md text-base md:text-lg leading-relaxed text-ivory/85">
                In {site.locality}. Call us, request a table below, or send a note about events and larger gatherings.
              </p>

              {/* Action Buttons */}
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="#reserve"
                  className="inline-flex items-center gap-2.5 bg-terracotta px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-terracotta-deep"
                >
                  <span>Request a table</span>
                  <span aria-hidden>↓</span>
                </a>
                <a
                  href={`tel:${site.phone.tel}`}
                  className="inline-flex items-center gap-2.5 border border-sand/40 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-ivory transition-colors hover:border-ivory hover:bg-ivory/10"
                >
                  <span>Call {site.phone.display}</span>
                </a>
              </div>
            </Reveal>

            {/* Right Dining Room Image with Architectural Framing */}
            <Reveal className="relative lg:col-span-6 xl:col-span-6 flex justify-end">
              <div className="relative w-full max-w-[580px] xl:max-w-[640px]">
                {/* Architectural fine line & vertical caption */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-6 -left-8 right-0 bottom-0 border-t border-l border-sand/35 hidden sm:block"
                >
                  <span
                    className="absolute left-[-26px] top-10 text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-sand/80 select-none"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    The Dining Room · Chaul, Alibag
                  </span>
                </div>

                {/* Large, impactful crop of the dining room */}
                <div className="relative aspect-[16/11] lg:aspect-[4/3] w-full overflow-hidden shadow-2xl">
                  <Image
                    src={room.src}
                    alt={room.alt}
                    fill
                    priority
                    sizes="(min-width: 1280px) 640px, (min-width: 1024px) 560px, 100vw"
                    placeholder="blur"
                    blurDataURL={room.blurDataUrl}
                    className="object-cover object-center"
                  />
                </div>
              </div>
            </Reveal>
          </div>

          {/* Subtle editorial flourish finishing detail */}
          <div className="shell mt-14 pt-8 md:mt-18 md:pt-10 lg:mt-20 lg:pt-10 border-t border-ivory/10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3.5">
                <span aria-hidden className="h-px w-8 bg-terracotta shrink-0" />
                <p className="font-serif italic text-base sm:text-lg lg:text-xl text-ivory/90 tracking-[-0.01em]">
                  “Some places are best <span className="text-terracotta">found</span> around a table.”
                </p>
              </div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-sand/70 sm:text-right">
                CHAUL · ALIBAG
              </p>
            </div>
          </div>
        </section>

        {/* Generous Cream Contact Information Strip */}
        <section aria-label="Contact details" className="relative z-10 border-t border-sand/50 bg-ivory text-charcoal shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
          <div className="shell relative">
            <dl className="grid gap-10 py-12 sm:grid-cols-2 md:py-16 lg:grid-cols-4 lg:py-20 sm:divide-x sm:divide-sand/50">
              {/* Column 1: Call */}
              <div className="lg:pr-8">
                <div className="flex items-center gap-2">
                  <span className="font-serif italic text-sand-deep text-sm">01</span>
                  <dt className="eyebrow text-xs tracking-[0.22em] text-terracotta font-semibold">CALL</dt>
                </div>
                <dd className="mt-3 font-serif text-2xl lg:text-3xl text-charcoal">
                  <a href={`tel:${site.phone.tel}`} className="link-line">
                    {site.phone.display}
                  </a>
                </dd>
              </div>

              {/* Column 2: Address */}
              <div className="sm:pl-8 lg:px-8">
                <div className="flex items-center gap-2">
                  <span className="font-serif italic text-sand-deep text-sm">02</span>
                  <dt className="eyebrow text-xs tracking-[0.22em] text-terracotta font-semibold">ADDRESS</dt>
                </div>
                <dd className="mt-3 text-sm lg:text-[0.95rem] leading-relaxed text-charcoal">
                  <address className="not-italic">
                    {site.legalName}
                    <br />
                    {site.locality}, {site.region}
                  </address>
                  <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="link-line mt-2 inline-block text-xs font-semibold text-charcoal">
                    Get directions
                  </a>
                </dd>
              </div>

              {/* Column 3: Hours */}
              <div className="sm:pl-8 lg:px-8">
                <div className="flex items-center gap-2">
                  <span className="font-serif italic text-sand-deep text-sm">03</span>
                  <dt className="eyebrow text-xs tracking-[0.22em] text-terracotta font-semibold">HOURS</dt>
                </div>
                <dd className="mt-3 text-sm lg:text-[0.95rem] leading-relaxed text-ink-soft">
                  {site.openingHours
                    ? site.openingHours.map((h) => (
                        <span key={h.days} className="block">
                          {h.days}: {h.hours}
                        </span>
                      ))
                    : "Please call ahead to confirm today's timings."}
                </dd>
              </div>

              {/* Column 4: Follow */}
              <div className="sm:pl-8 lg:pl-8">
                <div className="flex items-center gap-2">
                  <span className="font-serif italic text-sand-deep text-sm">04</span>
                  <dt className="eyebrow text-xs tracking-[0.22em] text-terracotta font-semibold">FOLLOW</dt>
                </div>
                <dd className="mt-3 text-sm lg:text-[0.95rem] text-charcoal">
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
          </div>
        </section>
      </div>

      <ReservationSection />

      <section id="enquiry" aria-labelledby="enquiry-title" className="relative isolate overflow-hidden bg-[#FAF5EE] py-20 md:py-28 lg:py-32">
        {/* Top-right organic terracotta accent curve from reference */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 -right-10 w-48 sm:w-64 lg:w-80 h-36 sm:h-48 lg:h-60 rounded-bl-[140px] sm:rounded-bl-[180px] bg-terracotta/90 -z-10"
        />

        {/* Bottom-left deep teal/green decorative curved shape from reference image */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-10 -left-10 w-52 sm:w-72 lg:w-88 h-40 sm:h-52 lg:h-64 rounded-tr-[140px] sm:rounded-tr-[180px] lg:rounded-tr-[220px] bg-turquoise-deep -z-10 overflow-hidden shadow-sm"
        >
          {/* Subtle botanical leaf tracery across the teal shape matching reference image */}
          <svg
            viewBox="0 0 240 200"
            fill="none"
            stroke="rgba(248, 243, 234, 0.18)"
            strokeWidth="1.2"
            className="absolute inset-0 size-full"
          >
            <path d="M 0 200 C 30 150, 70 110, 160 50 M 60 140 C 95 115, 130 95, 190 70 M 30 180 C 70 150, 110 130, 160 120 M 90 90 C 80 60, 60 40, 20 20 M 120 60 C 110 35, 80 20, 40 10" />
            <path d="M 40 190 C 70 130, 120 90, 210 40 M 100 120 C 130 90, 170 70, 220 60" strokeWidth="0.8" />
          </svg>
        </div>

        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-14 items-start">
          {/* Left Column: Heading, Description & Google Maps Card */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-px w-6 bg-terracotta" />
              <p className="eyebrow text-xs tracking-[0.22em] text-charcoal">WRITE TO US</p>
            </div>

            <h2
              id="enquiry-title"
              className="mt-5 font-serif text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-normal leading-[1.04] tracking-tight text-turquoise-deep"
            >
              Events, banquets
              <br />
              <em className="italic font-serif font-normal text-terracotta">&amp;</em> questions.
            </h2>

            <p className="mt-5 max-w-md text-sm sm:text-base leading-relaxed text-charcoal/80">
              We also host engagements, weddings, birthdays and party orders, with a banquet hall for larger gatherings. Tell us what
              you have in mind.
            </p>

            {/* Google Maps Card with rounded corners and warm peach/terracotta border */}
            <div className="relative mt-8 sm:mt-10 aspect-[16/10] sm:aspect-[16/11] w-full max-w-md overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-[#e8c8b2] bg-sand shadow-sm">
              <iframe
                title={`Map: ${site.legalName}, ${site.locality}`}
                src={site.mapsEmbedUrl}
                className="absolute inset-0 size-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right Column: Replicated Architectural Form Card */}
          <div className="lg:col-span-7 relative">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
