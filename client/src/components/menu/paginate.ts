import type { CategoryDTO, DishDTO } from "@/types/content";

/**
 * Pagination for the page-turning menu book.
 *
 * Every size inside a page is set in container units of the page width
 * (see MenuBook.module.css), so a page lays out identically at any screen
 * size — a page that fits once fits everywhere. That lets us split the menu
 * into pages with plain arithmetic (no DOM measuring), on the server, with
 * the exact same result on the client.
 *
 * All numbers below are in "u": 1u = var(--s) × 1cqw of the page. They MUST
 * stay in step with the matching values in MenuBook.module.css.
 */

export type Mode = "spread" | "single";

/** --s: type scale; ratio: page height / width. */
export const MODES: Record<Mode, { s: number; ratio: number }> = {
  spread: { s: 1.5, ratio: 1.32 }, // two pages side by side (desktop)
  single: { s: 1.85, ratio: 1.6 }, // one taller page (phones & tablets)
};

// Page frame, in raw cqw (not scaled by --s).
const PAD_X = 8.5;
const PAD_TOP = 7;
const PAD_BOTTOM = 5.5;

// Running head, folio and a small safety margin, in u.
const RUNHEAD = 1.05 * 1.2 + 0.9 + 2.6;
const FOOT = 1.2 + 1.6 + 0.6 + 0.95 * 1.2;
const SAFETY = 0.8;

// Section heading: kicker, title, ornament.
const KICKER = 1.05 * 1.2;
const TITLE_MT = 0.6;
const TITLE_LH = 4.1 * 1.05;
const TITLE_CW = 4.1 * 0.46;
const ORNAMENT = 1 + 1.4;
const HEAD_MB = 2.4;
const NOTE = 1.2 + 1.75 * 1.3;
const SECTION_GAP = 4.5;

// Dishes.
const NAME_LH = 1.8 * 1.35;
const NAME_CW = 1.8 * 0.76; // uppercase + 0.09em tracking
const PRICE_W = 10; // leader + price
const DESC_LH = 1.85 * 1.28;
const DESC_CW = 1.85 * 0.36;
const DESC_INSET = 7;
const DESC_MT = 0.3;
const OPT_H = 0.5 + 2 * 1.2;
const ITEM_GAP = 1.8;

// Two-column layout for short lists without descriptions (beverages, breads…).
const GRID_GAP_X = 6;
const GRID_PRICE_W = 8;
const GRID_ROW_GAP = 1.8;

// Contents.
const INDEX_ROW = 3.4;

/** Only these sections carry a printed note under the heading. */
const PRINTED_NOTES = new Set(["sandwich-and-burgers", "steamed"]);

export type Layout = "list" | "grid";

export type Section = {
  slug: string;
  name: string;
  /** 1-based position of the section in the menu (for the "N° 04" kicker). */
  ordinal: number;
  note: string | null;
  continued: boolean;
  layout: Layout;
  dishes: DishDTO[];
};

export type IndexEntry = { slug: string; name: string; ordinal: number; page: number };

export type PageSpec =
  | { kind: "cover" }
  | { kind: "welcome" }
  | { kind: "index"; entries: IndexEntry[]; continued: boolean; rowHeight: number }
  | { kind: "menu"; sections: Section[] }
  | { kind: "thanks" };

const lines = (chars: number, charW: number, width: number) => Math.max(1, Math.ceil((chars * charW) / Math.max(width, 1)));

function frame(mode: Mode) {
  const { s, ratio } = MODES[mode];
  return {
    width: (100 - 2 * PAD_X) / s,
    height: (ratio * 100 - PAD_TOP - PAD_BOTTOM) / s - RUNHEAD - FOOT - SAFETY,
  };
}

function listItemHeight(d: DishDTO, width: number) {
  let h = lines(d.name.length, NAME_CW, width - PRICE_W) * NAME_LH;
  if (d.description) h += DESC_MT + lines(d.description.length, DESC_CW, width - DESC_INSET) * DESC_LH;
  if (d.options.length) h += OPT_H;
  return h + ITEM_GAP;
}

function gridRowHeight(a: DishDTO, b: DishDTO | undefined, width: number) {
  const col = (width - GRID_GAP_X) / 2 - GRID_PRICE_W;
  const n = Math.max(lines(a.name.length, NAME_CW, col), b ? lines(b.name.length, NAME_CW, col) : 1);
  return n * NAME_LH + GRID_ROW_GAP;
}

function headHeight(name: string, width: number, note: boolean) {
  return KICKER + TITLE_MT + lines(name.length, TITLE_CW, width) * TITLE_LH + ORNAMENT + HEAD_MB + (note ? NOTE : 0);
}

/** Two columns only for plain lists whose names sit comfortably in a half-width column. */
function layoutFor(c: CategoryDTO, width: number): Layout {
  const plain = c.dishes.every((d) => !d.description && d.options.length === 0);
  if (!plain || c.dishes.length < 6) return "list";
  const col = (width - GRID_GAP_X) / 2 - GRID_PRICE_W;
  const n = c.dishes.map((d) => lines(d.name.length, NAME_CW, col));
  const oneLine = n.filter((x) => x === 1).length / n.length;
  return Math.max(...n) <= 2 && oneLine >= 0.6 ? "grid" : "list";
}

