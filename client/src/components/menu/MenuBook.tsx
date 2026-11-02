"use client";

import clsx from "clsx";
import Image from "next/image";
import { type CSSProperties, type PointerEvent as ReactPointerEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { site } from "@/config/site";
import { COURSES } from "@/content/courses";
import { cormorant } from "@/lib/fonts";
import type { CategoryDTO, DishDTO } from "@/types/content";
import { jost } from "./fonts";
import s from "./MenuBook.module.css";
import { buildBook, type Mode, type PageSpec, type Section } from "./paginate";

/** Keep in step with --dur in MenuBook.module.css. */
const TURN_MS = 950;
const WIDE = "(min-width: 1024px)";

type Book = ReturnType<typeof buildBook>;
type Side = "left" | "right";
type Shade = "front" | "back" | "reveal" | null;

const amount = (n: number) => n.toLocaleString("en-IN");

/**
 * The menu as a page-turning book in the style of the printed Sampann menu
 * card: two pages side by side on desktop, one page at a time on phones and
 * tablets. Turn with the arrows, a click or tap on a page, a swipe, or the
 * keyboard (← →). ?course= and ?category= open the book at that section.
 *
 * The visual book is aria-hidden; the full menu is also rendered as a plain
 * list for screen readers and search engines.
 */
export function MenuBook({ categories }: { categories: CategoryDTO[] }) {
  const books = useMemo(
    () => ({ spread: buildBook(categories, "spread"), single: buildBook(categories, "single") }),
    [categories],
  );
  // null until mounted: the server HTML carries both layouts.
  const [view, setView] = useState<{ mode: Mode; start: string | null } | null>(null);
  // Section in view — keeps the reader's place when the layout switches.
  const place = useRef<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const course = COURSES.find((c) => c.slug === params.get("course"));
    const wanted = course ? course.categories.find((slug) => slug in books.spread.firstPage) : params.get("category");
    const start = wanted && wanted in books.spread.firstPage ? wanted : null;

    const mq = window.matchMedia(WIDE);
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setView({ mode: mq.matches ? "spread" : "single", start });
    const update = () => setView({ mode: mq.matches ? "spread" : "single", start: place.current });
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [books]);

  const onPlace = useCallback((slug: string | null) => {
    place.current = slug;
  }, []);

  return (
    <div className={clsx(s.root, jost.variable, cormorant.variable)}>
      <h1 className="sr-only">Sampann menu</h1>
      <div className={s.stage}>
        {view ? (
          <BookView key={view.mode} mode={view.mode} book={books[view.mode]} categories={categories} startSlug={view.start} onPlace={onPlace} />
        ) : (
          <>
            {/* Server HTML / before hydration: both layouts, CSS shows the right one. */}
            <div className={s.wideOnly}>
              <BookView mode="spread" book={books.spread} categories={categories} startSlug={null} onPlace={onPlace} />
            </div>
            <div className={s.narrowOnly}>
              <BookView mode="single" book={books.single} categories={categories} startSlug={null} onPlace={onPlace} />
            </div>
          </>
        )}
      </div>
      <PlainMenu categories={categories} />
    </div>
  );
}

/* ─── The book ──────────────────────────────────────────────────────────── */

