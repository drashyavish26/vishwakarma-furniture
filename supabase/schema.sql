-- ============================================================
-- Shree Vishwakarma Foam Mattress and Furniture
-- Supabase PostgreSQL Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- HELPER FUNCTION: is_admin()
-- Checks if the current user has 'owner' role in profiles
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'owner'
  );
END;
$$;

-- ============================================================
-- TABLE: profiles
-- Auto-created on user signup via trigger
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT        NOT NULL,
  role       TEXT        NOT NULL DEFAULT 'owner',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view profiles" ON public.profiles;
CREATE POLICY "Public can view profiles"
  ON public.profiles FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow insert profile on signup" ON public.profiles;
CREATE POLICY "Allow insert profile on signup"
  ON public.profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can manage profiles" ON public.profiles;
CREATE POLICY "Admin can manage profiles"
  ON public.profiles FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Auto-create profile on new Supabase Auth user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, COALESCE(NEW.email, ''), 'owner')
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email, role = 'owner';
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- TABLE: categories
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT        NOT NULL,
  slug          TEXT        UNIQUE NOT NULL,
  description   TEXT,
  image_url     TEXT,
  display_order INT         DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admin can manage categories"
  ON categories FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- Seed default categories
INSERT INTO categories (name, slug, description, display_order) VALUES
  ('Sofa Sets',           'sofa-sets',           'Luxurious sofa sets crafted for comfort and style, available in various fabrics and designs.',           1),
  ('Wooden Beds',         'wooden-beds',         'Beautifully crafted wooden beds combining elegance with durability for your perfect bedroom.',           2),
  ('Sagwan Furniture',    'sagwan-furniture',    'Premium Sagwan (Teak Wood) furniture known for its strength, beauty, and longevity.',                   3),
  ('Dining Tables',       'dining-tables',       'Elegant dining tables in wood and glass designs to bring your family together.',                        4),
  ('Sofa Fabrics',        'sofa-fabrics',        'Premium quality sofa fabrics available in various textures, colors, and patterns.',                     5),
  ('Mattresses',          'mattresses',          'High-comfort foam and spring mattresses for a restful, rejuvenating sleep experience.',                  6),
  ('Customized Furniture','customized-furniture','Bespoke furniture crafted to your exact specifications, dimensions, and design preferences.',            7),
  ('Other Furniture',     'other-furniture',     'Wardrobes, dressers, cabinets, and more furniture pieces for every room.',                              8)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- TABLE: products
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id                      UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                    TEXT        NOT NULL,
  slug                    TEXT        UNIQUE NOT NULL,
  description             TEXT,
  category_id             UUID        REFERENCES categories(id) ON DELETE SET NULL,
  price                   NUMERIC(10, 2),
  material                TEXT,
  sizes                   TEXT[]      DEFAULT '{}',
  colors                  TEXT[]      DEFAULT '{}',
  customization_available BOOLEAN     DEFAULT true,
  is_featured             BOOLEAN     DEFAULT false,
  is_available            BOOLEAN     DEFAULT true,
  display_order           INT         DEFAULT 0,
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admin can manage products"
  ON products FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- ============================================================
-- TABLE: product_images
-- ============================================================
CREATE TABLE IF NOT EXISTS product_images (
  id            UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id    UUID    REFERENCES products(id) ON DELETE CASCADE,
  image_url     TEXT    NOT NULL,
  is_primary    BOOLEAN DEFAULT false,
  display_order INT     DEFAULT 0
);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product images"
  ON product_images FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admin can manage product images"
  ON product_images FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- ============================================================
-- TABLE: projects (Our Work portfolio)
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT        NOT NULL,
  description TEXT,
  image_url   TEXT,
  category    TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admin can manage projects"
  ON projects FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- ============================================================
-- TABLE: site_settings (single row)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id                   INT         PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  business_name        TEXT        DEFAULT 'Shree Vishwakarma Foam Mattress and Furniture',
  phone                TEXT        DEFAULT '+91 98765 43210',
  whatsapp             TEXT        DEFAULT '919876543210',
  address              TEXT        DEFAULT 'Your Business Address, City, State, India',
  instagram            TEXT        DEFAULT 'https://instagram.com/vishwakarma_furniture',
  google_maps_embed_url TEXT       DEFAULT '',
  hero_title           TEXT        DEFAULT 'Crafting Comfort. Designing Elegance.',
  hero_description     TEXT        DEFAULT 'Discover beautifully crafted furniture designed to bring comfort, durability, and elegance to your home.',
  about_description    TEXT        DEFAULT 'Shree Vishwakarma Foam Mattress and Furniture has been crafting premium quality Sagwan (Teak Wood) furniture for discerning homes.',
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site settings"
  ON site_settings FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admin can manage site settings"
  ON site_settings FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- Insert default row
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- STORAGE BUCKETS
-- Run these AFTER creating buckets in Supabase Dashboard:
-- Dashboard → Storage → New Bucket → Name: product-images, Public: ON
-- Dashboard → Storage → New Bucket → Name: category-images, Public: ON
-- Dashboard → Storage → New Bucket → Name: project-images, Public: ON
--
-- Then run these storage policies:
-- ============================================================

-- Product Images bucket policies
CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'product-images');

CREATE POLICY "Admin upload product images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "Admin update product images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "Admin delete product images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'product-images' AND is_admin());

-- Category Images bucket policies
CREATE POLICY "Public read category images"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'category-images');

CREATE POLICY "Admin upload category images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'category-images' AND is_admin());

CREATE POLICY "Admin delete category images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'category-images' AND is_admin());

-- Project Images bucket policies
CREATE POLICY "Public read project images"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'project-images');

CREATE POLICY "Admin upload project images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-images' AND is_admin());

CREATE POLICY "Admin delete project images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'project-images' AND is_admin());

-- ============================================================
-- TABLE PERMISSIONS
-- Grants schema & table access to Supabase client roles (anon & authenticated)
-- ============================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated;
