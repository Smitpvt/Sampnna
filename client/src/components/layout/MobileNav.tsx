"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { navLinks, site } from "@/config/site";
import { Close } from "@/components/ui/Icons";
import { Logo } from "./Logo";

type Props = { open: boolean; onClose: () => void; isActive: (href: string) => boolean };

/** Full-screen mobile navigation with focus trap, Esc to close and scroll lock. */
export function MobileNav({ open, onClose, isActive }: Props) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("a,button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panel.current) return;
      const items = panel.current.querySelectorAll<HTMLElement>("a,button");
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-nav"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[60] flex flex-col bg-charcoal text-ivory lg:hidden"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Mirrors the header: the close control sits exactly where the menu toggle was (centred logo on phones). */}
          <div className="shell flex h-16 items-center gap-4 max-sm:grid max-sm:grid-cols-[2.75rem_1fr_2.75rem] md:h-20">
            <div className="flex max-sm:col-start-2 max-sm:justify-self-center">
              <Logo className="h-9 w-auto" />
            </div>
            <span aria-hidden className="h-7 w-px bg-gold/45 max-sm:hidden" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="inline-flex size-11 items-center justify-center rounded-[10px] transition-colors duration-300 hover:bg-ivory/[0.08] hover:text-sand max-sm:col-start-3 max-sm:justify-self-end"
            >
              <Close className="size-5" />
            </button>
          </div>

          <nav aria-label="Mobile" className="shell flex flex-1 flex-col justify-center">
            <ul className="space-y-2">
              {navLinks.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={l.href}
                    onClick={onClose}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className="group flex items-baseline gap-4 py-2 font-serif text-5xl leading-none aria-[current=page]:text-terracotta"
                  >
                    <span className="eyebrow w-6 text-ivory/40">{String(i + 1).padStart(2, "0")}</span>
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          <div className="shell space-y-5 pb-10">
            <Link href="/contact#reserve" onClick={onClose} className="btn btn-primary w-full">
              Reserve a Table
            </Link>
            <div className="flex items-center justify-between text-sm text-ivory/70">
              <a href={`tel:${site.phone.tel}`} className="py-2">
                {site.phone.display}
              </a>
              <a href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="py-2">
                {site.instagram.handle}
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
