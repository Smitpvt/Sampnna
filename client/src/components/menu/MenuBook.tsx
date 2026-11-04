"use client";

import clsx from "clsx";
import Image from "next/image";
import { type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
const pad2 = (n: number) => String(n).padStart(2, "0");

/**
 * The menu as a page-turning book: two pages side by side on desktop, one
 * page at a time on phones and tablets. Turn with the arrows, a click or tap
 * on a page, a swipe, or the keyboard (← →). ?course= and ?category= open the
 * book at that section.
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

  const onCover = visible.length === 1 && visible[0].kind === "cover";
  const counter = onCover ? (spread ? "Open the menu" : "Tap to open") : `${visible.map((p) => pad2(numberOf(p))).join(" – ")} / ${pad2(pages.length)}`;
  const progress = count > 1 ? (target / (count - 1)) * 100 : 0;

  const pageProps = { mode, numberOf, onJump: goPage };

  /* ── Pages ── */
  let content: ReactNode;
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
      <div
        className={clsx(s.book, !L(target) && s.closedRight, !R(target) && s.closedLeft)}
        style={{ transform: `translateX(${shift})` }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {R(target) && <span className={s.ribbon} />}
        <div className={clsx(s.slot, s.slotLeft)} onClick={tap(() => go(pos - 1))}>
          {underL && <Edges side="left" count={leftCount} />}
          {underL && <PageView spec={underL} side="left" shade={dir === -1 ? "reveal" : null} {...pageProps} />}
          {underL && !flip && <span className={s.curl} />}
        </div>
        <div className={clsx(s.slot, s.slotRight)} onClick={tap(() => go(pos + 1))}>
          {underR && <Edges side="right" count={rightCount} />}
          {underR && <PageView spec={underR} side="right" shade={dir === 1 ? "reveal" : null} {...pageProps} />}
          {underR && !flip && underR.kind !== "thanks" && <span className={s.curl} />}
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
    content = (
      <div className={s.book} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <span className={s.ribbon} />
        <div
          className={s.slot}
          onClick={(e) => {
            if (swiped.current) {
              swiped.current = false;
              return;
            }
            const r = e.currentTarget.getBoundingClientRect();
            go(pos + (e.clientX - r.left < r.width * 0.35 ? -1 : 1));
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

  const prev = (
    <button type="button" className={clsx(s.arrow, s.arrowPrev)} onClick={() => go(pos - 1)} disabled={target === 0} aria-label="Previous page">
      <Arrow dir="left" />
    </button>
  );
  const next = (
    <button type="button" className={clsx(s.arrow, s.arrowNext)} onClick={() => go(pos + 1)} disabled={target === count - 1} aria-label="Next page">
      <Arrow dir="right" />
    </button>
  );
  const picker = (
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
        {!visibleSlug && <option value="">{onCover ? "Sampann · Menu" : visible.some((p) => p.kind === "thanks") ? "Thank you" : "Welcome"}</option>}
        <option value="__cover">Cover</option>
        <option value="__contents">Contents</option>
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
  );
  const progressBar = (
    <div className={s.progress} aria-hidden="true">
      <div className={s.progressFill} style={{ width: `${progress}%` }} />
    </div>
  );
  const counterEl = (
    <p className={clsx(onCover ? s.hint : s.counter)} aria-live="polite">
      {counter}
    </p>
  );

  return (
    <div className={clsx(spread ? s.spread : s.single)} style={{ display: "contents" }}>
      <div className={s.bookArea}>
        <div aria-hidden="true">{content}</div>
        {spread && prev}
        {spread && next}
      </div>

      {spread ? (
        <div className={s.bar}>
          {picker}
          {progressBar}
          {counterEl}
        </div>
      ) : (
        <>
          <div className={s.bar}>
            {prev}
            {picker}
            {next}
          </div>
          <div className={s.subBar}>
            {progressBar}
            {counterEl}
          </div>
        </>
      )}
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
        return <div key={n} className={s.edge} style={{ transform: `translate(${dx}px, ${n * 1.5}px)`, filter: `brightness(${1 - n * 0.03})` }} />;
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

/* ─── Ornaments ─────────────────────────────────────────────────────────── */

function Ornament({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 170 14" fill="none" aria-hidden>
      <path d="M0 7h66M104 7h66" stroke="currentColor" strokeWidth="0.8" />
      <path d="M72 7l6-4 7 4-7 4z M98 7l-6-4-7 4 7 4z" fill="currentColor" opacity="0.55" />
      <path d="M85 1l6 6-6 6-6-6z" fill="currentColor" />
      <circle cx="62" cy="7" r="1.4" fill="currentColor" />
      <circle cx="108" cy="7" r="1.4" fill="currentColor" />
    </svg>
  );
}

function CoverOrnament({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 12" fill="none" aria-hidden>
      <line x1="8" y1="6" x2="43" y2="6" stroke="currentColor" strokeWidth="0.8" />
      <line x1="57" y1="6" x2="92" y2="6" stroke="currentColor" strokeWidth="0.8" />
      <path d="M50 2l4 4-4 4-4-4z" fill="#b96349" stroke="currentColor" strokeWidth="0.6" />
    </svg>
  );
}

/** Art-deco corner clasp, drawn for the top-left corner (mirrored in CSS). */
function Corner({ className }: { className: string }) {
  return (
    <svg className={clsx(s.corner, className)} viewBox="0 0 40 40" fill="none" aria-hidden>
      <path d="M2 26V12C2 6.5 6.5 2 12 2h14" stroke="currentColor" strokeWidth="1" />
      <path d="M6.5 22V13c0-3.6 2.9-6.5 6.5-6.5h9" stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
      <path className={s.cornerDiamond} d="M12 8.5l3.5 3.5-3.5 3.5-3.5-3.5z" fill="currentColor" />
    </svg>
  );
}

function Corners() {
  return (
    <>
      <Corner className={s.cTL} />
      <Corner className={s.cTR} />
      <Corner className={s.cBL} />
      <Corner className={s.cBR} />
    </>
  );
}

function ArchLine() {
  return (
    <svg className={s.archLine} viewBox="0 -6 100 152" fill="none" aria-hidden>
      <path d="M1 146V50a49 49 0 0 1 98 0v96" stroke="currentColor" strokeWidth="0.45" />
      <path d="M5 146V51a45 45 0 0 1 90 0v95" stroke="currentColor" strokeWidth="0.25" opacity="0.55" />
      <path className={s.archDiamond} d="M50 -4.5l4.5 4.5-4.5 4.5-4.5-4.5z" fill="currentColor" />
    </svg>
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
  const leather = spec.kind === "cover" || spec.kind === "thanks";

  return (
    <div className={clsx(s.page, side === "left" ? s.sideLeft : s.sideRight)}>
      {leather ? (
        <div className={s.leather}>
          {spec.kind === "cover" && <span className={s.spineBand} />}
          <span className={clsx(s.leatherFrame, spec.kind === "cover" && s.coverFrame)}>
            <Corners />
          </span>
          {shadeEl}
        </div>
      ) : (
        <div className={s.paper}>
          {spec.kind !== "welcome" && (
            <span className={s.frame}>
              <Corners />
            </span>
          )}
          {shadeEl}
        </div>
      )}
      {spec.kind === "cover" && <Cover />}
      {spec.kind === "welcome" && <Welcome />}
      {spec.kind === "index" && <Contents spec={spec} number={numberOf(spec)} onJump={onJump} />}
      {spec.kind === "menu" && <MenuPage sections={spec.sections} number={numberOf(spec)} mode={mode} />}
      {spec.kind === "thanks" && <Thanks />}
    </div>
  );
}

function Cover() {
  return (
    <div className={s.cover}>
      <div className={s.arch}>
        <ArchLine />
        <Image src="/brand/sampann-logo.png" alt="" width={244} height={60} className={s.coverLogo} unoptimized priority />
        <p className={s.coverThe}>THE</p>
        <p className={clsx(s.coverMenu, s.foil)}>Menu</p>
        <CoverOrnament className={s.coverOrn} />
        <p className={s.coverPlace}>CHAUL · ALIBAG</p>
      </div>
      <p className={s.cuisines}>{site.cuisines.join(" · ")}</p>
    </div>
  );
}

function Welcome() {
  return (
    <div className={clsx(s.inner, s.welcome)}>
      <svg className={s.welcomeArch} viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" aria-hidden>
        <path d="M0 100V26C0 11 22 0 50 0s50 11 50 26v74z" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.55" />
      </svg>
      <span className={s.inkLogo} role="img" aria-label="Sampann Resort & Restaurant" />
      <p className={s.welcomeTitle}>Welcome</p>
      <p className={s.welcomeSub}>to Sampann&rsquo; Resort &amp; Restaurant</p>
      <Ornament className={s.welcomeOrn} />
      <p className={s.welcomeLead}>
        Indulge in a culinary journey around the world,
        <br />
        right here at our table.
      </p>
      <p className={s.welcomeText}>
        Bold flavours and aromas from across the globe — fiery Indian classics, tandoor temptations, Oriental stir-fries, authentic Western
        plates and the local cooking of the Konkan coast.
      </p>
      <span className={s.welcomeSep} />
      <p className={s.welcomeText}>
        Everything is cooked fresh, with love and care, under our HACCP-certified chefs — a menu as diverse as it is delicious.
      </p>
      <span className={s.welcomeSep} />
      <p className={s.welcomeText}>
        Settle in for a warm, cosy meal with family and friends, or a special occasion with loved ones. Our team is always happy to guide you
        through the menu.
      </p>
    </div>
  );
}

function RunHead({ label }: { label: string }) {
  return (
    <div className={s.runhead}>
      <span>Sampann</span>
      <span className={s.runDot} />
      <span>{label}</span>
    </div>
  );
}

function Foot({ number, mode }: { number: number; mode: Mode }) {
  return (
    <div className={s.foot}>
      <p className={s.folio}>{pad2(number)}</p>
      <p className={s.fnote}>{mode === "spread" ? "All prices in ₹ · 5% GST applicable" : "Prices in ₹ · 5% GST extra"}</p>
    </div>
  );
}

function Contents({
  spec,
  number,
  onJump,
}: {
  spec: Extract<PageSpec, { kind: "index" }>;
  number: number;
  onJump: (pageIndex: number) => void;
}) {
  return (
    <div className={s.inner}>
      <RunHead label="Contents" />
      <div className={s.content}>
        <div className={s.head}>
          <p className={s.kicker}>{spec.continued ? "Contents · continued" : "The menu"}</p>
          <p className={s.title}>Contents</p>
          <Ornament className={s.ornament} />
        </div>
        <div className={s.indexList} style={{ "--row": spec.rowHeight } as CSSProperties}>
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
              <span className={s.indexNum}>{pad2(e.ordinal)}</span>
              <span className={s.indexName}>{e.name}</span>
              <span className={s.leader} />
              <span className={s.indexNo}>{pad2(e.page)}</span>
            </button>
          ))}
        </div>
      </div>
      <Foot number={number} mode="single" />
    </div>
  );
}

function MenuPage({ sections, number, mode }: { sections: Section[]; number: number; mode: Mode }) {
  return (
    <div className={s.inner}>
      <RunHead label={sections[0]?.name ?? ""} />
      <div className={s.content}>
        {sections.map((sec) => (
          <section key={`${sec.slug}-${sec.continued}`} className={s.section}>
            <div className={s.head}>
              <p className={s.kicker}>
                N° {pad2(sec.ordinal)}
                {sec.continued && " · continued"}
              </p>
              <p className={s.title}>{sec.name}</p>
              <Ornament className={s.ornament} />
              {sec.note && <p className={s.note}>{sec.note.replace(/\.$/, "")}</p>}
            </div>
            {sec.layout === "grid" ? (
              <ul className={s.grid}>
                {sec.dishes.map((d) => (
                  <li key={d.id} className={s.gridItem}>
                    <span className={s.name}>{d.name}</span>
                    <span className={s.leader} />
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
                      {d.options.length === 0 && (
                        <>
                          <span className={s.leader} />
                          <Amount dish={d} />
                        </>
                      )}
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
      <Foot number={number} mode={mode} />
    </div>
  );
}

function Amount({ dish }: { dish: Pick<DishDTO, "price" | "priceNote"> }) {
  if (dish.price != null) return <span className={s.price}>{amount(dish.price)}</span>;
  if (dish.priceNote) return <span className={clsx(s.price, s.priceNote)}>{dish.priceNote}</span>;
  return null;
}

function Thanks() {
  const stop = (e: React.MouseEvent) => e.stopPropagation();
  return (
    <div className={s.thanks}>
      <Image src="/brand/sampann-logo.png" alt="" width={244} height={60} className={s.thanksLogo} unoptimized />
      <p className={clsx(s.thanksTitle, s.foil)}>Thank you</p>
      <p className={s.thanksSub}>for dining with us — do visit again.</p>
      <p className={s.hostLabel}>We also host</p>
      <div className={s.hostList}>
        {site.events.map((e, i) => (
          <span key={e} style={{ display: "contents" }}>
            {i > 0 && <span className={s.hostDot} />}
            <span>{e}</span>
          </span>
        ))}
      </div>
      <div className={s.contactRow}>
        <div>
          <span className={s.contactLabel}>Call</span>
          <a className={s.contactValue} href={`tel:${site.phone.tel}`} onClick={stop}>
            {site.phone.display}
          </a>
        </div>
        <div>
          <span className={s.contactLabel}>Find us</span>
          <a className={s.contactValue} href={site.mapsUrl} target="_blank" rel="noreferrer" onClick={stop}>
            {site.locality}
          </a>
        </div>
        <div>
          <span className={s.contactLabel}>Instagram</span>
          <a className={s.contactValue} href={site.instagram.url} target="_blank" rel="noreferrer" onClick={stop}>
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
