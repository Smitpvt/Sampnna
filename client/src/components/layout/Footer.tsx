import Link from "next/link";
import { navLinks, site } from "@/config/site";
import { ArrowRight } from "@/components/ui/Icons";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative bg-charcoal text-ivory">
      <div className="shell grid gap-14 pb-10 pt-20 md:grid-cols-12 md:pt-28">
        <div className="md:col-span-5">
          <Logo className="h-12 w-auto" />
          <p className="mt-8 max-w-sm font-serif text-2xl leading-snug text-ivory/90">
            An abundant table in Chaul — Indian, Konkan, Oriental and Continental, cooked to share.
          </p>
          <Link href="/contact#reserve" className="btn btn-primary mt-10">
            Reserve a Table <ArrowRight />
          </Link>
        </div>

        <nav aria-label="Footer" className="md:col-span-2">
          <h2 className="eyebrow text-ivory/50">Explore</h2>
          <ul className="mt-5 space-y-3">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-reveal">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <h2 className="eyebrow text-ivory/50">Visit</h2>
          <address className="mt-5 space-y-3 not-italic">
            <p>
              {site.legalName}
              <br />
              {site.locality}, {site.region}
            </p>
            <p>
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="link-line">
                Get directions
              </a>
            </p>
            <p>
              <a href={`tel:${site.phone.tel}`} className="link-reveal">
                {site.phone.display}
              </a>
            </p>
          </address>
          <h2 className="eyebrow mt-8 text-ivory/50">Hours</h2>
          {site.openingHours ? (
            <ul className="mt-3 space-y-1 text-ivory/80">
              {site.openingHours.map((h) => (
                <li key={h.days}>
                  {h.days}: {h.hours}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-ivory/70">Please call ahead for today&apos;s timings.</p>
          )}
        </div>

        <div className="md:col-span-2">
          <h2 className="eyebrow text-ivory/50">Follow</h2>
          <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="link-reveal mt-5 inline-block">
            Instagram {site.instagram.handle}
          </a>
          <h2 className="eyebrow mt-8 text-ivory/50">We also host</h2>
          <p className="mt-3 text-sm leading-relaxed text-ivory/70">{site.events.join(" · ")}</p>
        </div>
      </div>

      <div className="shell flex flex-col gap-3 border-t border-ivory/10 py-6 text-xs text-ivory/50 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {site.legalName}. All rights reserved.
        </p>
        <p>{site.gstNote}</p>
      </div>
    </footer>
  );
}