/** Split the menu into book pages for one layout mode. */
function paginateMenu(categories: CategoryDTO[], mode: Mode): Section[][] {
  const { width, height } = frame(mode);
  const pages: Section[][] = [];
  let page: Section[] = [];
  let used = 0;
  const flush = () => {
    if (page.length) pages.push(page);
    page = [];
    used = 0;
  };

  let ordinal = 0;
  for (const c of categories) {
    if (c.dishes.length === 0) continue;
    ordinal += 1;
    const layout = layoutFor(c, width);
    const hasNote = PRINTED_NOTES.has(c.slug) && Boolean(c.description);
    const minPart = layout === "grid" ? 4 : 3;

    // Height units: one per dish (list) or per row of two (grid).
    const units: { from: number; to: number; h: number }[] = [];
    for (let k = 0; k < c.dishes.length; k += layout === "grid" ? 2 : 1) {
      const h = layout === "grid" ? gridRowHeight(c.dishes[k], c.dishes[k + 1], width) : listItemHeight(c.dishes[k], width);
      units.push({ from: k, to: Math.min(k + (layout === "grid" ? 2 : 1), c.dishes.length), h });
    }
    const headFirst = headHeight(c.name, width, hasNote);
    const headCont = headHeight(c.name, width, false);
    const sum = (a: number, b: number) => units.slice(a, b).reduce((n, u) => n + u.h, 0);
    const dishesIn = (a: number, b: number) => (b > a ? units[b - 1].to - units[a].from : 0);
    const place = (a: number, b: number, continued: boolean, h: number) => {
      page.push({
        slug: c.slug,
        name: c.name,
        ordinal,
        note: hasNote && !continued ? c.description : null,
        continued,
        layout,
        dishes: c.dishes.slice(units[a].from, units[b - 1].to),
      });
      used += h;
    };

    let u = 0;
    let continued = false;

    // 1. Share the current page with the previous section, if it fits whole
    //    — or if a clean part fits here and the rest fits on the next page.
    if (page.length) {
      const room = height - used - SECTION_GAP - headFirst;
      if (sum(0, units.length) <= room) {
        place(0, units.length, false, SECTION_GAP + headFirst + sum(0, units.length));
        continue;
      }
      let fit = 0;
      while (fit < units.length && sum(0, fit + 1) <= room) fit++;
      const restFits = headCont + sum(fit, units.length) <= height;
      // Only worth breaking if the section wouldn't fit on a page of its own anyway.
      const wholeFits = headFirst + sum(0, units.length) <= height;
      if (!wholeFits && dishesIn(0, fit) >= minPart && dishesIn(fit, units.length) >= minPart && restFits && used < height * 0.55) {
        place(0, fit, false, SECTION_GAP + headFirst + sum(0, fit));
        u = fit;
        continued = true;
      }
      flush();
    }

    // 2. The rest starts on a fresh page; spread it evenly over as few pages as it needs.
    const head = () => (continued ? headCont : headFirst);
    if (head() + sum(u, units.length) <= height) {
      place(u, units.length, continued, head() + sum(u, units.length));
      continue;
    }
    let need = 0;
    for (let k = u, first = true; k < units.length; need++, first = false) {
      let h = first && !continued ? headFirst : headCont;
      const start = k;
      while (k < units.length && h + units[k].h <= height) h += units[k++].h;
      if (k === start) k++; // a unit taller than a page still gets placed
    }
    const target = (head() + sum(u, units.length) + (need - 1) * headCont) / need;
    for (let p = 0; u < units.length; p++) {
      const last = p === need - 1;
      let h = head();
      const start = u;
      while (u < units.length) {
        const next = h + units[u].h;
        if (next > height) break;
        if (!last && h >= target - units[u].h / 2 && units.length - u >= minPart) break;
        h = next;
        u++;
      }
      if (u === start) {
        h += units[u].h;
        u++;
      }
      place(start, u, continued, h);
      if (u < units.length) {
        flush();
        continued = true;
      }
    }
  }
  flush();
  return pages;
}

/**
 * The whole book for one mode: cover, welcome, contents, menu pages and the
 * thank-you page. Page numbers count the cover as page 1.
 */
export function buildBook(categories: CategoryDTO[], mode: Mode): { pages: PageSpec[]; firstPage: Record<string, number> } {
  const { width, height } = frame(mode);
  const menuPages = paginateMenu(categories, mode);
  const listed = categories.filter((c) => c.dishes.length > 0);

  const maxRows = Math.max(6, Math.floor((height - headHeight("Contents", width, false)) / INDEX_ROW));
  const indexCount = Math.max(1, Math.ceil(listed.length / maxRows));
  const perIndexPage = Math.ceil(listed.length / indexCount);
  const firstMenuIndex = 2 + indexCount; // cover, welcome, contents…

  const firstPage: Record<string, number> = {};
  menuPages.forEach((sections, i) => {
    for (const s of sections) if (!(s.slug in firstPage)) firstPage[s.slug] = firstMenuIndex + i;
  });

  const entries: IndexEntry[] = listed.map((c, i) => ({ slug: c.slug, name: c.name, ordinal: i + 1, page: (firstPage[c.slug] ?? 0) + 1 }));
  // Rows breathe to fill the page, up to a comfortable maximum.
  const rowHeight = Math.min(4.8, (height - headHeight("Contents", width, false)) / perIndexPage);
  const indexPages: PageSpec[] = Array.from({ length: indexCount }, (_, k) => ({
    kind: "index",
    entries: entries.slice(k * perIndexPage, (k + 1) * perIndexPage),
    continued: k > 0,
    rowHeight,
  }));

  const pages: PageSpec[] = [
    { kind: "cover" },
    { kind: "welcome" },
    ...indexPages,
    ...menuPages.map((sections) => ({ kind: "menu" as const, sections })),
    { kind: "thanks" },
  ];
  return { pages, firstPage };
}

/** Compatibility alias */
export const buildPages = buildBook;
