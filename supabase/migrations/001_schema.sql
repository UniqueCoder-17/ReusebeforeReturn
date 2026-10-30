-- ============================================================
-- Reuse Before Return — Core Schema
-- Run on your Supabase project (SQL Editor)
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id   uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  icon text,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO categories (name, slug, description, icon) VALUES
  ('Mobiles, Electronics & Accessories', 'electronics', 'Phones, tablets, chargers, earphones and more', 'Smartphone'),
  ('Clothing, Footwear & Bags', 'clothing', 'Apparel, shoes, bags, and accessories', 'ShoppingBag'),
  ('Books, Stationery & Exam Prep', 'books', 'Books, notebooks, competitive exam material', 'BookOpen'),
  ('Home, Kitchen & Household', 'home-kitchen', 'Utensils, home decor, cleaning supplies', 'Home'),
  ('Furniture & Home Décor', 'furniture', 'Furniture, lighting, and decorative items', 'Sofa'),
  ('Toys, Games & Baby Items', 'toys-baby', 'Toys, board games, baby products', 'Baby'),
  ('Sports & Fitness', 'sports', 'Sports equipment, gym gear, outdoor items', 'Activity'),
  ('Small Appliances', 'appliances', 'Mixers, irons, fans, small kitchen appliances', 'Zap'),
  ('Handicrafts & Art', 'handicrafts', 'Handmade items, craft supplies, art tools', 'Palette'),
  ('Other', 'other', 'Miscellaneous items not fitting other categories', 'Package')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   text NOT NULL,
  avatar_url  text,
  phone       text,
  state       text,
  city        text,
  locality    text,
  pin_code    text,
  latitude    double precision,
  longitude   double precision,
  role        text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  bio         text,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id        uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title           text NOT NULL,
  description     text NOT NULL,
  category_id     uuid NOT NULL REFERENCES categories(id),
  condition       text NOT NULL CHECK (condition IN ('new_unopened', 'like_new', 'gently_used', 'used_functional')),
  listing_type    text NOT NULL DEFAULT 'free' CHECK (listing_type IN ('free', 'resale', 'exchange')),
  price           numeric(10,2),
  original_price  numeric(10,2),
  brand           text,
  purchase_date   date,
  reason          text,
  state           text NOT NULL,
  city            text NOT NULL,
  locality        text NOT NULL,
  pin_code        text,
  latitude        double precision,
  longitude       double precision,
  pickup_preference text NOT NULL DEFAULT 'public_place' CHECK (pickup_preference IN ('public_place', 'gate', 'arrange_after')),
  status          text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'reserved', 'completed', 'deleted')),
  is_draft        boolean NOT NULL DEFAULT false,
  views_count     int NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- PRODUCT IMAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS product_images (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url   text NOT NULL,
  is_primary  boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- REQUESTS
-- ============================================================
CREATE TABLE IF NOT EXISTS requests (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id   uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  requester_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  owner_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message      text,
  status       text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled', 'completed')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  -- Prevent duplicate active requests from same user for same product
  UNIQUE (product_id, requester_id, status)
);

-- ============================================================
-- FAVORITES
-- ============================================================
CREATE TABLE IF NOT EXISTS favorites (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

-- ============================================================
-- CONVERSATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS conversations (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id uuid NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message_text    text NOT NULL,
  read_at         timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type              text NOT NULL,
  title             text NOT NULL,
  message           text NOT NULL,
  related_entity_id uuid,
  related_entity_type text,
  is_read           boolean NOT NULL DEFAULT false,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- REPORTS
-- ============================================================
CREATE TABLE IF NOT EXISTS reports (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type text NOT NULL CHECK (target_type IN ('product', 'user')),
  target_id   uuid NOT NULL,
  reason      text NOT NULL CHECK (reason IN ('prohibited_item', 'misleading', 'spam', 'inappropriate', 'suspicious_behavior', 'other')),
  description text,
  status      text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- MODERATION ACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS moderation_actions (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type text NOT NULL CHECK (target_type IN ('product', 'user', 'report')),
  target_id   uuid NOT NULL,
  action      text NOT NULL CHECK (action IN ('remove_listing', 'restore_listing', 'suspend_user', 'reactivate_user', 'dismiss_report', 'resolve_report')),
  reason      text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- TRIGGERS: updated_at auto-update
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- TRIGGER: auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, state, city, locality, pin_code, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(btrim(NEW.raw_user_meta_data->>'full_name'), ''), 'New User'),
    NULLIF(btrim(NEW.raw_user_meta_data->>'phone'), ''),
    NULLIF(btrim(NEW.raw_user_meta_data->>'state'), ''),
    NULLIF(btrim(NEW.raw_user_meta_data->>'city'), ''),
    NULLIF(btrim(NEW.raw_user_meta_data->>'locality'), ''),
    NULLIF(btrim(NEW.raw_user_meta_data->>'pin_code'), ''),
    NEW.raw_user_meta_data->>'avatar_url',
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ language plpgsql SECURITY DEFINER SET search_path = '';

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- TRIGGER: auto-create conversation when request is accepted
-- ============================================================
CREATE OR REPLACE FUNCTION handle_request_accepted()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
    INSERT INTO conversations (request_id)
    VALUES (NEW.id)
    ON CONFLICT DO NOTHING;
    -- Reserve the product
    UPDATE products SET status = 'reserved' WHERE id = NEW.product_id;
  END IF;
  RETURN NEW;
END;
$$ language plpgsql SECURITY DEFINER;

CREATE TRIGGER on_request_accepted
  AFTER UPDATE ON requests
  FOR EACH ROW EXECUTE FUNCTION handle_request_accepted();

-- ============================================================
-- FUNCTION: safely accept a request (prevents race conditions)
-- ============================================================
CREATE OR REPLACE FUNCTION accept_request(p_request_id uuid, p_admin_user_id uuid)
RETURNS json AS $$
DECLARE
  v_request requests%ROWTYPE;
  v_product products%ROWTYPE;
BEGIN
  -- Lock the request row
  SELECT * INTO v_request FROM requests WHERE id = p_request_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Request not found');
  END IF;
  -- Verify caller is the owner
  IF v_request.owner_id != p_admin_user_id THEN
    RETURN json_build_object('success', false, 'error', 'Not authorized');
  END IF;
  -- Check request is still pending
  IF v_request.status != 'pending' THEN
    RETURN json_build_object('success', false, 'error', 'Request is not pending');
  END IF;
  -- Check product is still active
  SELECT * INTO v_product FROM products WHERE id = v_request.product_id FOR UPDATE;
  IF v_product.status != 'active' THEN
    RETURN json_build_object('success', false, 'error', 'Product is no longer available');
  END IF;
  -- Accept request
  UPDATE requests SET status = 'accepted', updated_at = now() WHERE id = p_request_id;
  -- Reject all other pending requests for this product
  UPDATE requests SET status = 'rejected', updated_at = now()
  WHERE product_id = v_request.product_id AND id != p_request_id AND status = 'pending';
  RETURN json_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
