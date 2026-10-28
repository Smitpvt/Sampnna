# Sampann — Resort & Restaurant website

The website for Sampann Resort & Restaurant in Chaul, Alibag. It has five pages (Home, About, Gallery, Menu and Contact), a full menu with search that comes from the database, and reservation and contact forms that save to the database.

**Stack:** Next.js 16 (App Router, TypeScript) · Tailwind CSS 4 · Motion · Prisma 6 · Supabase PostgreSQL · Zod · Vercel

---

## Project structure

```
prisma/
  schema.prisma            Data model (menu, gallery, reservations, testimonials, enquiries)
  migrations/              SQL migrations (incl. Row Level Security for Supabase)
  seed.ts                  Seeds menu + gallery from src/data (idempotent)
public/
  brand/sampann-logo.png   The supplied logo, unmodified
  images/*.webp            Web-optimised photography used by the site (generated)
  images/og/*.jpg          1200×630 social-share images (generated)
scripts/
  optimize-images.mjs      Originals (outside the repo) → public/images + blur placeholders
  inspect-submissions.ts   Prints recent reservations and enquiries
src/
  app/                     Pages, metadata, sitemap, robots, icons
    api/                   Route handlers (public JSON API)
  components/
    layout/                Header, mobile nav, footer, logo
    home/                  Homepage sections A–G
    menu/                  Menu browser, dish row, price
    gallery/               Masonry grid + lightbox
    reservations/          Reservation section + form
    contact/  forms/  seo/  ui/
  config/site.ts           Verified business facts (phone, locality, Instagram…)
  content/                 Editorial copy + homepage curation (replaceable)
  data/
    menu.ts                ★ Menu source of truth (transcribed from the PDF)
    media-sources.json     ★ Curated photos: file, category, alt text, caption
    media.generated.json   Dimensions + blur placeholders (generated)
  lib/                     db client, validation, rate limiting, http helpers
  services/                Server-only business logic (menu, gallery, reviews, submissions)
  types/                   Shared DTO types
```

**Frontend and backend are kept apart.** Everything in `src/services`, `src/lib/db.ts`, `src/lib/http.ts` and the other `src/lib` server helpers imports `server-only`, so it can never be bundled into the browser. Pages read data through the services. The browser only talks to the `/api/*` route handlers.

---

## Getting started (local)

Requirements: Node ≥ 20.9.

```bash
npm install
cp .env.example .env
```

### Option A: your Supabase project (recommended)

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **Connect → ORMs → Prisma** and copy the two connection strings into `.env`:
   - `DATABASE_URL`: the **transaction pooler** (port **6543**), ending in `?pgbouncer=true&connection_limit=1`.
   - `DIRECT_URL`: the **session pooler** (port **5432**) or the direct connection.
3. Run:

```bash
npx prisma migrate deploy
npm run db:seed
npm run dev
```

### Option B: local Postgres without Docker

Prisma includes a local Postgres server:

```bash
npx prisma dev --name sampann --detach
```

Point both URLs at the TCP address it prints, and add `&pgbouncer=true` to `DATABASE_URL`. The local server shares one connection, just like Supabase's pooler. Then run `npx prisma migrate deploy` and `npm run db:seed`.

### Useful commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm run db:migrate` | Create and apply a new migration (development) |
| `npm run db:deploy` | Apply existing migrations (staging and production) |
| `npm run db:seed` | Load the menu and gallery from `src/data` |
| `npm run db:studio` | Prisma Studio: browse reservations and enquiries |
| `npm run images` | Rebuild `public/images` from the original photos |

---

## How Supabase connects (Vercel / serverless)

| Variable | Supabase endpoint | Used by |
| --- | --- | --- |
| `DATABASE_URL` | Supavisor **transaction** pooler, port 6543, `pgbouncer=true&connection_limit=1` | The app at runtime (each serverless function) |
| `DIRECT_URL` | **Session** pooler, port 5432, or direct | `prisma migrate` and seeding |