function BookView({
  mode,
  book,
  categories,
  startSlug,
  onPlace,
}: {
  mode: Mode;
  book: Book;
  categories: CategoryDTO[];
  startSlug: string | null;
  onPlace: (slug: string | null) => void;
}) {
  const { pages, firstPage } = book;
  const spread = mode === "spread";

  // Spread: page slots in pairs, an empty slot before the cover (it sits alone
  // on the right) and, if needed, after the last page.
  const slots = useMemo<(PageSpec | null)[]>(() => {
    if (!spread) return pages;
    const a: (PageSpec | null)[] = [null, ...pages];
    if (a.length % 2) a.push(null);
    return a;
  }, [pages, spread]);
  const count = spread ? slots.length / 2 : slots.length;
  const posOf = (pageIndex: number) => (spread ? Math.floor((pageIndex + 1) / 2) : pageIndex);
  const indexPage = pages.findIndex((p) => p.kind === "index");

  const [pos, setPos] = useState(() => (startSlug && startSlug in firstPage ? posOf(firstPage[startSlug]) : 0));
  const [flip, setFlip] = useState<{ to: number } | null>(null);

  const go = (to: number) => {
    const target = Math.max(0, Math.min(count - 1, to));
    if (flip || target === pos) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPos(target);
      return;
    }
    setFlip({ to: target });
  };
  const goPage = (pageIndex: number) => go(posOf(pageIndex));

  useEffect(() => {
    if (!flip) return;
    const t = window.setTimeout(() => {
      setPos(flip.to);
      setFlip(null);
    }, TURN_MS);
    return () => window.clearTimeout(t);
  }, [flip]);

  // Keyboard: ← → turn the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "SELECT" || el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      if (e.key === "ArrowRight") go(pos + 1);
      else if (e.key === "ArrowLeft") go(pos - 1);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Swipe to turn (and ignore the click that follows a swipe).
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const onPointerDown = (e: ReactPointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY };
    swiped.current = false;
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      swiped.current = true;
      go(pos + (dx < 0 ? 1 : -1));
    }
  };
  const tap = (fn: () => void) => () => {
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    fn();
  };

  const numberOf = (p: PageSpec | null) => (p ? pages.indexOf(p) + 1 : 0);

  // What is open now (for the section picker, the counter and onPlace).
  const target = flip ? flip.to : pos;
  const visible = (spread ? [slots[2 * target], slots[2 * target + 1]] : [slots[target]]).filter(Boolean) as PageSpec[];
  const visibleSlug = (() => {
    for (const p of visible) if (p.kind === "menu") return p.sections[0].slug;
    if (visible.some((p) => p.kind === "index")) return "__contents";
    return "";
  })();
  useEffect(() => {
    onPlace(visibleSlug.startsWith("__") || !visibleSlug ? null : visibleSlug);
  }, [visibleSlug, onPlace]);

  const counter = (() => {
    const nums = visible.map(numberOf);
    if (visible.length === 1 && visible[0].kind === "cover") return "Cover";
    return `${nums.join(" – ")} / ${pages.length}`;
  })();

  const pageProps = { mode, numberOf, onJump: goPage };

  /* ── Layout ── */
  let content: React.ReactNode;
  if (spread) {
    const L = (p: number) => slots[2 * p] ?? null;
    const R = (p: number) => slots[2 * p + 1] ?? null;
    const dir = flip ? (flip.to > pos ? 1 : -1) : 0;
    const underL = dir === -1 ? L(target) : L(pos);
    const underR = dir === 1 ? R(target) : R(pos);
    const shift = !L(target) ? "-25%" : !R(target) ? "25%" : "0%";

    // Paper still to come on each side — drawn as a few stacked edges.
    const leftCount = slots.slice(0, 2 * target).filter(Boolean).length;
    const rightCount = slots.slice(2 * target + 2).filter(Boolean).length;

    content = (
      <div className={s.book} style={{ transform: `translateX(${shift})` }} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <div className={clsx(s.slot, s.slotLeft)} onClick={tap(() => go(pos - 1))}>
          {underL && <Edges side="left" count={leftCount} />}
          {underL && <PageView spec={underL} side="left" shade={dir === -1 ? "reveal" : null} {...pageProps} />}
        </div>
        <div className={clsx(s.slot, s.slotRight)} onClick={tap(() => go(pos + 1))}>
          {underR && <Edges side="right" count={rightCount} />}
          {underR && <PageView spec={underR} side="right" shade={dir === 1 ? "reveal" : null} {...pageProps} />}
        </div>
        {flip && dir === 1 && (
          <div className={clsx(s.leaf, s.leafNext)}>
            <div className={s.face}>{R(pos) && <PageView spec={R(pos)!} side="right" shade="front" {...pageProps} />}</div>
            <div className={clsx(s.face, s.faceBack)}>{L(target) && <PageView spec={L(target)!} side="left" shade="back" {...pageProps} />}</div>
          </div>
        )}
        {flip && dir === -1 && (
          <div className={clsx(s.leaf, s.leafPrev)}>
            <div className={s.face}>{L(pos) && <PageView spec={L(pos)!} side="left" shade="front" {...pageProps} />}</div>
            <div className={clsx(s.face, s.faceBack)}>{R(target) && <PageView spec={R(target)!} side="right" shade="back" {...pageProps} />}</div>
          </div>
        )}
      </div>
    );
  } else {
    const dir = flip ? (flip.to > pos ? 1 : -1) : 0;
    const under = dir === 1 ? slots[target]! : slots[pos]!;
    const leafPage = dir === 1 ? slots[pos]! : dir === -1 ? slots[target]! : null;
    const tapPage = (e: React.MouseEvent<HTMLDivElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      go(pos + (e.clientX - r.left < r.width * 0.35 ? -1 : 1));
    };
    content = (
      <div className={s.book} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <div
          className={s.slot}
          onClick={(e) => {
            if (swiped.current) {
              swiped.current = false;
              return;
            }
            tapPage(e);
          }}
        >
          <Edges side="right" count={slots.length - 1 - target} />
          <PageView spec={under} side="right" shade={dir === 1 ? "reveal" : null} {...pageProps} />
        </div>
        {leafPage && (
          <div className={clsx(s.leaf, dir === 1 ? s.leafNext : s.leafPrev)}>
            <div className={s.face}>
              <PageView spec={leafPage} side="right" shade={dir === 1 ? "front" : null} {...pageProps} />
            </div>
            <div className={clsx(s.face, s.faceBack)}>
              <BlankBack />
            </div>
          </div>
        )}
      </div>
    );
  }

  const atStart = target === 0;
  const atEnd = target === count - 1;

  return (
    <div className={clsx(spread ? s.spread : s.single)} style={{ display: "contents" }}>
      <div aria-hidden="true">{content}</div>

      <div className={s.controls}>
        <button type="button" className={s.arrow} onClick={() => go(pos - 1)} disabled={atStart} aria-label="Previous page">
          <Arrow dir="left" />
        </button>
        <div className={s.meta}>
          <label className={s.selectWrap}>
            <span className="sr-only">Go to a section of the menu</span>
            <select
              className={s.select}
              value={visibleSlug || ""}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "__cover") go(0);
                else if (v === "__contents") goPage(indexPage);
                else if (v in firstPage) goPage(firstPage[v]);
                e.target.blur();
              }}
            >
              {!visibleSlug && <option value="">{visible.some((p) => p.kind === "cover") ? "Sampann · Menu" : visible.some((p) => p.kind === "thanks") ? "Thank you" : "Welcome"}</option>}
              <option value="__cover">Cover</option>
              <option value="__contents">Our Menu · Contents</option>
              {categories
                .filter((c) => c.slug in firstPage)
                .map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
            </select>
            <span aria-hidden className={s.chev} />
          </label>
          <p className={s.counter} aria-live="polite">
            {counter}
          </p>
        </div>
        <button type="button" className={s.arrow} onClick={() => go(pos + 1)} disabled={atEnd} aria-label="Next page">
          <Arrow dir="right" />
        </button>
      </div>
      <p className={s.hint} aria-hidden="true">
        {spread ? "Click a page or use ← → to turn" : "Swipe or tap the page to turn"}
      </p>
    </div>
  );
}

