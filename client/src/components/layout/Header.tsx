"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks } from "@/config/site";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";

/** Routes whose first section is a dark image, so the header starts transparent. */
const OVERLAY_ROUTES = new Set(["/", "/about", "/gallery", "/contact"]);

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes (incl. back/forward).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const overlay = OVERLAY_ROUTES.has(pathname) && !scrolled;
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow,backdrop-filter] duration-500 ease-out-soft",
        overlay ? "bg-transparent text-ivory" : "bg-ivory/90 text-charcoal shadow-[0_1px_0_rgba(39,38,34,0.08)] backdrop-blur-md",
      )}
    >
      {overlay && <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/60 to-transparent" />}
      {/* Three columns on desktop so the navigation sits on the true centre line, whatever the logo/button widths. */}
      <div
        className={clsx(
          // Phones: equal side columns (toggle width) so the logo sits on the true centre line.
          "shell grid grid-cols-[auto_1fr] items-center gap-4 transition-[height] duration-500 max-sm:grid-cols-[2.75rem_1fr_2.75rem] lg:grid-cols-[1fr_auto_1fr] lg:gap-8",
          scrolled ? "h-16 lg:h-[4.5rem]" : "h-16 md:h-20 lg:h-24",
        )}
      >
        {/* Below lg the menu toggle sits beside the logo as one unit, separated by a fine gold rule. */}
        {/* On phones this group dissolves (display: contents) so logo and toggle land in the centre and right columns. */}
        <div className="flex items-center gap-4 max-sm:contents">
          <div className="flex max-sm:col-start-2 max-sm:justify-self-center">
            {/* Native asset is 244×60; kept at or near that height so it stays crisp. */}
            <Logo priority className={clsx("w-auto transition-[height] duration-500", scrolled ? "h-8 lg:h-9" : "h-9 lg:h-11")} />
          </div>
          <span aria-hidden className="h-7 w-px bg-gold/45 max-sm:hidden lg:hidden" />
          <div className="flex max-sm:col-start-3 max-sm:justify-self-end lg:hidden">
            <MenuToggle open={open} onToggle={() => setOpen((v) => !v)} />
          </div>
        </div>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-9 text-[0.74rem] font-semibold uppercase tracking-[0.2em] xl:gap-11">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={clsx(
                    "relative inline-block py-2 transition-colors duration-300",
                    "after:absolute after:inset-x-0 after:bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:ease-out-soft",
                    "hover:after:scale-x-100 aria-[current=page]:after:scale-x-100 aria-[current=page]:after:bg-gold",
                    overlay
                      ? "text-ivory/75 hover:text-ivory aria-[current=page]:text-ivory"
                      : "text-charcoal/65 hover:text-charcoal aria-[current=page]:text-charcoal",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Phones rely on the hero's own reservation CTA; from sm up the header carries one too. */}
        <Link
          href="/contact#reserve"
          className={clsx(
            "btn hidden min-h-11 justify-self-end rounded-[10px] px-6 sm:inline-flex",
            overlay
              ? "border border-gold/60 bg-charcoal/15 text-ivory hover:border-gold hover:bg-gold hover:text-charcoal"
              : "btn-primary",
          )}
        >
          Reserve a Table
        </Link>
      </div>
      <MobileNav open={open} onClose={() => setOpen(false)} isActive={isActive} />
    </header>
  );
}

/**
 * Editorial menu mark: a full stroke over a shorter gold one, like a menu
 * heading and its rule. On hover/focus the gold stroke extends to full length.
 */
function MenuToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className="group inline-flex size-11 items-center justify-center rounded-[10px] transition-colors duration-300 hover:bg-current/[0.08] focus-visible:bg-current/[0.08] lg:hidden"
      aria-expanded={open}
      aria-controls="mobile-nav"
      aria-label={open ? "Close menu" : "Open menu"}
      onClick={onToggle}
    >
      <span aria-hidden className="flex w-[1.625rem] flex-col items-start gap-[7px]">
        <span className="h-[2px] w-full rounded-full bg-current" />
        <span className="h-[2px] w-4 rounded-full bg-gold transition-[width] duration-500 ease-out-soft group-hover:w-full group-focus-visible:w-full" />
      </span>
    </button>
  );
}