- `pgbouncer=true` turns off prepared statements, which the transaction pooler doesn't support.
- `connection_limit=1` keeps each serverless instance to one connection.
- One `PrismaClient` is shared per instance (`src/lib/db.ts`).
- **Row Level Security** is enabled on every table (migration `…_enable_rls`). Supabase's Data API exposes the `public` schema to anyone holding the anon key. With RLS on and no policies, that key can't read anything, so guest names, emails and phone numbers stay private. Prisma connects as the table owner, so the site is unaffected. **Do not** add RLS policies that grant `anon` access to `Reservation` or `ContactEnquiry`.

---

## Deploying to Vercel

1. Push the repo to GitHub and import it in Vercel. The framework preset (Next.js) is detected automatically.
2. Add these environment variables (Production and Preview):
   - `DATABASE_URL`, `DIRECT_URL` (as above)
   - `NEXT_PUBLIC_SITE_URL`: the live domain, e.g. `https://sampann.in`
   - `RATE_LIMIT_SALT`: any long random string
   - Optional: `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID`, `NEXT_PUBLIC_SUPABASE_URL`
3. Apply migrations and seed once, from your machine:
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```
   Re-run `db:deploy` whenever new migrations ship. You can also run it in CI before each deploy.
4. Deploy. The build command (`prisma generate && next build`) is in `package.json`. **The build reads the database** to prerender pages, so the URLs must be set before you build.

Pages are static and revalidate hourly (ISR). Edits to menu data appear within an hour, or straight away on the next deploy.

---

## Content rules (important)

- **The menu has one source.** `src/data/menu.ts` seeds the database, and every page reads from the database. Homepage curation (`src/content/home.ts`) only picks dishes **by slug**. It never defines dishes or prices.
- Names, descriptions and prices are copied exactly from the menu PDF; only the capitalisation is changed. "APS" is shown as *As per size*.
- **Dietary marks** (`isVegetarian`, etc.) are `null` (unverified), so none are shown. Set them in the database to show veg/non-veg marks.
- **Nothing is invented.** The site shows only the phone number, locality, Instagram and "We also host" list, all taken from the menu. Opening hours and email are `null` in `src/config/site.ts`, so the UI says "please call ahead". Fill them in there.
- **Reviews and rating** appear only from verified sources:
  - Google: set `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID`. The site calls the Places API (New) on the server, caches results for 24 hours, and links to Google with attribution. The key is never sent to the browser.
  - Testimonials: rows in `Testimonial` with `isPublished = true`. `source = ADMIN` rows are labelled separately from Google reviews.
  - If neither source exists, the reviews section and the rating metric are hidden in production.
- **Photos are linked to dishes only when the photo clearly shows that dish.** Other food photos appear in the gallery with generic captions.

### Menu entries for the restaurant to confirm

These are listed in `MENU_REVIEW_NOTES` in `src/data/menu.ts`:

- **Plain Dosa** and **Duplex Mushroom**: their printed descriptions repeat other dishes' text, so the descriptions are left out.
- **Masala Dosa** has the same description as Butter Dosa. **Lasooni Palak** is described as "fenugreek". "Radish gravy" may be meant as "reddish". All three are kept as printed.
- **Momos**: Veg is ₹399 and Chicken ₹349. **Four Cheese Pizza**: Veg and Chicken are both ₹449. Kept as printed.
- **"DIM SUM CRYSTAL VEG 399 SEA MOMOS 549"** is treated as two separate dishes.

---

## Reservations and enquiries

- A reservation is a **request** and is stored with status `PENDING`. The site never says a table is confirmed. Staff change the status to `CONFIRMED`, `REJECTED` or `CANCELLED`. Until an admin area exists, use Prisma Studio or the Supabase table editor.
- Validation uses the same Zod schema in the browser and on the server. The server checks:
  - the date is not in the past, and at most 90 days ahead
  - the time is one of the 30-minute slots
  - the booking is at least 1 hour ahead (India time)
  - the party is 1–20 guests
  - a valid phone number and email are given
- The time window (07:00–22:30) is `reservationRules` in `src/config/site.ts`. It is a sanity limit, **not** opening hours. Set it to the real hours.
- **Spam and abuse protection:**
  - a honeypot field and a minimum fill time
  - a same-origin check
  - a per-instance limit on bursts of requests
  - a limit of 5 submissions per hour per hashed IP, counted in the database so it holds across serverless instances (raw IP addresses are never stored)
  - duplicate requests (same email, date and time) are not stored twice
- Logs contain only event names and record IDs, never personal data.

### Public API

| Method | Route | Notes |
| --- | --- | --- |
| GET | `/api/menu/categories` | Active categories with dish counts |
| GET | `/api/menu/categories/:slug` | One category with its dishes |
| GET | `/api/menu/featured` | Featured dishes |
| GET | `/api/menu/search?q=` | Search by name or description (2–60 characters) |
| GET | `/api/gallery?category=` | `FOOD`, `DRINKS`, `AMBIENCE` or `KITCHEN` |
| GET | `/api/testimonials` | `{ google, testimonials }`, kept separate |
| POST | `/api/reservations` | Saves a reservation request as `PENDING` (201) |
| POST | `/api/contact` | Saves a contact enquiry (201) |

Every response has the shape `{ ok: true, data }` or `{ ok: false, error: { code, message, fields? } }`. The status codes used are 400, 403, 404, 422, 429 and 500.

---

## Images

- **The originals live outside the project**, in `../sampann-original-assets/` (about 1.2 GB). It has the folders `interior/`, `food/`, `gallery/`, `other/` and `logo/`. They are never committed or deployed, and `.gitignore` blocks them if they are copied back by mistake. [docs/image-renames.csv](docs/image-renames.csv) maps each camera filename to its new name and location, with a SHA-256 checksum. Back this folder up somewhere safe (see "External storage" below).
- `npm run images` reads the curated set in `src/data/media-sources.json`. For each entry it writes a WebP file with a 2400 px long edge (about 30–300 KB each) and a blur placeholder. Entries marked `"og": true` also get a 1200×630 JPEG share image in `public/images/og/`, because WebP isn't reliably supported in link previews. `next/image` then serves AVIF/WebP at responsive sizes for each device.
- If the originals are somewhere else, set `ORIGINALS_DIR=/path/to/originals` or pass the path: `node scripts/optimize-images.mjs /path`.
- To add a photo: add an entry to `media-sources.json` with `source` relative to the originals folder (e.g. `food/veg-thali.jpg`). Then run `npm run images`, then `npm run db:seed`.
- The previous JPEG web copies are kept as a backup in `../sampann-original-assets/_previous-web-derivatives/`.

### External storage

- **Back up the originals.** `../sampann-original-assets/` exists only on this computer. Copy it to cloud storage, such as a private Supabase Storage bucket, Google Drive or an external drive.
- **Admin uploads (later)** go to Supabase Storage, as below. Nothing else is needed for the current site: the 50 web images ship with the app.
- **For uploads from a future admin area**, use Supabase Storage:
  1. Create a public bucket, e.g. `media`.
  2. Set `NEXT_PUBLIC_SUPABASE_URL` so `next/image` accepts that host.
  3. Store the public object URL in `GalleryImage.imageUrl` or `Dish.image`.
  4. Keep upload permissions on the server only, using the service role key. Never expose it.

---

## Admin readiness

There is no admin dashboard yet, and no management endpoints are exposed. The services layer is ready for one: menu items, featured flags, availability, gallery publishing, testimonials, reservation status and enquiries are all plain database fields. When an admin area is built, protect it with real authentication (for example Supabase Auth with an admin role checked on the server) before adding any write endpoints.

---

## Still needed from the restaurant

- A **high-resolution or SVG logo**. The supplied PNG is 244×60, so it looks soft on retina screens and in the favicon.
- **Opening hours**, a public **email address**, and the **Google Place ID** plus an API key, if Google reviews should appear.
- Confirmation of the menu entries listed above, and which dishes are vegetarian.
- Verified brand copy to replace the introductory text in `src/content/copy.ts`, if you want to.