function Edges({ side, count }: { side: Side; count: number }) {
  const layers = Math.min(3, Math.ceil(count / 6));
  return (
    <>
      {Array.from({ length: layers }, (_, i) => {
        const n = layers - i; // draw the furthest first
        const dx = (side === "left" ? -1 : 1) * n * 2.5;
        return (
          <div key={n} className={s.edge} style={{ transform: `translate(${dx}px, ${n * 1.5}px)` }}>
            <div className={clsx(s.page, side === "left" ? s.sideLeft : s.sideRight)} style={{ filter: "none" }}>
              <div className={clsx(s.paper, s.paperEdge)} style={{ filter: `brightness(${1 - n * 0.025})` }} />
            </div>
          </div>
        );
      })}
    </>
  );
}

function BlankBack() {
  return (
    <div className={clsx(s.page, s.sideLeft)}>
      <div className={s.paper}>
        <span className={clsx(s.shade, s.shadeBack)} />
      </div>
    </div>
  );
}

/* ─── Pages ─────────────────────────────────────────────────────────────── */

type PageViewProps = {
  spec: PageSpec;
  side: Side;
  shade: Shade;
  mode: Mode;
  numberOf: (p: PageSpec | null) => number;
  onJump: (pageIndex: number) => void;
};

function PageView({ spec, side, shade, mode, numberOf, onJump }: PageViewProps) {
  const shadeEl = shade && <span className={clsx(s.shade, shade === "front" ? s.shadeFront : shade === "back" ? s.shadeBack : s.shadeReveal)} />;
  const green = spec.kind === "cover" || spec.kind === "thanks";

  return (
    <div className={clsx(s.page, side === "left" ? s.sideLeft : s.sideRight)}>
      {green ? (
        <div className={s.paperGreen}>
          <span className={s.goldFrame} />
          {shadeEl}
        </div>
      ) : (
        <div className={s.paper}>{shadeEl}</div>
      )}
      {spec.kind === "cover" && <Cover />}
      {spec.kind === "welcome" && <Welcome />}
      {spec.kind === "index" && <Contents spec={spec} onJump={onJump} />}
      {spec.kind === "menu" && <MenuPage sections={spec.sections} number={numberOf(spec)} mode={mode} />}
      {spec.kind === "thanks" && <Thanks />}
    </div>
  );
}

