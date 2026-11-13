-- ====================================================================
-- LOCALROOTS: FULL SUPABASE POSTGRESQL SCHEMA MIGRATION
-- Multi-seller local business marketplace schema with RLS & Transactions
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Base user profiles linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone_number VARCHAR(20),
  role VARCHAR(20) NOT NULL DEFAULT 'seller' CHECK (role IN ('seller', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. SELLER_PROFILES (Vendor business details, storefronts)
CREATE TABLE IF NOT EXISTS public.seller_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  story TEXT,
  business_category TEXT NOT NULL,
  logo_url TEXT,
  banner_url TEXT,
  phone_number VARCHAR(20) NOT NULL,
  address_line TEXT NOT NULL,
  locality TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pin_code VARCHAR(10) NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  pickup_available BOOLEAN NOT NULL DEFAULT false,
  min_order_value NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  default_delivery_charge NUMERIC(10,2) NOT NULL DEFAULT 40.00,
  free_delivery_threshold NUMERIC(10,2) DEFAULT NULL,
  estimated_delivery_time TEXT DEFAULT '1-2 days',
  payout_account_info JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES public.seller_profiles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  mrp NUMERIC(10,2) CHECK (mrp >= price),
  stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  min_order_quantity INT NOT NULL DEFAULT 1 CHECK (min_order_quantity >= 1),
  ingredients_or_materials TEXT,
  preparation_time TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_popular BOOLEAN NOT NULL DEFAULT false,
  is_freshly_made BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PRODUCT_IMAGES
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. SELLER_DELIVERY_AREAS (Serviceable PIN codes and localities per seller)
CREATE TABLE IF NOT EXISTS public.seller_delivery_areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES public.seller_profiles(id) ON DELETE CASCADE,
  pin_code VARCHAR(10) NOT NULL,
  locality_name TEXT,
  city TEXT NOT NULL,
  delivery_charge NUMERIC(10,2),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (seller_id, pin_code)
);

-- 7. DELIVERY_TIME_SLOTS
CREATE TABLE IF NOT EXISTS public.delivery_time_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES public.seller_profiles(id) ON DELETE CASCADE,
  slot_name TEXT NOT NULL, -- e.g. "Morning (9 AM - 12 PM)", "Evening (4 PM - 7 PM)"
  day_of_week VARCHAR(15), -- "All Days", "Monday", etc.
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. ORDERS (Parent Order grouping multi-seller checkout)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_reference VARCHAR(50) NOT NULL UNIQUE, -- e.g. LR-2026-XXXXX
  customer_name TEXT NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email TEXT,
  delivery_address_line TEXT NOT NULL,
  delivery_street TEXT,
  delivery_locality TEXT NOT NULL,
  delivery_city TEXT NOT NULL,
  delivery_state TEXT NOT NULL,
  delivery_pin_code VARCHAR(10) NOT NULL,
  delivery_instructions TEXT,
  tracking_otp_hash TEXT NOT NULL, -- For secure guest tracking verification
  total_items_amount NUMERIC(10,2) NOT NULL CHECK (total_items_amount >= 0),
  total_delivery_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (total_delivery_amount >= 0),
  grand_total NUMERIC(10,2) NOT NULL CHECK (grand_total >= 0),
  payment_method VARCHAR(20) NOT NULL DEFAULT 'razorpay' CHECK (payment_method IN ('razorpay', 'cod', 'upi')),
  payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'successful', 'failed', 'refunded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SELLER_SUBORDERS (Independent order lifecycle for each seller under parent order)
CREATE TABLE IF NOT EXISTS public.seller_suborders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.seller_profiles(id) ON DELETE RESTRICT,
  suborder_reference VARCHAR(60) NOT NULL UNIQUE,
  items_subtotal NUMERIC(10,2) NOT NULL,
  delivery_charge NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  suborder_total NUMERIC(10,2) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Order Placed' CHECK (
    status IN ('Order Placed', 'Accepted', 'Preparing', 'Ready for Dispatch', 'Out for Delivery', 'Delivered', 'Cancelled')
  ),
  rejection_reason TEXT,
  delivery_slot TEXT,
  estimated_delivery_date TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. ORDER_ITEMS (Specific products in each suborder)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  suborder_id UUID NOT NULL REFERENCES public.seller_suborders(id) ON DELETE CASCADE,
  parent_order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  seller_id UUID NOT NULL REFERENCES public.seller_profiles(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  quantity INT NOT NULL CHECK (quantity > 0),
  total_price NUMERIC(10,2) NOT NULL CHECK (total_price >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. PAYMENTS (Gateway transaction records)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  amount NUMERIC(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'successful', 'failed', 'refunded')),
  gateway_response JSONB DEFAULT '{}'::jsonb,
  idempotency_key TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. ORDER_STATUS_HISTORY
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  suborder_id UUID NOT NULL REFERENCES public.seller_suborders(id) ON DELETE CASCADE,
  status VARCHAR(30) NOT NULL,
  notes TEXT,
  created_by_role VARCHAR(20) NOT NULL DEFAULT 'seller' CHECK (created_by_role IN ('seller', 'admin', 'system')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES public.seller_profiles(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified_purchase BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. REPORTS (Customer/User flags on listings or sellers)
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reported_seller_id UUID REFERENCES public.seller_profiles(id) ON DELETE CASCADE,
  reported_product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  reporter_email TEXT,
  reason TEXT NOT NULL,
  details TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. ADMIN_ROLES
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES public.profiles(id),
  permissions JSONB NOT NULL DEFAULT '["all"]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_seller_profiles_slug ON public.seller_profiles(slug);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_approved_active ON public.seller_profiles(is_approved, is_active);
CREATE INDEX IF NOT EXISTS idx_products_seller ON public.products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_seller_delivery_pin ON public.seller_delivery_areas(pin_code);
CREATE INDEX IF NOT EXISTS idx_orders_reference ON public.orders(order_reference);
CREATE INDEX IF NOT EXISTS idx_seller_suborders_parent ON public.seller_suborders(parent_order_id);
CREATE INDEX IF NOT EXISTS idx_seller_suborders_seller ON public.seller_suborders(seller_id);
CREATE INDEX IF NOT EXISTS idx_order_items_suborder ON public.order_items(suborder_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_suborder ON public.order_status_history(suborder_id);

-- ====================================================================
-- DATABASE FUNCTIONS & ATOMIC INVENTORY DEDUCTION
-- ====================================================================

-- Function to safely decrement stock and prevent negative inventory
CREATE OR REPLACE FUNCTION public.decrement_product_stock(
  p_product_id UUID,
  p_quantity INT
) RETURNS BOOLEAN AS $$
DECLARE
  v_current_stock INT;
BEGIN
  SELECT stock_quantity INTO v_current_stock
  FROM public.products
  WHERE id = p_product_id
  FOR UPDATE;

  IF v_current_stock IS NULL OR v_current_stock < p_quantity THEN
    RAISE EXCEPTION 'Insufficient stock for product ID: % (Available: %, Requested: %)', p_product_id, COALESCE(v_current_stock, 0), p_quantity;
  END IF;

  UPDATE public.products
  SET stock_quantity = stock_quantity - p_quantity,
      updated_at = NOW()
  WHERE id = p_product_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_delivery_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_suborders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- 1. Categories: Anyone can read
CREATE POLICY "Public can view categories" ON public.categories
  FOR SELECT USING (true);

-- 2. Sellers: Anyone can view approved and active sellers
CREATE POLICY "Public can view approved active sellers" ON public.seller_profiles
  FOR SELECT USING (is_approved = true AND is_active = true);

-- Seller can view and edit their own profile
CREATE POLICY "Sellers can view own profile" ON public.seller_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Sellers can update own profile" ON public.seller_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Sellers can insert own profile" ON public.seller_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Products: Public can view active products of approved sellers
CREATE POLICY "Public can view active products" ON public.products
  FOR SELECT USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM public.seller_profiles s
      WHERE s.id = products.seller_id AND s.is_approved = true AND s.is_active = true
    )
  );

CREATE POLICY "Sellers can manage own products" ON public.products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.seller_profiles s
      WHERE s.id = products.seller_id AND s.user_id = auth.uid()
    )
  );

