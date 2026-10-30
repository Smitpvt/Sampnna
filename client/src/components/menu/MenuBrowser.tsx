"use client";

import clsx from "clsx";
import Image from "next/image";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { Search } from "@/components/ui/Icons";
import { COURSES, type Course } from "@/content/courses";
import type { CategoryDTO } from "@/types/content";
import { DishRow } from "./DishRow";

const COLLECTIONS = [{ tag: "seafood", label: "Seafood specials" }] as const;

const normalise = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/** Keep shareable state (?q, ?collection, ?course, ?category) in the URL without a server round trip. */
function syncUrl(params: Record<string, string | null>) {
  const url = new URL(window.location.href);
  for (const [k, v] of Object.entries(params)) {
    if (v) url.searchParams.set(k, v);
    else url.searchParams.delete(k);
  }
  window.history.replaceState(window.history.state, "", url);
}

/**
 * Full menu with search, collection and course filters (?course= narrows the
 * menu to one homepage course — its printed sections only), and chapter navigation. The whole
 * menu is server-rendered; URL parameters are applied after mount so the page
 * stays static and every dish is in the initial HTML.
 */
export function MenuBrowser({ categories }: { categories: CategoryDTO[] }) {
  const [query, setQuery] = useState("");
  const [collection, setCollection] = useState<string | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(categories[0]?.slug);
  const deferred = useDeferredValue(query.trim());
  const navStrip = useRef<HTMLUListElement>(null);

  const visible = useMemo(() => {
    const q = normalise(deferred);
    // A course shows just its sections, in the course's own order.
    const sections = course
      ? course.categories.map((slug) => categories.find((c) => c.slug === slug)).filter((c): c is CategoryDTO => Boolean(c))
      : categories;
    return sections
      .map((c) => ({
        ...c,
        dishes: c.dishes.filter(
          (d) =>
            (!collection || d.tags.includes(collection)) &&
            (q.length < 2 || normalise(d.name).includes(q) || normalise(d.description ?? "").includes(q)),
        ),
      }))
      .filter((c) => c.dishes.length > 0);
  }, [categories, deferred, collection, course]);

  const total = visible.reduce((n, c) => n + c.dishes.length, 0);
  const filtering = deferred.length >= 2 || Boolean(collection);
  const clearAll = () => {
    setQuery("");
    setCollection(null);
    setCourse(null);
  };

  // Apply ?q, ?collection and ?category once on mount. Reading the URL here
  // (not during render) keeps the server HTML identical to the first client render.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const c = params.get("collection");
    if (q) setQuery(q.slice(0, 60));
    if (COLLECTIONS.some((x) => x.tag === c)) setCollection(c);
    const picked = COURSES.find((x) => x.slug === params.get("course")) ?? null;
    setCourse(picked);
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    const slug = params.get("category");
    if (!picked && slug && /^[a-z0-9-]+$/.test(slug)) {
      requestAnimationFrame(() => document.getElementById(slug)?.scrollIntoView({ block: "start" }));
    }
  }, []);

  useEffect(() => {
    if (ready) syncUrl({ q: deferred.length >= 2 ? deferred : null, collection, course: course?.slug ?? null });
  }, [deferred, collection, course, ready]);

  // Track the chapter currently in view for the navigation highlight.
  useEffect(() => {
    const sections = visible.map((c) => document.getElementById(c.slug)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const top = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top) setActive(top.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [visible]);

  // Keep the active item visible in the mobile strip.
  useEffect(() => {
    const strip = navStrip.current;
    const item = strip?.querySelector<HTMLElement>(`[data-slug="${active}"]`);
    if (strip && item) strip.scrollTo({ left: item.offsetLeft - 20, behavior: "smooth" });
  }, [active]);

  const jump = (slug: string) => {
    syncUrl({ category: slug });
    document.getElementById(slug)?.scrollIntoView({ block: "start" });
    setActive(slug);
  };

  return (
    <div className="shell pb-24 lg:grid lg:grid-cols-12 lg:gap-12">
      {/* Toolbar: sticky under the header on all sizes */}
      <div className="sticky top-16 z-30 -mx-5 bg-ivory/95 px-5 pb-3 pt-4 backdrop-blur md:-mx-10 md:px-10 lg:col-span-12 lg:mx-0 lg:px-0">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <label className="relative flex w-full items-center md:max-w-sm">
            <span className="sr-only">Search dishes</span>
            <Search className="pointer-events-none absolute left-0 size-4 text-ink-soft" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes — e.g. paneer, prawns, dosa"
              className="field pl-7"
              autoComplete="off"
              maxLength={60}
            />
          </label>
          <div className="flex flex-wrap items-center gap-x-5 text-sm">
            {course && (
              <button
                type="button"
                onClick={() => {
                  setCourse(null);
                  window.scrollTo({ top: 0 });
                }}
                aria-label={`Showing ${course.name} — show the full menu`}
                className="eyebrow inline-flex min-h-11 items-center gap-2 border-b border-turquoise-deep py-2 text-turquoise-deep"
              >
                {course.name}
                <span aria-hidden className="text-base leading-none">×</span>
              </button>
            )}
            {COLLECTIONS.map((c) => (
              <button
                key={c.tag}
                type="button"
                aria-pressed={collection === c.tag}
                onClick={() => setCollection((v) => (v === c.tag ? null : c.tag))}
                className={clsx(
                  "eyebrow inline-flex min-h-11 items-center gap-2 border-b py-2 transition-colors",
                  collection === c.tag ? "border-turquoise-deep text-turquoise-deep" : "border-transparent text-ink-soft hover:text-charcoal",
                )}
              >
                <span aria-hidden className={clsx("size-2 border border-current", collection === c.tag && "bg-current")} />
                {c.label}
              </button>
            ))}
            <p className="eyebrow text-ink-soft" aria-live="polite">
              {total} {total === 1 ? "dish" : "dishes"}
            </p>
          </div>
        </div>

        {/* Mobile / tablet chapter strip */}
        <nav aria-label="Menu sections" className="mt-3 lg:hidden">
          <ul ref={navStrip} className="no-scrollbar -mx-5 flex gap-6 overflow-x-auto px-5 md:-mx-10 md:px-10">
            {visible.map((c) => (
              <li key={c.slug} data-slug={c.slug} className="shrink-0">
                <a
                  href={`#${c.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    jump(c.slug);
                  }}
                  aria-current={active === c.slug ? "true" : undefined}
                  className="eyebrow inline-flex min-h-11 items-center whitespace-nowrap border-b-2 border-transparent text-[0.68rem] text-ink-soft aria-[current=true]:border-terracotta aria-[current=true]:text-charcoal"
                >
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Desktop chapter index */}
      <nav aria-label="Menu sections" className="hidden lg:col-span-3 lg:block">
        <ol className="sticky top-44 max-h-[calc(100vh-12rem)] space-y-1 overflow-y-auto pr-4">
          {visible.map((c, i) => (
            <li key={c.slug}>
              <a
                href={`#${c.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  jump(c.slug);
                }}
                aria-current={active === c.slug ? "true" : undefined}
                className="group flex items-baseline gap-3 py-1.5 text-ink-soft transition-colors hover:text-charcoal aria-[current=true]:text-terracotta-deep"
              >
                <span className="eyebrow w-6 text-[0.6rem] tabular-nums opacity-60">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-serif text-lg leading-tight">{c.name}</span>
                <span className="ml-auto text-xs tabular-nums opacity-50">{c.dishes.length}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="lg:col-span-9">
        {visible.length === 0 ? (
          <div role="status" className="py-24 text-center">
            <p className="font-serif text-3xl">Nothing on the menu matches “{deferred}”.</p>
            <p className="mt-3 text-ink-soft">Try a different word, or browse every section.</p>
            <button
              type="button"
              className="btn btn-dark mt-8"
              onClick={clearAll}
            >
              Clear search
            </button>
          </div>
        ) : (
          visible.map((c, i) => (
            <section key={c.slug} id={c.slug} aria-labelledby={`${c.slug}-title`} className="scroll-mt-48 border-t border-charcoal/15 pt-10 pb-6 first:border-t-0 lg:scroll-mt-40">
              <header className={clsx("grid gap-6", c.image && !filtering && "md:grid-cols-[1fr_auto] md:items-end")}>
                <div>
                  <p className="eyebrow text-[0.65rem] tabular-nums text-terracotta">{String(i + 1).padStart(2, "0")}</p>
                  <h2 id={`${c.slug}-title`} className="mt-2 text-title">
                    {c.name}
                  </h2>
                  {c.description && <p className="mt-2 max-w-lg text-ink-soft">{c.description}</p>}
                </div>
                {c.image && !filtering && (
                  <div className="relative hidden aspect-[16/9] w-64 overflow-hidden md:block">
                    <Image
                      src={c.image.src}
                      alt={c.image.alt}
                      fill
                      sizes="256px"
                      placeholder={c.image.blurDataUrl ? "blur" : "empty"}
                      blurDataURL={c.image.blurDataUrl}
                      className="object-cover"
                    />
                  </div>
                )}
              </header>
              <ul className="mt-4 grid divide-y divide-charcoal/10 xl:grid-cols-2 xl:gap-x-12 xl:divide-y-0 [&>li]:border-charcoal/10 xl:[&>li]:border-b">
                {c.dishes.map((d) => (
                  <DishRow key={d.id} dish={d} highlight={deferred} />
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
