-- ============================================================
-- Reuse Before Return — Seed Data (Development Only)
-- DO NOT run in production
-- ============================================================

-- Note: Demo users must be created via Supabase Auth first.
-- Run the seed script (scripts/create-demo-users.js) to create
-- auth users, then this SQL will populate their profiles and listings.

-- ============================================================
-- DEMO PROFILES (match these UUIDs with auth users created by script)
-- ============================================================
INSERT INTO profiles (id, full_name, city, locality, state, pin_code, latitude, longitude, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Arjun Reddy',      'Hyderabad', 'Madhapur',    'Telangana',      '500081', 17.4486, 78.3908, 'user'),
  ('22222222-2222-2222-2222-222222222222', 'Priya Sharma',     'Hyderabad', 'Gachibowli',  'Telangana',      '500032', 17.4401, 78.3489, 'user'),
  ('33333333-3333-3333-3333-333333333333', 'Karthik Nair',     'Bengaluru', 'Indiranagar', 'Karnataka',      '560038', 12.9784, 77.6408, 'user'),
  ('44444444-4444-4444-4444-444444444444', 'Meera Iyer',       'Chennai',   'Adyar',       'Tamil Nadu',     '600020', 13.0012, 80.2565, 'user'),
  ('55555555-5555-5555-5555-555555555555', 'Rahul Gupta',      'Mumbai',    'Andheri West','Maharashtra',    '400053', 19.1364, 72.8296, 'user'),
  ('66666666-6666-6666-6666-666666666666', 'Anjali Verma',     'Delhi',     'Dwarka',      'Delhi',          '110075', 28.5921, 77.0460, 'user'),
  ('77777777-7777-7777-7777-777777777777', 'Siddharth Rao',    'Hyderabad', 'Kukatpally',  'Telangana',      '500072', 17.4849, 78.4138, 'user'),
  ('88888888-8888-8888-8888-888888888888', 'Admin User',       'Hyderabad', 'Banjara Hills','Telangana',     '500034', 17.4156, 78.4347, 'admin')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- DEMO PRODUCT LISTINGS
-- ============================================================
INSERT INTO products (id, owner_id, title, description, category_id, condition, listing_type, price, original_price, brand, state, city, locality, pin_code, latitude, longitude, pickup_preference, status) VALUES

-- Hyderabad listings
('p1111111-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
  'OnePlus Nord Charger (65W) — Duplicate',
  'Received a duplicate charger when I bought a new phone. Brand new, unopened in original packaging. Works with OnePlus, Oppo, and other USB-C phones.',
  (SELECT id FROM categories WHERE slug='electronics'), 'new_unopened', 'free', NULL, 1499.00, 'OnePlus',
  'Telangana', 'Hyderabad', 'Madhapur', '500081', 17.4486, 78.3908, 'public_place', 'active'),

('p1111111-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222',
  'JBL Earphones — Wrong size ear tips',
  'Bought these for running but they don''t fit my ears. Used once. Comes with all original accessories and box.',
  (SELECT id FROM categories WHERE slug='electronics'), 'like_new', 'resale', 499.00, 1499.00, 'JBL',
  'Telangana', 'Hyderabad', 'Gachibowli', '500032', 17.4401, 78.3489, 'gate', 'active'),

('p1111111-0000-0000-0000-000000000003', '77777777-7777-7777-7777-777777777777',
  'Prestige Pressure Cooker 3L — Duplicate Gift',
  'Got as a wedding gift but already have one. Never opened, sealed. Original Prestige box.',
  (SELECT id FROM categories WHERE slug='home-kitchen'), 'new_unopened', 'resale', 799.00, 1899.00, 'Prestige',
  'Telangana', 'Hyderabad', 'Kukatpally', '500072', 17.4849, 78.4138, 'public_place', 'active'),

('p1111111-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111',
  'Class 10 NCERT Science Books (Set of 5)',
  'Complete set of Class 10 NCERT books — Science, Maths, Social, Hindi, English. In good condition. Son finished his board exams.',
  (SELECT id FROM categories WHERE slug='books'), 'gently_used', 'free', NULL, 450.00, 'NCERT',
  'Telangana', 'Hyderabad', 'Madhapur', '500081', 17.4486, 78.3908, 'public_place', 'active'),

('p1111111-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222',
  'Philips Hair Dryer — Gifted duplicate',
  'Got a new one as a birthday gift. This one still works perfectly. About 8 months old. Original box available.',
  (SELECT id FROM categories WHERE slug='appliances'), 'gently_used', 'resale', 399.00, 1299.00, 'Philips',
  'Telangana', 'Hyderabad', 'Gachibowli', '500032', 17.4401, 78.3489, 'arrange_after', 'active'),

-- Bengaluru listings
('p1111111-0000-0000-0000-000000000006', '33333333-3333-3333-3333-333333333333',
  'Peter England Formal Shirt (42) — Wrong size',
  'Ordered online, wrong size delivered. Brand new with tags. Light blue, full sleeve formal shirt. Size 42.',
  (SELECT id FROM categories WHERE slug='clothing'), 'new_unopened', 'resale', 399.00, 1199.00, 'Peter England',
  'Karnataka', 'Bengaluru', 'Indiranagar', '560038', 12.9784, 77.6408, 'public_place', 'active'),

('p1111111-0000-0000-0000-000000000007', '33333333-3333-3333-3333-333333333333',
  'Yoga Mat (6mm) — Barely Used',
  'Started yoga, then gym membership came and I use that instead. Mat is clean, 6mm thick, good grip.',
  (SELECT id FROM categories WHERE slug='sports'), 'like_new', 'resale', 299.00, 799.00, NULL,
  'Karnataka', 'Bengaluru', 'Whitefield', '560066', 12.9698, 77.7499, 'public_place', 'active'),

-- Chennai listings
('p1111111-0000-0000-0000-000000000008', '44444444-4444-4444-4444-444444444444',
  'Milton Water Bottle 1L — Wrong colour',
  'Ordered red, got blue. Unopened. Leak-proof, BPA free. Perfect for office or gym.',
  (SELECT id FROM categories WHERE slug='home-kitchen'), 'new_unopened', 'free', NULL, 349.00, 'Milton',
  'Tamil Nadu', 'Chennai', 'Adyar', '600020', 13.0012, 80.2565, 'gate', 'active'),

('p1111111-0000-0000-0000-000000000009', '44444444-4444-4444-4444-444444444444',
  'Osho Books Collection (8 books)',
  'Set of 8 Osho books. Read once. Good spiritual reading. Includes: The Book of Secrets, Courage, Joy, and more.',
  (SELECT id FROM categories WHERE slug='books'), 'gently_used', 'free', NULL, 1200.00, 'Osho',
  'Tamil Nadu', 'Chennai', 'Velachery', '600042', 12.9805, 80.2213, 'public_place', 'active'),

-- Mumbai listings
('p1111111-0000-0000-0000-000000000010', '55555555-5555-5555-5555-555555555555',
  'Skybags Backpack 30L — Wrong colour ordered',
  'Ordered black, received grey. Still in original packaging. Good quality, many compartments. Ideal for college or travel.',
  (SELECT id FROM categories WHERE slug='clothing'), 'new_unopened', 'resale', 599.00, 1899.00, 'Skybags',
  'Maharashtra', 'Mumbai', 'Andheri West', '400053', 19.1364, 72.8296, 'gate', 'active'),

('p1111111-0000-0000-0000-000000000011', '55555555-5555-5555-5555-555555555555',
  'BoAt Bluetooth Speaker — Upgrade',
  'Upgrading to a larger speaker. This works perfectly, good sound for its size. About 6 months old.',
  (SELECT id FROM categories WHERE slug='electronics'), 'gently_used', 'resale', 699.00, 1999.00, 'Boát',
  'Maharashtra', 'Mumbai', 'Powai', '400076', 19.1136, 72.9083, 'public_place', 'active'),

-- Delhi listings
('p1111111-0000-0000-0000-000000000012', '66666666-6666-6666-6666-666666666666',
  'Lego Duplo Set — Age inappropriate gift',
  'Received as a gift for my 8-year-old but too young for him. Complete set, all pieces present. Age 2-5.',
  (SELECT id FROM categories WHERE slug='toys-baby'), 'like_new', 'free', NULL, 1500.00, 'Lego',
  'Delhi', 'Delhi', 'Dwarka', '110075', 28.5921, 77.0460, 'public_place', 'active'),

('p1111111-0000-0000-0000-000000000013', '66666666-6666-6666-6666-666666666666',
  'Wildcraft Trekking Shoes Size 9 — Wrong size',
  'Ordered size 9, turns out my feet are 10. Tried once inside house. Very good quality shoes.',
  (SELECT id FROM categories WHERE slug='clothing'), 'like_new', 'resale', 899.00, 2499.00, 'Wildcraft',
  'Delhi', 'Delhi', 'Rohini', '110085', 28.7041, 77.1025, 'public_place', 'active'),

-- More Hyderabad
('p1111111-0000-0000-0000-000000000014', '77777777-7777-7777-7777-777777777777',
  'Kurti Set (M) — Wrong size',
  'Ordered from Myntra, wrong size. Brand new with tags. Beautiful floral print kurti with palazzo. Rajasthani block print.',
  (SELECT id FROM categories WHERE slug='clothing'), 'new_unopened', 'resale', 349.00, 849.00, NULL,
  'Telangana', 'Hyderabad', 'KPHB Colony', '500072', 17.4900, 78.3900, 'gate', 'active'),

('p1111111-0000-0000-0000-000000000015', '11111111-1111-1111-1111-111111111111',
  'Laptop Stand — Switched to standing desk',
  'Bought a full standing desk setup. This portable laptop stand is in great condition. Adjustable height. Folds flat.',
  (SELECT id FROM categories WHERE slug='electronics'), 'gently_used', 'free', NULL, 799.00, NULL,
  'Telangana', 'Hyderabad', 'Hitech City', '500081', 17.4504, 78.3848, 'public_place', 'active'),

('p1111111-0000-0000-0000-000000000016', '22222222-2222-2222-2222-222222222222',
  'Catan Board Game (Complete)',
  'The Settlers of Catan — complete set, all cards and pieces present. Played 3-4 times only. Great family game.',
  (SELECT id FROM categories WHERE slug='toys-baby'), 'like_new', 'resale', 699.00, 2200.00, 'Catan',
  'Telangana', 'Hyderabad', 'Kondapur', '500084', 17.4600, 78.3600, 'arrange_after', 'active'),

('p1111111-0000-0000-0000-000000000017', '77777777-7777-7777-7777-777777777777',
  'Kitchen Rack (Stainless Steel, 3-tier)',
  'Moving to a smaller flat. This rack doesn''t fit the new kitchen. Good quality, no rust. Self-collection from ground floor.',
  (SELECT id FROM categories WHERE slug='furniture'), 'gently_used', 'free', NULL, 1299.00, NULL,
  'Telangana', 'Hyderabad', 'Kukatpally', '500072', 17.4849, 78.4138, 'gate', 'active'),

('p1111111-0000-0000-0000-000000000018', '33333333-3333-3333-3333-333333333333',
  'Morphy Richards Iron — Gifted upgrade',
  'Received a new steam iron as a gift. This dry iron works well. About 2 years old, no issues.',
  (SELECT id FROM categories WHERE slug='appliances'), 'used_functional', 'free', NULL, 799.00, 'Morphy Richards',
  'Karnataka', 'Bengaluru', 'Indiranagar', '560038', 12.9784, 77.6408, 'public_place', 'active'),

-- Reserved example
('p1111111-0000-0000-0000-000000000019', '44444444-4444-4444-4444-444444444444',
  'Adidas Running Shoes (Size 8) — Reserved',
  'Lightly used, about 10 runs only. Replaced by trail shoes. Good cushioning, no wear on sole.',
  (SELECT id FROM categories WHERE slug='sports'), 'like_new', 'resale', 1299.00, 3499.00, 'Adidas',
  'Tamil Nadu', 'Chennai', 'Adyar', '600020', 13.0012, 80.2565, 'public_place', 'reserved'),

-- Completed example
('p1111111-0000-0000-0000-000000000020', '55555555-5555-5555-5555-555555555555',
  'Philips Air Fryer (Redistributed)',
  'Upgraded to a larger model. This smaller one works great for a single person or couple.',
  (SELECT id FROM categories WHERE slug='appliances'), 'gently_used', 'free', NULL, 8999.00, 'Philips',
  'Maharashtra', 'Mumbai', 'Andheri West', '400053', 19.1364, 72.8296, 'gate', 'completed')

ON CONFLICT DO NOTHING;

-- ============================================================
-- DEMO REQUESTS
-- ============================================================
INSERT INTO requests (id, product_id, requester_id, owner_id, message, status) VALUES
  ('r1111111-0000-0000-0000-000000000001',
   'p1111111-0000-0000-0000-000000000001',
   '22222222-2222-2222-2222-222222222222',
   '11111111-1111-1111-1111-111111111111',
   'Hi! I just got a new OnePlus phone and would love this charger. I can meet at Madhapur Metro Station.',
   'pending'),
  ('r1111111-0000-0000-0000-000000000002',
   'p1111111-0000-0000-0000-000000000020',
   '77777777-7777-7777-7777-777777777777',
   '55555555-5555-5555-5555-555555555555',
   'Would love the air fryer for my family. Can pick up anytime this weekend.',
   'completed')
ON CONFLICT DO NOTHING;

-- ============================================================
-- DEMO CONVERSATION + MESSAGES
-- ============================================================
INSERT INTO conversations (id, request_id) VALUES
  ('c1111111-0000-0000-0000-000000000001', 'r1111111-0000-0000-0000-000000000002')
ON CONFLICT DO NOTHING;

INSERT INTO messages (conversation_id, sender_id, message_text) VALUES
  ('c1111111-0000-0000-0000-000000000001', '55555555-5555-5555-5555-555555555555', 'Hi! Your request has been accepted. When can you come pick it up?'),
  ('c1111111-0000-0000-0000-000000000001', '77777777-7777-7777-7777-777777777777', 'Great! I can come Saturday afternoon around 3pm. Is that okay?'),
  ('c1111111-0000-0000-0000-000000000001', '55555555-5555-5555-5555-555555555555', 'Saturday 3pm works perfectly. I''ll be at the gate. Please call when you arrive.')
ON CONFLICT DO NOTHING;

-- ============================================================
-- DEMO NOTIFICATIONS
-- ============================================================
INSERT INTO notifications (user_id, type, title, message, related_entity_id, related_entity_type) VALUES
  ('11111111-1111-1111-1111-111111111111', 'new_request', 'New request for your listing', 'Priya Sharma is interested in your OnePlus Charger listing.', 'r1111111-0000-0000-0000-000000000001', 'request')
ON CONFLICT DO NOTHING;
