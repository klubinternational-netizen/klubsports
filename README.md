# KLUB SPORTS — Premium Corporate Sports Footwear Website & Admin Panel

Production-ready corporate website, multi-sport footwear catalogue, and secure administration CMS for **Klub Sports**.

---

## 1. Brand Identity & Color System

The user interface and design token architecture are strictly derived from the official Klub Sports vector logo assets supplied by the client:

- **Primary Brand Orange:** `#ee7700` (rgb: 238, 119, 0) — used for primary calls to action, badges, and brand emphasis.
- **Dark Brand Orange:** `#d46500` — used for hover, active states, and dark contrast.
- **Supporting Charcoal / Slate:** `#625e5d` (rgb: 98, 94, 93) — used for secondary typography and structural accents.
- **Deep Neutral Charcoal:** `#1c1917` — used for high-contrast corporate typography and dark footer elements.
- **Subtle Surface Tint:** `#faf9f8` & `#fff7ed` — used for clean, corporate background balance.

> **Official Brand Name Notice:**  
> The official approved brand name across all corporate pages and communications is **Klub Sports** (resolving the inconsistency found on the closing slide of the source deck where "K-Sports" was mentioned).

---

## 2. Business Model & Architecture

- **Corporate Profile & Product Showcase:** Clean, international corporate aesthetic focused on athletic performance.
- **No E-Commerce / No Retail Cart:** No product prices, no cart, no checkout, and no customer shopping accounts.
- **Institutional & Bulk Enquiry Pipeline:** Businesses, academies, and state athletic boards submit procurement RFQs directly to the administrative desk.
- **Single-Administrator Architecture:** High-security single administrator portal with Argon2/bcrypt password hashing, JWT HTTP-only session cookies, rate-limiting, and activity auditing. Public admin registration is disabled.
- **Immediate Publishing Workflow:** Changes made in the administrator panel save to MongoDB and instantly revalidate public cached routes with zero redeployments required.

---

## 3. Technology Stack

- **Frontend:** Next.js (App Router), TypeScript, React, Tailwind CSS, Lucide React icons.
- **Typography:** Manrope (primary headings and interface) & Inter.
- **Backend & APIs:** Next.js Route Handlers with server-side Zod validation.
- **Database:** MongoDB Atlas with Mongoose models, indexes, and aggregation pipelines.
- **Authentication:** Edge/Node session JWT verification with HTTP-only cookies and bcrypt hashing.
- **Media Delivery:** ImageKit integration with safe local fallback.
- **Spam Protection:** In-memory sliding-window rate limiting + invisible honeypot field.

---

## 4. Database Models

The MongoDB database (`klub_sports`) contains the following collections:

1. `admins`: Single super-administrator account (`email`, `passwordHash`, `isActive`, `lastLoginAt`).
2. `categories`: Footwear categories based on the 11 disciplines from the source presentation (`name`, `slug`, `description`, `coverImage`, `sortOrder`, `isPublished`, `seo`).
3. `products`: Sports footwear models (`name`, `slug`, `categoryId`, `shortDescription`, `description`, `features`, `images`, `isPublished`, `sortOrder`, `seo`).
4. `pages`: Pre-structured CMS pages (`home`, `about`, `manufacturing`, `contact`, `privacy`).
5. `siteSettings`: Global corporate contact details, brand name, logo assets, working hours, and default SEO metadata.
6. `enquiries`: Inbound institutional procurement submissions (`name`, `companyName`, `email`, `phone`, `categoryId`, `message`, `status`, `internalNotes`, `sourcePage`).
7. `adminActivityLogs`: Immutable administrative audit trail recording every login, create, update, and delete action.

---

## 5. Environment Configuration

Create a `.env.local` file (modeled after `.env.example`):

```bash
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://klubinternational_db_user:sNr5fKt7g5sYWJr3@cluster0.unco14l.mongodb.net/klub_sports?retryWrites=true&w=majority

# Admin Session Secret (min 32 characters)
ADMIN_SESSION_SECRET=c38e94f1a25bc8d4102948ebfa267104b2938aef729104db829104cba4718392

# Initial Admin Credentials (used during npm run seed)
INITIAL_ADMIN_EMAIL=admin@klubsports.com
INITIAL_ADMIN_PASSWORD=KlubSportsAdmin2026!Secure

# ImageKit Integration (Optional — safe fallback to local uploads enabled)
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=

# Email Notifications (Optional via Resend)
RESEND_API_KEY=
ENQUIRY_NOTIFICATION_EMAIL=info@klubsports.com

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 6. Setup & Execution Commands

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Seed the Database & Provision Admin
```bash
npm run seed
```
This populates:
- The initial super-administrator (`admin@klubsports.com`)
- The 11 official footwear categories from the source presentation
- Showcase footwear models across multiple sports
- Default CMS page content (Home, About, Manufacturing, Contact, Privacy)
- Official site settings and brand metadata

### Step 3: Run System Diagnostics
```bash
npx tsx test_system.ts
```

### Step 4: Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) for the public website.  
Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the admin portal.

### Step 5: Production Build & Run
```bash
npm run build
npm start
```

---

## 7. Website Navigation & Routes

### Public Pages:
- `/` — Corporate Homepage (Hero, Highlights, Multi-Sport Categories, Showcase Models, About intro, Manufacturing overview, Partner CTA).
- `/about` — Corporate Profile, engineering pillars, operational footprint.
- `/products` — Product Catalogue with live search, category filters, and detail view.
- `/products/[slug]` — Product Detail page with photo gallery, technical specs, related category footwear, and business enquiry CTA.
- `/categories/[slug]` — Dynamic category page backed by MongoDB.
- `/manufacturing` — Industrial manufacturing infrastructure, production capacity, and audit notices.
- `/contact` — Contact details & interactive Business Enquiry form with field validation.
- `/privacy-policy` — Corporate privacy & data governance notice.

### Admin Portal:
- `/admin/login` — Minimalist secure login with rate limiting.
- `/admin/dashboard` — Live counts (products, published/draft, categories, enquiries by status), recent product updates, recent enquiries, activity audit logs.
- `/admin/products` — Product table, search, category filter, toggle publish/unpublish, delete confirmation.
- `/admin/products/new` — Create new footwear model with media upload, features list, and SEO fields.
- `/admin/products/[id]/edit` — Edit existing footwear specifications with immediate publishing.
- `/admin/categories` — Category manager with product count and safe deletion protection.
- `/admin/content` — Website Content Management (Home, About, Manufacturing).
- `/admin/enquiries` — Institutional enquiry inbox, pipeline status updates (`New`, `In Progress`, `Closed`), and private internal notes.
- `/admin/media` — Media manager with upload and copy URL functionality.
- `/admin/settings` — Corporate identity settings, contact info, SEO defaults, and admin password change.

---

## 8. Client Governance & Pending Items (TODO / TBD)

In strict accordance with client guidelines, the following figures from the source presentation are documented with pending audit status:

1. **[TBD / Audit Pending] Factory Statistics:**
   - 4 Factories
   - 130,000 sq. ft. factory area
   - 4,00,000 units/month production capacity
   - 12 Indian states reach
   - ₹3 Crore annual turnover  
   *Action:* Retained in the CMS editor; displayed with client disclosure notices until certified by client audit.

2. **[TODO] ImageKit API Keys:**  
   Once the client generates ImageKit API keys, populate `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, and `IMAGEKIT_URL_ENDPOINT` in `.env.local`. Local fallback is active and operational.

3. **[TODO] Resend API Key for Email Notifications:**  
   Once the client designates their notification inbox, add `RESEND_API_KEY` to `.env.local`.
