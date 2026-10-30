-- Ensure product categories exist for new and existing Supabase projects.
CREATE TABLE IF NOT EXISTS public.categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL UNIQUE,
  slug        text NOT NULL UNIQUE,
  description text,
  icon        text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.categories (name, slug, description, icon) VALUES
  ('Mobiles, Electronics & Accessories', 'electronics', 'Phones, tablets, chargers, earphones and more', 'Smartphone'),
  ('Clothing, Footwear & Bags', 'clothing', 'Apparel, shoes, bags, and accessories', 'ShoppingBag'),
  ('Books, Stationery & Exam Prep', 'books', 'Books, notebooks, competitive exam material', 'BookOpen'),
  ('Home, Kitchen & Household', 'home-kitchen', 'Utensils, home decor, cleaning supplies', 'Home'),
  ('Furniture & Home Décor', 'furniture', 'Furniture, lighting, and decorative items', 'Sofa'),
  ('Toys, Games & Baby Items', 'toys-baby', 'Toys, board games, baby products', 'Baby'),
  ('Sports & Fitness', 'sports', 'Sports equipment, gym gear, outdoor items', 'Activity'),
  ('Small Appliances', 'appliances', 'Mixers, irons, fans, small kitchen appliances', 'Zap'),
  ('Handicrafts & Art', 'handicrafts', 'Handmade items, craft supplies, art tools', 'Palette'),
  ('Other', 'other', 'Miscellaneous items not fitting any category', 'Package')
ON CONFLICT (slug) DO NOTHING;

GRANT SELECT ON TABLE public.categories TO anon, authenticated;
