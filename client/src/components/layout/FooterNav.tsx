"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/config/site";

/**
 * Order the four non-current links fill the arrangement in: the first two go
 * on the left, the last two on the right. With Home current this reads
 * Gallery, About | Menu, Contact; whichever page is current drops out and the
 * rest close up (e.g. on Gallery: About, Home | Menu, Contact).
 */
const ORDER = ["/gallery", "/about", "/", "/menu", "/contact"];

const linkCls = "font-serif font-light tracking-[-0.01em] block text-[1.5rem] leading-[1.3] transition-colors hover:text-sand lg:text-[1.6rem]";

/** The route a pathname belongs to: an exact match, or the longest link it sits under ("/" only matches itself). */
function currentHref(pathname: string) {
  const match = navLinks
    .filter((l) => pathname === l.href || (l.href !== "/" && pathname.startsWith(`${l.href}/`)))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.href ?? "/";
}

/**
 * Footer "Explore" links: two on the left, two on the right, and the page
 * the visitor is on at the bottom centre, marked with a fine terracotta
 * underline. The current page is never listed twice.
 */
export function FooterNav() {
  const pathname = usePathname() ?? "/";
  const active = currentHref(pathname);
  const byHref = new Map(navLinks.map((l) => [l.href as string, l]));
  const current = byHref.get(active) ?? navLinks[0];
  const others = ORDER.filter((href) => href !== current.href)
    .map((href) => byHref.get(href))
    .filter((l): l is (typeof navLinks)[number] => Boolean(l));
  // Row by row: [left 1, right 1], [left 2, right 2] — so each pair shares a grid row and lines up exactly.
  const [l1, l2, r1, r2] = others;
  const sides = [l1, r1, l2, r2].filter(Boolean);

  return (
    // The group is only as wide as its two equal columns, and is centred under the heading.
    <ul className="mx-auto mt-5 grid w-fit grid-cols-2 gap-x-10 gap-y-1 text-left sm:gap-x-14">
      {sides.map((l) => (
        <li key={l.href}>
          <Link href={l.href} className={linkCls}>
            {l.label}
          </Link>
        </li>
      ))}
      {/* Spans both columns and centres on the whole group, not on either column. */}
      <li className="col-span-2 mt-2 justify-self-center">
        <Link href={current.href} aria-current="page" className={clsx(linkCls, "border-b border-terracotta/70 pb-0.5")}>
          {current.label}
        </Link>
      </li>
    </ul>
  );
}