-- 4. Product images: Public can view, seller can manage
CREATE POLICY "Public can view product images" ON public.product_images
  FOR SELECT USING (true);

CREATE POLICY "Sellers can manage product images" ON public.product_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.products p
      JOIN public.seller_profiles s ON s.id = p.seller_id
      WHERE p.id = product_images.product_id AND s.user_id = auth.uid()
    )
  );

-- 5. Delivery Areas & Slots: Public can view, seller can manage
CREATE POLICY "Public can view seller delivery areas" ON public.seller_delivery_areas
  FOR SELECT USING (is_active = true);

CREATE POLICY "Sellers can manage delivery areas" ON public.seller_delivery_areas
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.seller_profiles s
      WHERE s.id = seller_delivery_areas.seller_id AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view delivery slots" ON public.delivery_time_slots
  FOR SELECT USING (is_active = true);

CREATE POLICY "Sellers can manage delivery slots" ON public.delivery_time_slots
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.seller_profiles s
      WHERE s.id = delivery_time_slots.seller_id AND s.user_id = auth.uid()
    )
  );

-- 6. Orders: Sellers can view suborders and items belonging to them
CREATE POLICY "Sellers can view own suborders" ON public.seller_suborders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.seller_profiles s
      WHERE s.id = seller_suborders.seller_id AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Sellers can update own suborders status" ON public.seller_suborders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.seller_profiles s
      WHERE s.id = seller_suborders.seller_id AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Sellers can view own order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.seller_profiles s
      WHERE s.id = order_items.seller_id AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "Sellers can view and add order status history" ON public.order_status_history
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.seller_suborders sub
      JOIN public.seller_profiles s ON s.id = sub.seller_id
      WHERE sub.id = order_status_history.suborder_id AND s.user_id = auth.uid()
    )
  );

-- 7. Reviews: Public can view, system/customers can insert
CREATE POLICY "Public can view reviews" ON public.reviews
  FOR SELECT USING (true);

-- 8. Admin full bypass policy across tables when authenticated as admin
CREATE POLICY "Admins have full access to profiles" ON public.profiles
  FOR ALL USING (EXISTS (SELECT 1 FROM public.admin_roles a WHERE a.user_id = auth.uid()));

CREATE POLICY "Admins have full access to seller profiles" ON public.seller_profiles
  FOR ALL USING (EXISTS (SELECT 1 FROM public.admin_roles a WHERE a.user_id = auth.uid()));

CREATE POLICY "Admins have full access to products" ON public.products
  FOR ALL USING (EXISTS (SELECT 1 FROM public.admin_roles a WHERE a.user_id = auth.uid()));

CREATE POLICY "Admins have full access to orders" ON public.orders
  FOR ALL USING (EXISTS (SELECT 1 FROM public.admin_roles a WHERE a.user_id = auth.uid()));

CREATE POLICY "Admins have full access to reports" ON public.reports
  FOR ALL USING (EXISTS (SELECT 1 FROM public.admin_roles a WHERE a.user_id = auth.uid()));
