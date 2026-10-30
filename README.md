# Reuse Before Return

A location-based web platform for local redistribution of unwanted e-commerce products across India.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS v4 |
| State & Data | TanStack Query + Zustand |
| Forms | React Hook Form + Zod |
| Backend / DB | Supabase (PostgreSQL + Auth + Storage + Realtime) |
| Email | Nodemailer (SMTP) via Express server |
| Maps | Leaflet + OpenStreetMap (default: Hyderabad, Telangana) |
| Icons | Lucide React |

## Quick Start

### 1. Clone and install

```bash
# Install frontend dependencies
npm install --legacy-peer-deps

# Install server dependencies
cd server && npm install && cd ..
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in your values in `.env`:
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` — from your Supabase dashboard (Project Settings → API)
- `SUPABASE_SERVICE_ROLE_KEY` — server-side only, never expose to frontend
- SMTP variables — your email provider credentials

### 3. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. In the Supabase SQL Editor, run the SQL migrations in order from `supabase/migrations/`:
   - `001_schema.sql`
   - `002_email_tables.sql`
   - `003_rls_policies.sql`
   - `004_indexes.sql`
   - `005_demo_users_confirm.sql` only if you are using the demo accounts
   - `006_user_directory.sql`
   - `007_signup_trigger_fix.sql` to repair the Auth signup trigger on existing projects
   - `008_signup_preferences_trigger_fix.sql` to repair notification-preferences creation during signup on existing projects
   - `009_seed_categories.sql` to ensure product categories exist
   - `010_product_image_storage.sql` to create the public image bucket and allow listing owners to upload images
3. Optionally run `supabase/seed.sql` for demo listings
4. Create a **public** storage bucket named `product-images` in Supabase Storage
5. Add and manage directory records in Supabase Dashboard → Table Editor → `user_directory`. Enter email addresses in lowercase without surrounding whitespace.

`006_user_directory.sql` creates a standalone user directory for manual management in Supabase Dashboard → Table Editor. It stores email and profile/contact details, but deliberately does not store passwords or authentication tokens. Row Level Security is enabled and browser roles have no access; do not add public read/write policies for this table. It is not connected to app signup yet. Connect it to the authentication provider only after that provider is selected and its identity/authorization model is defined.

The existing application auth flows still use Supabase Auth. The `profiles` table in `001_schema.sql` is tied to `auth.users`; the new `user_directory` table is separate and will not be populated by app signups. Authentication provider configuration is separate from this manual database setup. The browser only needs the project URL and public anon/publishable key; never put the service-role key in a `VITE_` variable.

### 4. Run development servers

```bash
npm run dev:all       # Runs both frontend (5173) and email server (3001)

# Or separately:
npm run dev           # Frontend only
npm run server        # Email server only
```

### 5. Build for production

```bash
npm run build         # Outputs to dist/
```

Deploy `dist/` to Vercel. The email server (`server/`) should be deployed separately (Railway, Render, or a VPS).

---

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── ui/            # Button, Input, Card, Dialog, Select, etc.
│   │   ├── layout/        # Navbar, Footer
│   │   ├── products/      # ProductCard, RequestModal, ReportModal
│   │   ├── map/           # MapView (Leaflet + OpenStreetMap)
│   │   └── location/      # LocationPicker (state/city/locality/PIN)
│   ├── contexts/          # AuthContext (Supabase Auth)
│   ├── hooks/             # useProducts, useRequests, useMessages, etc.
│   ├── lib/               # supabase.ts, utils.ts, constants.ts
│   ├── pages/
│   │   ├── auth/          # Login, Register, ForgotPassword
│   │   ├── products/      # Explore, ProductDetail, ListItem, EditListing
│   │   ├── dashboard/     # Dashboard, MyListings, MyRequests, IncomingRequests, Favorites, Notifications
│   │   ├── messages/      # Inbox, Conversation
│   │   ├── profile/       # PublicProfile
│   │   ├── settings/      # Settings
│   │   ├── admin/         # AdminDashboard
│   │   └── static/        # About, HowItWorks, CommunityGuidelines, Privacy, Terms
│   └── types/             # TypeScript interfaces
├── server/                # Express SMTP email server
│   ├── routes/email.js
│   ├── services/emailService.js
│   └── templates/         # HTML email templates
└── supabase/
    ├── migrations/        # SQL schema (run in order)
    └── seed.sql           # Demo data for Hyderabad + other Indian cities
```

---

## All Routes (25)

| Route | Description | Auth |
|-------|-------------|------|
| `/` | Landing page | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/forgot-password` | Password reset | Public |
| `/explore` | Browse listings | Public |
| `/products/:id` | Product detail | Public |
| `/about` | About page | Public |
| `/how-it-works` | Usage guide | Public |
| `/community-guidelines` | Safety & rules | Public |
| `/privacy` | Privacy policy | Public |
| `/terms` | Terms of service | Public |
| `/profile/:id` | Public user profile | Public |
| `/list-item` | Create listing | Auth required |
| `/products/:id/edit` | Edit listing | Auth + Owner |
| `/dashboard` | User dashboard | Auth required |
| `/dashboard/my-listings` | My listings | Auth required |
| `/dashboard/my-requests` | Requests sent | Auth required |
| `/dashboard/incoming-requests` | Requests received | Auth required |
| `/dashboard/favorites` | Saved items | Auth required |
| `/dashboard/notifications` | Notifications | Auth required |
| `/messages` | Message inbox | Auth required |
| `/messages/:id` | Conversation | Auth required |
| `/settings` | Account settings | Auth required |
| `/admin` | Admin dashboard | Admin only |
| `*` | 404 Not Found | Public |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key (safe for frontend) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key — **server only** |
| `SMTP_HOST` | SMTP hostname (e.g. smtp.gmail.com) |
| `SMTP_PORT` | SMTP port (587 for TLS, 465 for SSL) |
| `SMTP_USER` | SMTP login email |
| `SMTP_PASS` | SMTP password or app password |
| `SMTP_FROM` | Sender address |
| `VITE_DEFAULT_CITY` | Default map city (Hyderabad) |
| `VITE_DEFAULT_LAT` | Default map latitude (17.3850) |
| `VITE_DEFAULT_LNG` | Default map longitude (78.4867) |

---

## Key Features

- **India-first**: ₹ pricing, Indian states/UTs, Hyderabad default map, no USD/US ZIP
- **Free redistribution** as primary option with optional low-cost resale (₹)
- **Location privacy**: only city + locality shown publicly; exact pickup shared only after acceptance
- **Atomic reservations**: `accept_request` PostgreSQL RPC prevents race conditions
- **Real-time chat**: Supabase Realtime subscriptions in messages and notifications
- **SMTP email**: Nodemailer on Express backend; skips gracefully if not configured
- **Admin moderation**: full RLS enforcement; reports, listing removal, analytics charts
- **DPDPA 2023** referenced in privacy policy (draft — consult a lawyer before launch)

---

## Notes

- **Legal pages are drafts.** Privacy Policy and Terms of Service must be reviewed by a lawyer before public launch.
- **Seed data is demo content.** Remove or replace before production launch.
- **SMTP email** works without configuration (silently skipped) but configure SMTP vars for real notifications.
- **Storage bucket**: Create a public bucket named `product-images` in Supabase Storage.
- **Admin role**: Set `role = 'admin'` in the `profiles` table for admin users. Never embed admin passwords in source code.
