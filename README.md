# Shree Vishwakarma Foam Mattress and Furniture

A production-ready, full-stack Next.js 14 website for **Shree Vishwakarma Foam Mattress and Furniture** — a premium manufacturer and retailer of Sagwan (Teak Wood) furniture, sofas, beds, mattresses, and custom furniture.

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS, Lucide React icons |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| Deployment | Vercel |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
cd "VISHWAKARMA furniture"
npm install
```

### 2. Set Up Supabase

#### A. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Note your **Project URL** and **API Keys** from: *Settings → API*

#### B. Run the Database Schema
1. In your Supabase Dashboard → **SQL Editor** → **New Query**
2. Copy and paste the entire contents of `supabase/schema.sql`
3. Click **Run**

#### C. Create Storage Buckets
In Supabase Dashboard → **Storage → New Bucket**, create three buckets:

| Bucket Name | Public |
|-------------|--------|
| `product-images` | ✅ Yes |
| `category-images` | ✅ Yes |
| `project-images` | ✅ Yes |

After creating buckets, run the storage policy section at the bottom of `schema.sql`.

#### D. Create the Owner Account
1. Supabase Dashboard → **Authentication → Users → Add User**
2. Enter your email and a strong password
3. The trigger will auto-create their profile with `role = 'owner'`

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

> ⚠️ **Never commit `.env.local` to git.** The `SUPABASE_SERVICE_ROLE_KEY` is secret — keep it server-side only.

### 4. Update Contact Details

Log into `/admin/settings` and update:
- Phone number
- WhatsApp number (digits only, with country code e.g. `919876543210`)
- Business address
- Instagram URL
- Hero heading and description

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (public)/           # Public website (Navbar + Footer layout)
│   │   ├── page.tsx        # Homepage
│   │   ├── products/       # All products + [slug] detail
│   │   ├── categories/     # All categories + [slug] listing
│   │   ├── our-work/       # Portfolio page
│   │   ├── about/          # About Us
│   │   └── contact/        # Contact form → WhatsApp
│   ├── admin/              # Protected admin dashboard
│   │   ├── login/          # Owner login (no public signup)
│   │   ├── page.tsx        # Overview / stats
│   │   ├── products/       # Products CRUD + image upload
│   │   ├── categories/     # Categories CRUD
│   │   ├── projects/       # Our Work CRUD
│   │   └── settings/       # Site settings
│   ├── layout.tsx          # Root layout (fonts, metadata)
│   └── not-found.tsx       # 404 page
├── components/
│   ├── layout/             # Navbar, Footer
│   ├── ui/                 # ProductCard, CategoryCard, Gallery, WhatsApp btn
│   └── admin/              # Sidebar, Toast, ConfirmModal, ProductForm
├── lib/
│   ├── supabase/           # client.ts + server.ts
│   ├── data.ts             # Server-side data fetchers with fallbacks
│   └── utils.ts            # cn(), formatPrice(), generateWhatsAppUrl()
├── middleware.ts            # Protects /admin/* routes via Supabase SSR
└── types/index.ts          # TypeScript interfaces for all DB tables
```

---

## 🌐 Pages

### Public Website
| Route | Description |
|-------|-------------|
| `/` | Homepage: Hero, Categories, Featured Products, Why Us, Our Work preview |
| `/products` | Full catalogue with category filters and search |
| `/products/[slug]` | Product detail: image gallery, specs, WhatsApp CTA |
| `/categories` | All category cards |
| `/categories/[slug]` | Products within a category |
| `/our-work` | Filterable portfolio of completed projects |
| `/about` | Business story, stats, contact CTAs |
| `/contact` | Contact form (opens WhatsApp with pre-filled message) |

### Admin Dashboard (`/admin`)
| Route | Description |
|-------|-------------|
| `/admin/login` | Email/password login — no public signup |
| `/admin` | Dashboard: stats, recent products |
| `/admin/products` | List all products, toggle featured/available |
| `/admin/products/new` | Add product with multi-image upload |
| `/admin/products/[id]` | Edit product |
| `/admin/categories` | Add, edit, delete categories (with safe-delete guard) |
| `/admin/projects` | Upload Our Work photos |
| `/admin/settings` | Update hero text, contact info, WhatsApp number |

---

## 🔒 Security

- **Middleware** (`src/middleware.ts`) runs on the edge and redirects unauthenticated users away from all `/admin/*` routes
- **Admin Layout** (`src/app/admin/layout.tsx`) double-checks session and `role = 'owner'` on the server before rendering
- **Row Level Security (RLS)** enabled on all Supabase tables — public can only `SELECT`, mutations require `is_admin()` check
- **No public registration** — the login page has email/password only; create owner accounts manually in Supabase Dashboard
- `SUPABASE_SERVICE_ROLE_KEY` is never exposed to the browser

---

## ☁️ Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your repo
3. Add all three environment variables in Vercel's **Settings → Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Click **Deploy**

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background Primary | `#FAF8F5` (Cream) |
| Background Secondary | `#F0EAE1` (Warm Beige) |
| Text / Dark | `#2C1E16` (Deep Espresso) |
| Accent Wood | `#8B5A2B` (Teak) |
| Highlight | `#C5A059` (Champagne Gold) |
| Heading Font | Playfair Display (serif) |
| Body Font | Inter (sans-serif) |

---

## 📱 WhatsApp Integration

Every product has a **WhatsApp Inquiry** button that opens:
```
https://wa.me/{whatsapp_number}?text=Hello, I am interested in {Product Name}. Please share more details and pricing.
```

The WhatsApp number is managed dynamically from **Admin → Settings**.

---

## 🗄 Database Schema

| Table | Purpose |
|-------|---------|
| `profiles` | Owner accounts (auto-created on signup) |
| `categories` | 8 furniture categories (seeded) |
| `products` | Furniture & mattress listings |
| `product_images` | Multi-image gallery per product |
| `projects` | Our Work portfolio entries |
| `site_settings` | Single-row business info & hero content |

---

## 📞 Support

For customization help or issues, update `.env.local` with real Supabase credentials and test locally first.
