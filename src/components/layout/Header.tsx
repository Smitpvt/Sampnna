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
      {overlay && <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/55 to-transparent" />}
      <div className={clsx("shell flex items-center justify-between gap-6 transition-[height] duration-500", scrolled ? "h-16" : "h-20 md:h-24")}>
        <Logo priority className={clsx("w-auto transition-[height] duration-500", scrolled ? "h-8" : "h-9 md:h-11")} />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-9 text-[0.8rem] font-semibold uppercase tracking-[0.16em]">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} aria-current={isActive(l.href) ? "page" : undefined} className="link-reveal py-2">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/contact#reserve" className={clsx("btn hidden sm:inline-flex", overlay ? "btn-light" : "btn-primary")}>
            Reserve a Table
          </Link>
          <button
            type="button"
            className="-mr-2 inline-flex size-12 items-center justify-center lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden className="relative block h-3 w-7">
              <span className={clsx("absolute left-0 top-0 h-px w-full bg-current transition-transform duration-300", open && "translate-y-1.5 rotate-45")} />
              <span className={clsx("absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-300", open && "-translate-y-1.5 -rotate-45")} />
            </span>
          </button>
        </div>
      </div>
      <MobileNav open={open} onClose={() => setOpen(false)} isActive={isActive} />
    </header>
  );
}