function Cover() {
  return (
    <div className={s.cover}>
      <Image src="/brand/sampann-logo.png" alt="" width={244} height={60} className={s.coverLogo} unoptimized priority />
      <span className={s.coverRule} />
      <p className={s.coverWord}>MENU</p>
      <p className={s.coverPlace}>CHAUL · ALIBAG</p>
    </div>
  );
}

/** Words from the welcome page of the printed menu. */
function Welcome() {
  return (
    <div className={clsx(s.inner, s.welcome)}>
      <span className={s.inkLogo} role="img" aria-label="Sampann Resort & Restaurant" />
      <p className={s.welcomeTitle}>Welcome to</p>
      <p className={s.welcomeName}>Sampann&rsquo; Resort &amp; Restaurant</p>
      <p className={s.welcomeLead}>
        Indulge in a culinary journey around the world,
        <br />
        right here in Sampann&rsquo; Restaurant!
      </p>
      <span className={s.welcomeRule} />
      <p className={s.welcomeText}>
        Our restaurant brings together the bold flavours and aromas of global cuisines, from spicy Indian flavor to Tandoor temptation, savory
        Oriental stir-fries, authentic Western cuisine, Konkan local cuisine and beyond.
      </p>
      <span className={s.welcomeRule} />
      <p className={s.welcomeText}>
        At Sampann&rsquo; Resort, we are passionate about serving delicious, high quality food that&rsquo;s made with love, care and HACCP
        certified Chef. Our Chefs use only the fresh ingredients &amp; use harmless materials to craft a menu that&rsquo;s as diverse as it is
        delicious.
      </p>
      <span className={s.welcomeRule} />
      <p className={s.welcomeText}>
        Join us for a warm and cozy dining experience, perfect for families, friends, and special occasions with loved ones. Our friendly staff
        are always happy to help you navigate our menu and make recommendations.
      </p>
    </div>
  );
}

