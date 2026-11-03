import clsx from "clsx";
import { site } from "@/config/site";
import { FooterNav } from "./FooterNav";
import { Logo } from "./Logo";

/** The site's own serif (the global heading font) — the footer loads no other typeface. */
const serif = "font-serif font-light tracking-[-0.01em]";

/** Column headings: same style everywhere, so all three sit on one line. */
const heading = "eyebrow text-[0.66rem] text-ivory/55";

/**
 * One inner container for the whole footer — the three columns and the
 * copyright strip share it, so they start and end on the same vertical lines
 * inside the arch. Its side padding follows the arch's inset (--inset).
 */
const inner = "mx-auto w-full px-8 sm:px-14 md:px-[calc(var(--inset)+2.5rem)] lg:px-[calc(var(--inset)+3.5rem)] xl:px-[calc(var(--inset)+5rem)]";

/** Google Maps embed for Sampann' Resort & Restaurant, exactly as supplied by the restaurant. */
const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.9375686330836!2d72.92233027491902!3d18.576853167453145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be86f9f2f618c85%3A0x3f9927ad9272f844!2sSampann%27%20Resort%20%26%20Restaurant!5e0!3m2!1sen!2sin!4v1793477645527!5m2!1sen!2sin";

/** The same Google Maps listing as the embed (its place id 0x3f9927ad9272f844, as a cid), where "Directions" is one tap away. */
const DIRECTIONS_URL = "https://www.google.com/maps?cid=4582737722266024004";

