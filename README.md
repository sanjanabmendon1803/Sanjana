# LOCALROOTS 🌿

> **"Small Businesses. Big Dreams. One Marketplace."**

LOCALROOTS is a community-driven, full-stack local business marketplace connecting independent micro-entrepreneurs, housewives selling traditional homemade foods, home bakers, and local craft artisans directly with nearby customers.

---

## 1. Project Vision & Core Principles

- **Zero Middlemen**: No distributors, no platform-owned inventory, no arbitrary retail markups.
- **Independent Pricing**: Sellers retain 100% autonomy over their recipe prices, preparation time, and delivery areas.
- **Direct Maker Settlement**: Customer payments are architected to route directly to each maker's linked bank account using connected-account marketplace rails (e.g. Razorpay Route).
- **100% Guest Shopping**: Customers can browse, search, add products from multiple makers into one cart, checkout, and track their delivery status **without mandatory account registration or login**.
- **Community Empowerment**: Primary focus on empowering homemakers, women-led micro-enterprises, small-scale pickle and papad makers, artisanal bakers, and pottery/craft artisans.

---

## 2. Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript & Vite
- **Styling**: Tailwind CSS with custom Indian D2C palette (`cream`, `forest`, `terracotta`, `charcoal`, `turmeric`)
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State & Query**: TanStack React Query & React Context (`CartContext`, `AuthContext`)
- **Build Output**: Clean static bundle (`dist/`) deployable to Vercel / Netlify / Cloudflare Pages

### Backend
- **Runtime**: Node.js & Express with TypeScript
- **Architecture**: Structured RESTful API (`/api`)
- **Security & Validation**: JWT tokens, bcryptjs, HMAC SHA256 crypto, sanitized request handling
- **Database Client**: `@supabase/supabase-js` with resilient in-memory seed fallback for zero-configuration testing
- **Payment Gateway**: Razorpay SDK with sandbox order creation, HMAC signature verification, and webhook idempotency

### Database & Storage
- **PostgreSQL**: Supabase PostgreSQL with 14 relational tables
- **Security**: Supabase Row Level Security (RLS) policies enforcing multi-tenant isolation
- **Functions**: Atomic database functions (e.g. `decrement_product_stock`) preventing negative inventory during concurrent orders

---

## 3. Brand Identity & Color Palette

| Color Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Warm Cream** | `#FAF8F2` | Primary background, natural unbleached paper feel |
| **Forest Green** | `#245C45` | Primary brand color, representing growth, purity, and organic kitchen roots |
| **Muted Terracotta** | `#C77C58` | Accent color, reflecting traditional Indian earthen pots, clay, and warmth |
| **Soft Beige Surface**| `#F4EFE6` | Secondary cards, subtle panels, and grouped container surfaces |
| **Dark Charcoal** | `#1C1E1B` | High-contrast readable typography for accessibility |
| **Turmeric Gold** | `#D99B26` | Badges, highlights, and star ratings |

---

## 4. Key Architectural Modules

### A. Customer-Facing Marketplace (Zero Customer Login)
- **Homepage**: Lifestyle hero section, 10 handmade categories, trending items, newly added creations, featured artisans, "How it Works", "Why Support Small Businesses", and footer.
- **Discovery & Search (`/explore`)**: Filter by category, min/max price slider, city, delivery PIN code, and sort by newest, price, or popularity.
- **Product Details (`/product/:id`)**: Multi-image thumbnail gallery, ingredients/materials breakdown, preparation times, stock indicator, and instant PIN deliverability checker.
- **Public Storefront (`/store/:slug`)**: Dedicated artisan home with biography, verified badge, workshop location, delivery rules, and exclusive product listings.

### B. Multi-Seller Shopping Cart (`/cart`)
- Items grouped automatically by maker.
- Calculates seller-specific subtotals and delivery charges.
- Displays free delivery progress indicators per seller (e.g. *"Add ₹120 more for FREE delivery from Amma's Homemade Pickles"*).
- Validates current backend prices and live inventory before proceeding.

### C. Guest Checkout (`/checkout`)
- Zero customer registration required.
- Collects recipient name, 10-digit Indian phone (`^[6-9]\d{9}$`), address, and 6-digit Indian PIN code (`^[1-9][0-9]{5}$`).
- **Multi-Vendor Order Splitting**: Automatically breaks a combined cart into independent `seller_suborders` under one parent `order_reference`.
- **Atomic Inventory Deduction**: Automatically checks available stock and decrements inventory in a transactional pass.

### D. Customer Order Tracking (`/track`)
- Completely login-free customer order tracking.
- Protected by **Order Reference + Verified Mobile OTP** to ensure customer addresses and phone numbers are never exposed over public endpoints.
- Displays a 6-step visual status stepper:
  1. `Order Placed`
  2. `Accepted`
  3. `Preparing`
  4. `Ready for Dispatch`
  5. `Out for Delivery`
  6. `Delivered` *(or `Cancelled`)*
- Itemized logs with timestamps and status notes.

### E. Payment Architecture & Direct Settlement
- **Sandbox Testing**: Razorpay sandbox order generation and HMAC SHA256 signature verification.
- **Direct Settlement Architecture**: LOCALROOTS does not manually pool or redistribute vendor revenue. In production, payments settle directly to vendors using linked marketplace accounts (Razorpay Route / Cashfree Split).
- Endpoint `/api/payments/architecture` provides transparent documentation of this compliance model.