function Contents({ spec, onJump }: { spec: Extract<PageSpec, { kind: "index" }>; onJump: (pageIndex: number) => void }) {
  return (
    <div className={s.inner}>
      <div className={s.head}>
        <p className={s.title}>Our Menu</p>
        <span className={s.rule} />
        {spec.continued && <p className={s.cont}>Continued</p>}
      </div>
      <div className={s.indexList} style={{ "--rows": spec.entries.length } as CSSProperties}>
        {spec.entries.map((e) => (
          <button
            key={e.slug}
            type="button"
            tabIndex={-1}
            className={s.indexRow}
            onClick={(ev) => {
              ev.stopPropagation();
              onJump(e.page - 1);
            }}
          >
            <span className={s.indexName}>{e.name}</span>
            <span className={s.indexLeader} />
            <span className={s.indexNo}>{String(e.page).padStart(2, "0")}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MenuPage({ sections, number, mode }: { sections: Section[]; number: number; mode: Mode }) {
  return (
    <div className={s.inner}>
      <div className={s.content}>
        {sections.map((sec) => (
          <section key={`${sec.slug}-${sec.continued}`} className={s.section}>
            <div className={s.head}>
              <p className={s.title}>{sec.name}</p>
              <span className={s.rule} />
              {sec.continued && <p className={s.cont}>Continued</p>}
              {sec.note && <p className={s.note}>{sec.note.replace(/\.$/, "")}</p>}
            </div>
            {sec.layout === "grid" ? (
              <ul className={s.grid}>
                {sec.dishes.map((d) => (
                  <li key={d.id} className={s.gridItem}>
                    <span className={s.name}>{d.name}</span>
                    <Amount dish={d} />
                  </li>
                ))}
              </ul>
            ) : (
              <ul>
                {sec.dishes.map((d) => (
                  <li key={d.id} className={s.item}>
                    <div className={s.row}>
                      <span className={s.name}>{d.name}</span>
                      {d.options.length === 0 && <Amount dish={d} />}
                    </div>
                    {d.description && <p className={s.desc}>{d.description}</p>}
                    {d.options.length > 0 && (
                      <p className={s.opts}>
                        {d.options.map((o) => (
                          <span key={o.label}>
                            <span className={s.optLabel}>{o.label}</span>
                            <span className={s.optPrice}>{o.price != null ? amount(o.price) : o.priceNote}</span>
                          </span>
                        ))}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
      <div className={s.foot}>
        <p className={s.pill}>
          <span>All prices in ₹</span>
          <span className={s.dot} />
          <span>{mode === "spread" ? "Note – 5% GST will be applicable" : "5% GST applicable"}</span>
        </p>
        <p className={s.pageNo}>{String(number).padStart(2, "0")}</p>
      </div>
    </div>
  );
}

function Amount({ dish }: { dish: Pick<DishDTO, "price" | "priceNote"> }) {
  if (dish.price != null) return <span className={s.price}>{amount(dish.price)}</span>;
  if (dish.priceNote) return <span className={clsx(s.price, s.priceNote)}>{dish.priceNote}</span>;
  return null;
}

function Thanks() {
  return (
    <div className={s.thanks}>
      <Image src="/brand/sampann-logo.png" alt="" width={244} height={60} className={s.thanksLogo} unoptimized />
      <div className={s.hostBox}>
        <p className={s.hostLabel}>We also host</p>
        <p className={s.hostList}>
          Banquet Hall · Party Order
          <br />
          Engagement · Wedding
          <br />
          Birthday, etc.
        </p>
      </div>
      <p className={s.thanksTitle}>Thank You</p>
      <p className={s.visit}>VISIT AGAIN</p>
      <div className={s.contactRow}>
        <div>
          <span className={s.contactLabel}>Contact</span>
          <a className={s.contactValue} href={`tel:${site.phone.tel}`} onClick={(e) => e.stopPropagation()}>
            {site.phone.tel.replace(/^\+91/, "")}
          </a>
        </div>
        <div>
          <span className={s.contactLabel}>Address</span>
          <span className={s.contactValue}>{site.locality}</span>
        </div>
        <div>
          <span className={s.contactLabel}>Instagram</span>
          <a className={s.contactValue} href={site.instagram.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
            {site.instagram.handle}
          </a>
        </div>
      </div>
    </div>
  );
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      {dir === "left" ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
    </svg>
  );
}

/* ─── Plain menu for screen readers and search engines ─────────────────── */

function PlainMenu({ categories }: { categories: CategoryDTO[] }) {
  const price = (d: DishDTO) =>
    d.options.length
      ? d.options.map((o) => `${o.label} ₹${o.price != null ? amount(o.price) : o.priceNote}`).join(", ")
      : d.price != null
        ? `₹${amount(d.price)}`
        : (d.priceNote ?? "");
  return (
    <div className="sr-only">
      <p>{site.gstNote}</p>
      {categories.map((c) => (
        <section key={c.slug} id={c.slug}>
          <h2>{c.name}</h2>
          <ul>
            {c.dishes.map((d) => (
              <li key={d.id}>
                {d.name} — {price(d)}
                {d.description ? `. ${d.description}` : ""}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
