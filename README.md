# Sampanna — Architecture & Setup Guide

Sampanna is a modern web platform for the **Sampann Resort & Restaurant** in Chaul, Alibag. The project is structured into a clean, decoupled client-server architecture.

```text
Sampanna/
├── client/                 # Next.js frontend application
│   ├── public/
│   │   ├── images/
│   │   │   ├── logo/       # Official restaurant branding
│   │   │   ├── interior/   # Dining room & ambience photography
│   │   │   ├── food/       # Food & beverage photography
│   │   │   ├── gallery/    # Kitchen & exterior photography
│   │   │   └── other/      # Open Graph & meta assets
│   ├── src/
│   │   ├── app/            # Next.js App Router (pages & layouts)
│   │   ├── components/     # Reusable UI components
│   │   ├── services/       # Client API service layer with fallbacks
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Client utilities (api, media, time, submit)
│   │   ├── types/          # Shared DTO and view models
│   │   ├── config/         # Site configuration & business rules
│   │   └── data/           # Media metadata & static menu data
│   ├── package.json
│   ├── next.config.ts
│   └── tsconfig.json
├── server/                 # Independent Node.js & Express backend
│   ├── src/
│   │   ├── routes/         # Express API route declarations
│   │   ├── controllers/    # Request handlers & response formatters
│   │   ├── services/       # Database & external API business logic
│   │   ├── middleware/     # CORS, security, rate limiting, error handling
│   │   ├── lib/            # DB client, logger, hashing, validation
│   │   ├── config/         # Server configuration
│   │   └── types/          # Type definitions
│   ├── prisma/             # Database schema, migrations & seeders
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── scripts/            # Database inspection & asset optimization
│   ├── package.json
│   └── tsconfig.json
├── docs/                   # Project documentation & image catalogs
├── Sampann_Menu_updated (1).pdf  # Real menu reference
├── .gitignore
└── README.md
```

---

## 1. Client — Frontend (`client/`)

The frontend is built with **Next.js 16**, **React 19**, and **Tailwind CSS 4**.

### Key Features
- **Public Routes**:
  - `/` — Homepage with Hero, Story, Categories showcase, Highlights, Reviews, and Gallery preview.
  - `/menu` — Categorized interactive menu browser.
  - `/gallery` — Filterable photography grid with Lightbox modal.
  - `/about` — Editorial story, room details, and heritage.
  - `/contact` — Contact enquiry form, interactive table reservation form, location maps.
- **Image Assets**: Categorized under `client/public/images/`:
  - `logo/`: Preserved official Sampanna logo (`sampann-logo.png`).
  - `interior/`: 8 dining room and table setting photos.
  - `food/`: 32 food and drink photos.
  - `gallery/`: 10 kitchen, flame, and exterior photos.
  - `other/og/`: 5 high-resolution Open Graph cards.
- **Client API Integration**:
  - `client/src/services/` communicates with the backend Express API via `client/src/lib/api.ts`.
  - Next.js rewrites in `client/next.config.ts` proxy `/api/:path*` to the backend server.
  - Graceful fallback ensures static pages prerender reliably even during offline development.

### Running the Client

```bash
cd client
npm run dev
# Running on http://localhost:3000
```

### Production Build

```bash
cd client
npm run build
npm run start
```

---

## 2. Server — Backend (`server/`)

The backend is an independent **Node.js** service using **Express**, **TypeScript**, and **Prisma ORM** connecting to **Supabase PostgreSQL**.

### Architecture
- **Routes (`src/routes/`)**:
  - `GET /api/health` — Health check endpoint.
  - `GET /api/menu` — Full active menu with available dishes.
  - `GET /api/menu/categories` — Menu categories with item counts.
  - `GET /api/menu/categories/:slug` — Single category by slug with dishes.
  - `GET /api/menu/featured` — Featured chef recommendations.
  - `GET /api/menu/search?q=` — Dish search with rate-limiting.
  - `GET /api/gallery?category=` — Curated gallery photography.
  - `GET /api/testimonials` — Published reviews & Google Places rating.
  - `POST /api/reservations` — Reservation request submission (anti-spam, rate-limited).
  - `POST /api/contact` — General contact enquiry submission.
- **Security & Reliability**:
  - Zod request validation.
  - Anti-spam honeypot and fill-time checks.
  - Two-tier rate limiting (in-memory sliding window + durable hashed IP database count).
  - CORS with configurable origins (`CORS_ORIGIN`).
  - Security headers (`nosniff`, `SAMEORIGIN`, `strict-origin-when-cross-origin`).

### Running the Server

```bash
cd server
npm run dev
# Listening on http://localhost:5000
```

### Building the Server

```bash
cd server
npm run build
npm run start
```

### Database Operations

```bash
cd server
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed menu and photography
npm run db:studio    # Open Prisma Studio GUI
```

---

## 3. Environment Variables

### Client (`client/.env`)

```env
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:5000"
INTERNAL_API_URL="http://localhost:5000"
```

### Server (`server/.env`)

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_SALT=sampann

# Supabase PostgreSQL (Prisma)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[DB-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[DB-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Optional: Verified Google reviews
# GOOGLE_PLACES_API_KEY=""
# GOOGLE_PLACE_ID=""
```