### F. Seller Portal (`/seller/*`)
- **Register (`/seller/register`)**: 3-minute onboarding form with business name, category, story, address, and home delivery PIN.
- **Dashboard (`/seller/dashboard`)**: Verified sales totals (₹), active listings, pending orders, and recent order stream.
- **Product Management (`/seller/products`)**: Add, edit, delete, toggle active status, adjust stock, set ingredients and preparation time.
- **Delivery Configuration (`/seller/delivery`)**: Serviceable PIN codes, custom delivery charges, free delivery thresholds, and pickup availability.
- **Order Management (`/seller/orders`)**: State machine status transitions (`Accept` -> `Preparing` -> `Ready for Dispatch` -> `Out for Delivery` -> `Delivered`). WhatsApp customer contact button.

### G. Admin Governance Portal (`/admin/*`)
- **Dashboard (`/admin/dashboard`)**: Gross platform volume (₹), approved maker count, active listings, order volumes.
- **Maker Moderation**: Approve new applications or suspend unverified accounts.
- **Listing Moderation**: Review all platform items and remove inappropriate listings.

---

## 5. Database Schema & Supabase Setup

The database schema is defined in `supabase/migrations/01_initial_schema.sql` and consists of 14 tables:

1. `profiles` - Base authenticated user identities.
2. `seller_profiles` - Storefront profiles, biographies, locations, and delivery rules.
3. `categories` - Marketplace taxonomy (10 categories).
4. `products` - Product records with price, stock, ingredients, and prep time.
5. `product_images` - Gallery images for products.
6. `seller_delivery_areas` - Serviceable PIN codes mapped to individual sellers.
7. `delivery_time_slots` - Time slot options per seller.
8. `orders` - Parent guest order records with total amounts and OTP hashes.
9. `seller_suborders` - Independent suborders per seller under a parent order.
10. `order_items` - Specific items and historical prices per suborder.
11. `payments` - Gateway transactions and idempotency keys.
12. `order_status_history` - Audit log of status transitions.
13. `reviews` - Customer reviews and ratings.
14. `admin_roles` - Platform administrator access control.

### Applying Migrations to Supabase
1. Create a new project in the [Supabase Dashboard](https://supabase.com).
2. Go to the **SQL Editor**.
3. Copy and run `supabase/migrations/01_initial_schema.sql`.
4. Copy and run `supabase/seed.sql` to populate sample artisan storefronts.
5. In **Project Settings -> API**, copy your Project URL, Anon Key, and Service Role Key into your server `.env` file.

---

## 6. Demonstration Accounts

### Demo Sellers
| Maker Name | Email | Password | Specialty & Location |
| :--- | :--- | :--- | :--- |
| **Amma's Homemade Pickles** | `amma@localroots.in` | `Seller@123` | Traditional Pickles (Jaipur / Bengaluru) |
| **Homemade Treats** | `priya@localroots.in` | `Seller@123` | Fudgy Brownies & Bakery (Mumbai) |
| **Handmade by Anu** | `anu@localroots.in` | `Seller@123` | Terracotta Earrings & Crafts (Kochi) |

*(One-click login buttons for all three demo sellers are available directly on `/seller/login`)*

### Demo Administrator
- **Email**: `admin@localroots.in`
- **Password**: `Admin@123`
- **Portal**: `/admin/login`

### Demo Guest Shopper
- No login required! Simply browse, add items to cart, enter any delivery address with PIN `560038` or `400050`, and checkout.
- For guest order tracking on `/track`, use the OTP generated on your confirmation screen or the demo OTP `123456`.

---

## 7. Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Step 1: Install Dependencies
```bash
# In server directory
cd server
npm install

# In client directory
cd ../client
npm install
```

### Step 2: Configure Environment
Copy `.env.example` in both `server/` and `client/`:
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

*(Note: If Supabase credentials are not provided, the backend automatically runs with its pre-loaded in-memory database store with 100% functionality)*

### Step 3: Run the Application
In terminal 1 (Backend API Server):
```bash
cd server
npm run dev
# Server starts on http://localhost:5000
```

In terminal 2 (Frontend Client):
```bash
cd client
npm run dev
# Frontend starts on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## 8. Deployment Guide

### Deploying Frontend to Vercel
1. Push this repository to GitHub or GitLab.
2. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
3. Set the **Root Directory** to `client`.
4. Framework Preset: **Vite**.
5. Build Command: `npm run build`.
6. Output Directory: `dist`.
7. Add Environment Variables:
   - `VITE_API_URL`: Your deployed backend URL (e.g. `https://localroots-api.onrender.com/api`).
8. Click **Deploy**.

### Deploying Backend to Render
1. Sign in to [Render](https://render.com).
2. Click **New -> Web Service** and connect your repository.
3. Set **Root Directory** to `server`.
4. Runtime: **Node**.
5. Build Command: `npm install && npm run build`.
6. Start Command: `npm run start`.
7. Add Environment Variables:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: Your Vercel frontend URL
   - `JWT_SECRET`: A secure 32+ character random string
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role secret
   - `RAZORPAY_KEY_ID`: Your Razorpay key ID
   - `RAZORPAY_KEY_SECRET`: Your Razorpay secret
8. Click **Create Web Service**.

---

## 9. License & Attribution

Built with heart for independent Indian artisans, homemakers, and small-business owners.
Released under the MIT License.