/**
 * Site footer — an architectural doorway. A large double-line arch (CSS
 * borders with elliptical top corners) frames the content; its top passes
 * behind the centred logo, so the lines stop and resume either side, and two
 * small turquoise diamonds mark where the curve meets the straight sides. A
 * fine rule drops from the logo towards the columns.
 *
 * Layout: logo → one three-column grid (Follow 30% · Explore 22% · Visit 48%,
 * headings on one line, content starting on one line) → a three-part
 * copyright strip on the same inner container. Tablets put Follow and Explore
 * side by side with Visit below; phones stack everything, centred.
 *
 * The arch geometry is driven by CSS variables: --top (where the arch's crown
 * sits, level with the logo's centre), --inset (side margin) and --ry
 * (height of the curve).
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-charcoal text-ivory [--inset:clamp(0.75rem,4.5vw,4rem)] [--ry:3rem] [--top:1.5rem] sm:[--ry:5.5rem] sm:[--top:3.5rem] md:[--ry:9rem] md:[--top:3.75rem] lg:[--ry:11.5rem]">
      <div className="relative">
        {/* The doorway: two concentric arches, then the diamonds at the springing points. */}
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-[var(--inset)] right-[var(--inset)] top-[var(--top)] border-x border-t border-ivory/20 [border-top-left-radius:50%_var(--ry)] [border-top-right-radius:50%_var(--ry)]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-[calc(var(--inset)+0.5rem)] right-[calc(var(--inset)+0.5rem)] top-[calc(var(--top)+0.5rem)] border-x border-t border-ivory/10 [border-top-left-radius:50%_calc(var(--ry)-0.5rem)] [border-top-right-radius:50%_calc(var(--ry)-0.5rem)] sm:left-[calc(var(--inset)+1rem)] sm:right-[calc(var(--inset)+1rem)] sm:top-[calc(var(--top)+1rem)] sm:[border-top-left-radius:50%_calc(var(--ry)-1rem)] sm:[border-top-right-radius:50%_calc(var(--ry)-1rem)]"
        />
        <span aria-hidden className="absolute left-[var(--inset)] top-[calc(var(--top)+var(--ry))] size-2 sm:size-2.5 -translate-x-1/2 rotate-45 bg-turquoise" />
        <span aria-hidden className="absolute right-[var(--inset)] top-[calc(var(--top)+var(--ry))] size-2 sm:size-2.5 translate-x-1/2 rotate-45 bg-turquoise" />

        {/* Logo on a charcoal plate, which hides the arch's crown behind it. */}
        <div className="relative z-10 flex flex-col items-center pt-3 sm:pt-8">
          <div className="bg-charcoal px-4 sm:px-10">
            <Logo className="h-8 w-auto sm:h-12 md:h-14" />
          </div>
          <span aria-hidden className="mt-1.5 sm:mt-4 h-4 sm:h-12 w-px bg-ivory/25 md:h-20" />
          <span aria-hidden className="-mt-1 size-1 sm:size-1.5 rotate-45 bg-terracotta" />
        </div>

        {/* Content sections */}
        <div
          className={clsx(
            inner,
            "relative z-10 grid gap-x-10 gap-y-5 sm:gap-y-14 pb-5 sm:pb-14 pt-2.5 sm:pt-8 text-center md:pb-16 md:pt-6 md:text-left",
            // Tablet: Follow | Explore, Visit across the full width below.
            "md:grid-cols-2",
            // Laptop and up: Follow 30% · Explore 22% · Visit 48%.
            "lg:grid-cols-[30fr_22fr_48fr] lg:gap-x-12",
          )}
        >
          {/* 1 — Follow Sampann */}
          <div className="flex flex-col items-center md:items-start">
            <p className={heading}>Follow Sampann</p>
            {/* Mobile: compact side-by-side row; Tablet/Desktop: stacked column */}
            <div className="mt-2.5 sm:mt-5 flex w-full max-w-sm flex-row items-center justify-center gap-4 sm:w-max sm:flex-col sm:items-start sm:gap-0">
              <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-x-2 sm:grid sm:grid-cols-[1.1rem_auto] sm:gap-x-4 text-left">
                <InstagramIcon className="size-3.5 sm:size-[1.1rem] text-turquoise shrink-0" />
                <div className="flex flex-col">
                  <span className={clsx(serif, "text-[1.1rem] sm:text-[1.45rem] leading-tight transition-colors group-hover:text-sand lg:text-[1.6rem]")}>
                    {site.instagram.handle}
                  </span>
                  <span className="eyebrow text-[0.52rem] sm:text-[0.6rem] text-ivory/45">Instagram</span>
                </div>
              </a>

              <span aria-hidden className="hidden sm:my-5 sm:block sm:h-px sm:w-full sm:bg-ivory/15" />
              <span aria-hidden className="h-6 w-px bg-ivory/15 sm:hidden" />

              <a href={`tel:${site.phone.tel}`} className="group flex items-center gap-x-2 sm:grid sm:grid-cols-[1.1rem_auto] sm:gap-x-4 text-left">
                <PhoneIcon className="size-3.5 sm:size-[1.1rem] text-turquoise shrink-0" />
                <div className="flex flex-col">
                  <span className={clsx(serif, "whitespace-nowrap text-[1.1rem] sm:text-[1.45rem] leading-tight transition-colors group-hover:text-sand lg:text-[1.6rem]")}>
                    {site.phone.display}
                  </span>
                  <span className="eyebrow text-[0.52rem] sm:text-[0.6rem] text-ivory/45">Call</span>
                </div>
              </a>
            </div>
          </div>

          {/* 2 — Explore, centred in its column */}
          <nav aria-label="Footer" className="flex flex-col items-center lg:-translate-x-[clamp(2.5rem,3.5vw,3.75rem)]">
            <h2 className={heading}>Explore</h2>
            {/* Two links either side, the current page at the bottom centre. */}
            <FooterNav />
          </nav>

          {/* 3 — Visit Sampann: details and map as one group, side by side from tablet up */}
          <div className="flex flex-col items-center md:col-span-2 md:items-start lg:col-span-1">
            <p className={heading}>Visit Sampann</p>
            <div className="mt-2.5 sm:mt-5 grid w-full justify-items-center gap-3 sm:gap-6 sm:grid-cols-[auto_minmax(9rem,17rem)] sm:items-stretch sm:justify-items-start sm:gap-x-7">
              <address className="flex flex-col items-center not-italic sm:items-start sm:text-left">
                <p className={clsx(serif, "text-[1.15rem] sm:text-[1.4rem] leading-[1.15] lg:text-[1.5rem]")}>
                  Sampann Resort &amp; Restaurant
                </p>
                <p className="mt-1 text-[0.78rem] sm:text-sm leading-snug sm:leading-relaxed text-ivory/70">
                  {site.locality}, {site.region}
                </p>
                <a
                  href={DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eyebrow mt-2 sm:mt-5 inline-flex items-center gap-1.5 sm:gap-2 border-b border-terracotta pb-0.5 sm:pb-1 text-[0.58rem] sm:text-[0.66rem] text-ivory transition-colors hover:text-sand"
                >
                  Get directions <span aria-hidden>↗</span>
                </a>
              </address>
              <div className="w-full max-w-[15rem] overflow-hidden rounded-[5px] sm:rounded-[8px] border border-ivory/20 bg-[#2f2e2a] sm:max-w-none">
                <iframe
                  src={MAP_EMBED_URL}
                  title="Map showing Sampann Resort & Restaurant, Chaul, Alibag"
                  className="block h-20 sm:h-40 w-full border-0 sm:min-h-[9rem]"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright strip — the same inner container, three cells on one centre line. */}
      <div className="relative border-t border-ivory/15">
        <div className={clsx(inner, "grid items-center gap-1 sm:gap-3 py-2.5 sm:py-6 text-center text-[0.65rem] sm:text-xs text-ivory/55 md:grid-cols-3")}>
          <p className="md:text-left">
            © {year} {site.legalName}. All rights reserved.
          </p>
          <p className="flex items-center justify-center gap-2 sm:gap-3">
            <span aria-hidden className="size-1 rotate-45 bg-turquoise" />
            <span className={clsx(serif, "text-[0.82rem] sm:text-[0.95rem] italic leading-none text-ivory/70")}>Chaul · Alibaug</span>
            <span aria-hidden className="size-1 rotate-45 bg-turquoise" />
          </p>
          <p className="md:text-right">{site.gstNote}</p>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 3.5h3l1.5 4-2 1.3a10 10 0 0 0 5.2 5.2l1.3-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />
    </svg>
  );
}
