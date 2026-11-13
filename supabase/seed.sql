-- ====================================================================
-- LOCALROOTS DEMONSTRATION SEED DATA
-- Authentic Indian Artisan and Homemade Businesses
-- Marked explicitly as demo data for seeding
-- ====================================================================

-- 1. SEED CATEGORIES
INSERT INTO public.categories (id, name, slug, description, image_url, display_order)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Pickles & Preserves', 'pickles-preserves', 'Traditional sun-cured pickles, spicy achars, and seasonal fruit preserves.', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80', 1),
  ('c1000000-0000-0000-0000-000000000002', 'Homemade Food', 'homemade-food', 'Freshly cooked home meals, spice blends, thepla, podis, and ready-to-eat delicacies.', 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80', 2),
  ('c1000000-0000-0000-0000-000000000003', 'Snacks & Sweets', 'snacks-sweets', 'Hand-rolled ladoos, namkeen, chakli, mathri, and regional festive sweets.', 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80', 3),
  ('c1000000-0000-0000-0000-000000000004', 'Bakery', 'bakery', 'Home-baked artisanal sourdough breads, brownies, dry fruit tea cakes, and cookies.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80', 4),
  ('c1000000-0000-0000-0000-000000000005', 'Handmade Crafts', 'handmade-crafts', 'Clay pottery, hand-embroidered items, macramé, and crochet works.', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80', 5),
  ('c1000000-0000-0000-0000-000000000006', 'Jewellery', 'jewellery', 'Handcrafted terracotta, polymer clay, silk thread, and silver-finish earrings.', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80', 6),
  ('c1000000-0000-0000-0000-000000000007', 'Clothing', 'clothing', 'Handloom cotton dupattas, khadi kurtas, hand-block printed stoles, and baby wear.', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80', 7),
  ('c1000000-0000-0000-0000-000000000008', 'Home Decor', 'home-decor', 'Hand-poured soy wax candles, brass diyas, hand-painted coasters, and wall hangings.', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80', 8),
  ('c1000000-0000-0000-0000-000000000009', 'Customized Gifts', 'customized-gifts', 'Handwritten calligraphy gift hampers, curated festival boxes, and resin art.', 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&auto=format&fit=crop&q=80', 9),
  ('c1000000-0000-0000-0000-000000000010', 'Other Products', 'other-products', 'Organic gardening saplings, handcrafted soaps, cold-pressed oils, and herbal powders.', 'https://images.unsplash.com/photo-1608248597359-0098f918e9d3?w=600&auto=format&fit=crop&q=80', 10)
ON CONFLICT (slug) DO NOTHING;

-- 2. SEED AUTH USERS & PROFILES (for Demo Sellers & Admin)
-- Passwords in demo: "Seller@123" and "Admin@123"
INSERT INTO public.profiles (id, email, full_name, phone_number, role)
VALUES
  ('u1000000-0000-0000-0000-000000000001', 'amma@localroots.in', 'Sunita Devi (Amma)', '9845123456', 'seller'),
  ('u1000000-0000-0000-0000-000000000002', 'priya@localroots.in', 'Priya Sharma', '9820123456', 'seller'),
  ('u1000000-0000-0000-0000-000000000003', 'anu@localroots.in', 'Anu Nair', '9847123456', 'seller'),
  ('u9000000-0000-0000-0000-000000000001', 'admin@localroots.in', 'Platform Administrator', '9900099000', 'admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.admin_roles (user_id, permissions)
VALUES ('u9000000-0000-0000-0000-000000000001', '["all"]'::jsonb)
ON CONFLICT (user_id) DO NOTHING;

-- 3. SEED SELLER PROFILES
INSERT INTO public.seller_profiles (
  id, user_id, business_name, slug, description, story, business_category,
  logo_url, banner_url, phone_number, address_line, locality, city, state, pin_code,
  is_approved, is_active, pickup_available, min_order_value, default_delivery_charge, free_delivery_threshold, estimated_delivery_time
) VALUES
  (
    's1000000-0000-0000-0000-000000000001',
    'u1000000-0000-0000-0000-000000000001',
    'Amma''s Homemade Pickles',
    'ammas-homemade-pickles',
    'Generational heirloom recipes made with cold-pressed mustard oil, sun-cured spices, and zero chemical preservatives.',
    'I started preparing pickles over 35 years ago learning from my grandmother in rural Rajasthan. Each jar of pickle is made in small batches on our sunny terrace using organic spices ground by hand.',
    'Pickles & Preserves',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1200&auto=format&fit=crop&q=80',
    '9845123456',
    'Flat 302, Tulsi Vihar, 14th Main',
    'Indiranagar',
    'Bengaluru',
    'Karnataka',
    '560038',
    true,
    true,
    true,
    150.00,
    40.00,
    500.00,
    '1-2 Days'
  ),
  (
    's1000000-0000-0000-0000-000000000002',
    'u1000000-0000-0000-0000-000000000002',
    'Homemade Treats',
    'homemade-treats',
    'Fudgy couverture brownies, soft-baked cookies, and whole-wheat dry fruit tea cakes baked fresh upon every order.',
    'Baking was my weekend therapy while working as a graphic designer. In 2022, I decided to turn my passion for honest ingredients — real butter, Belgian cocoa, no artificial essences — into Homemade Treats.',
    'Bakery',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=80',
    '9820123456',
    'Plot 45, Sea View Enclave, Hill Road',
    'Bandra West',
    'Mumbai',
    'Maharashtra',
    '400050',
    true,
    true,
    true,
    200.00,
    50.00,
    600.00,
    'Same Day (orders before 2 PM)'
  ),
  (
    's1000000-0000-0000-0000-000000000003',
    'u1000000-0000-0000-0000-000000000003',
    'Handmade by Anu',
    'handmade-by-anu',
    'Handcrafted terracotta jewellery, bespoke crochet keychains, and eco-friendly block-printed cotton utility bags.',
    'Every craft piece is hand-kneaded, shaped, sun-dried, and kiln-fired by myself with natural earthenware clay. We take pride in zero-plastic packaging and sustainable Kerala craft heritage.',
    'Handmade Crafts',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=80',
    '9847123456',
    'Green Pastures, Panampilly Nagar',
    'Kadavanthra',
    'Kochi',
    'Kerala',
    '682020',
    true,
    true,
    false,
    100.00,
    30.00,
    450.00,
    '2-3 Days'
  )
ON CONFLICT (slug) DO NOTHING;

-- 4. SEED PRODUCTS
-- Amma's Homemade Pickles: Mango (₹150), Lemon (₹120), Mixed Veg (₹180)
INSERT INTO public.products (
  id, seller_id, category_id, name, description, price, mrp, stock_quantity, min_order_quantity,
  ingredients_or_materials, preparation_time, is_active, is_popular, is_freshly_made
) VALUES
  (
    'p1000000-0000-0000-0000-000000000001',
    's1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'Authentic Rajasthani Mango Pickle (Aam Ka Achar)',
    'Sun-cured raw Rajapuri mango chunks marinated with crushed fenugreek seeds, mustard seeds, and kachi ghani cold-pressed mustard oil. Matured under natural sunlight for 14 days.',
    150.00,
    180.00,
    45,
    1,
    'Raw Rajapuri Mango, Cold-Pressed Mustard Oil, Fenugreek Seeds, Yellow Mustard, Fennel, Turmeric, Salt, Asafoetida (Hing)',
    'Sun-matured 14 days, Ready to ship',
    true,
    true,
    true
  ),
  (
    'p1000000-0000-0000-0000-000000000002',
    's1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'Zesty Sun-Dried Lemon Pickle (Nimbu Ka Achar)',
    'Tangy paper-thin kagzi lemons cured naturally in their own juice with rock salt, ajwain, and freshly pounded black pepper. Completely oil-free digestive pickle.',
    120.00,
    140.00,
    30,
    1,
    'Thin-Skinned Kagzi Lemons, Rock Salt, Carom Seeds (Ajwain), Roasted Cumin, Black Pepper, Red Chilli Powder',
    'Matured for 21 days',
    true,
    false,
    true
  ),
  (
    'p1000000-0000-0000-0000-000000000003',
    's1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'Crunchy Mixed Vegetable Pickle (Gobhi Gajar Shalgam)',
    'Winter special crunchy cauliflower florets, red carrots, and tender turnips tossed in aromatic mustard masala with a hint of organic jaggery and vinegar.',
    180.00,
    210.00,
    25,
    1,
    'Farm Fresh Cauliflower, Red Delhi Carrots, Turnips, Green Chillies, Pure Mustard Oil, Jaggery, Spices',
    'Fresh winter batch',
    true,
    true,
    true
  ),

  -- Homemade Treats: Chocolate Brownies (₹200), Cookies (₹100), Banana Cake (₹250)
  (
    'p1000000-0000-0000-0000-000000000004',
    's1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000004',
    'Dark Chocolate Fudgy Brownies (Pack of 4)',
    'Ultra-fudgy Belgian dark chocolate squares with crackly crinkle tops and rich gooey centers. Made using pure farm butter and 55% cocoa couverture chocolate.',
    200.00,
    240.00,
    20,
    1,
    'Belgian Couverture Chocolate, Unsalted Farm Butter, Brown Sugar, Organic Flour, Free-Range Eggs, Vanilla Extract',
    'Freshly baked within 4 hours of order',
    true,
    true,
    true
  ),
  (
    'p1000000-0000-0000-0000-000000000005',
    's1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000004',
    'Homemade Butter Cookies (Pack of 6)',
    'Crisp, melt-in-mouth traditional butter shortbread cookies dusted with cardamom and chopped pistachio nuts. No palm oil, no artificial flavorings.',
    100.00,
    120.00,
    35,
    1,
    'Fresh Butter, Roasted Cardamom, Crushed Iranian Pistachios, Wheat Flour, Castor Sugar',
    'Baked daily morning',
    true,
    false,
    true
  ),
  (
    'p1000000-0000-0000-0000-000000000006',
    's1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000004',
    'Moist Walnut Banana Tea Cake (500g)',
    'Naturally sweetened with ripe organic Robusta bananas and studded with crunchy Kashmiri walnuts. Warm, fragrant, and perfect with evening chai.',
    250.00,
    290.00,
    15,
    1,
    'Ripe Robusta Bananas, Kashmiri Walnuts, Whole Wheat Flour, Cold Pressed Coconut Oil, Raw Jaggery, Cinnamon',
    'Baked fresh to order',
    true,
    true,
    true
  ),

  -- Handmade by Anu: Handmade Earrings (₹120), Crochet Keychains (₹80), Handmade Bags (₹350)
  (
    'p1000000-0000-0000-0000-000000000007',
    's1000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000006',
    'Handmade Terracotta Lotus Jhumka Earrings',
    'Lightweight, kiln-fired natural clay jhumkas hand-painted in traditional earthy terracotta and antique gold highlights with hypoallergenic brass hooks.',
    120.00,
    160.00,
    28,
    1,
    'Natural River Terracotta Clay, Non-Toxic Acrylic Colors, Protective Gloss Sealant, Nickel-Free Brass Ear Hooks',
    'Handcrafted, 1 day handling',
    true,
    true,
    true
  ),
  (
    'p1000000-0000-0000-0000-000000000008',
    's1000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000005',
    'Mini Amigurumi Crochet Sunflower Keychain',
    'Charming hand-crocheted bright yellow sunflower charm with embroidered detailing and sturdy stainless steel keyring clasp. Washable and durable.',
    80.00,
    110.00,
    50,
    1,
    '100% Mercerized Cotton Yarn, Recycled Polyester Fiber Filling, Stainless Steel Ring',
    'Hand-stitched',
    true,
    true,
    true
  ),
  (
    'p1000000-0000-0000-0000-000000000009',
    's1000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000007',
    'Hand-Block Printed Cotton Canvas Tote Bag',
    'Heavy-duty 100% natural cotton canvas shoulder tote with inner pocket and zipper, stamped with traditional floral wooden blocks using vegetable dyes.',
    350.00,
    420.00,
    18,
    1,
    'Unbleached Heavy Cotton Canvas (380 GSM), Natural Indigo & Madder Dyes, YKK Metal Zipper',
    'Crafted by local artisan collective',
    true,
    true,
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 5. SEED PRODUCT IMAGES
INSERT INTO public.product_images (product_id, image_url, is_primary, display_order)
VALUES
  -- Mango Pickle
  ('p1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80', true, 1),
  ('p1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80', false, 2),
  -- Lemon Pickle
  ('p1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=800&auto=format&fit=crop&q=80', true, 1),
  -- Mixed Vegetable Pickle
  ('p1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80', true, 1),
  -- Brownies
  ('p1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80', true, 1),
  ('p1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1515037893149-de7f840978e2?w=800&auto=format&fit=crop&q=80', false, 2),
  -- Cookies
  ('p1000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&auto=format&fit=crop&q=80', true, 1),
  -- Banana Cake
  ('p1000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80', true, 1),
  -- Terracotta Earrings
  ('p1000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80', true, 1),
  -- Crochet Keychain
  ('p1000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80', true, 1),
  -- Tote Bag
  ('p1000000-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80', true, 1)
ON CONFLICT (id) DO NOTHING;

-- 6. SEED SELLER DELIVERY AREAS (Serviceable PIN Codes)
-- Amma: Bengaluru PINs (560038, 560001, 560034, 560076, 560068, 560100)
INSERT INTO public.seller_delivery_areas (seller_id, pin_code, locality_name, city, delivery_charge, is_active)
VALUES
  ('s1000000-0000-0000-0000-000000000001', '560038', 'Indiranagar', 'Bengaluru', 30.00, true),
  ('s1000000-0000-0000-0000-000000000001', '560001', 'MG Road / Brigade', 'Bengaluru', 40.00, true),
  ('s1000000-0000-0000-0000-000000000001', '560034', 'Koramangala', 'Bengaluru', 35.00, true),
  ('s1000000-0000-0000-0000-000000000001', '560076', 'BTM Layout', 'Bengaluru', 40.00, true),
  ('s1000000-0000-0000-0000-000000000001', '560068', 'Madivala / Electronic City', 'Bengaluru', 45.00, true),
  ('s1000000-0000-0000-0000-000000000001', '560100', 'Electronic City Phase 1', 'Bengaluru', 45.00, true),

  -- Homemade Treats: Mumbai PINs (400050, 400053, 400001, 400016, 400052)
  ('s1000000-0000-0000-0000-000000000002', '400050', 'Bandra West', 'Mumbai', 40.00, true),
  ('s1000000-0000-0000-0000-000000000002', '400053', 'Andheri West', 'Mumbai', 50.00, true),
  ('s1000000-0000-0000-0000-000000000002', '400001', 'Fort / Colaba', 'Mumbai', 60.00, true),
  ('s1000000-0000-0000-0000-000000000002', '400016', 'Mahim', 'Mumbai', 45.00, true),
  ('s1000000-0000-0000-0000-000000000002', '400052', 'Khar West', 'Mumbai', 40.00, true),

  -- Handmade by Anu: Kochi & All-India courier PINs (682020, 682001, 560038, 400050, 110001)
  ('s1000000-0000-0000-0000-000000000003', '682020', 'Kadavanthra', 'Kochi', 25.00, true),
  ('s1000000-0000-0000-0000-000000000003', '682001', 'Fort Kochi', 'Kochi', 30.00, true),
  ('s1000000-0000-0000-0000-000000000003', '560038', 'Pan-India Delivery (BLR)', 'Bengaluru', 40.00, true),
  ('s1000000-0000-0000-0000-000000000003', '400050', 'Pan-India Delivery (BOM)', 'Mumbai', 40.00, true),
  ('s1000000-0000-0000-0000-000000000003', '110001', 'Pan-India Delivery (DEL)', 'New Delhi', 50.00, true)
ON CONFLICT (seller_id, pin_code) DO NOTHING;

-- 7. SEED TIME SLOTS
INSERT INTO public.delivery_time_slots (seller_id, slot_name, day_of_week)
VALUES
  ('s1000000-0000-0000-0000-000000000001', 'Morning (9:00 AM - 1:00 PM)', 'All Days'),
  ('s1000000-0000-0000-0000-000000000001', 'Evening (4:00 PM - 8:00 PM)', 'All Days'),
  ('s1000000-0000-0000-0000-000000000002', 'Afternoon Dispatch (1:00 PM - 4:00 PM)', 'All Days'),
  ('s1000000-0000-0000-0000-000000000002', 'Evening Fresh Batch (6:00 PM - 9:00 PM)', 'All Days'),
  ('s1000000-0000-0000-0000-000000000003', 'Standard Courier (10:00 AM - 6:00 PM)', 'Monday to Saturday');

-- 8. SEED REVIEWS
INSERT INTO public.reviews (product_id, seller_id, customer_name, rating, comment, is_verified_purchase)
VALUES
  ('p1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', 'Ritu K.', 5, 'Reminds me exactly of the achar my dadi used to make in ceramic barnis. The mustard oil smell is so pure!', true),
  ('p1000000-0000-0000-0000-000000000004', 's1000000-0000-0000-0000-000000000002', 'Devendra M.', 5, 'Best brownies in Bandra hands down! Gooey, rich, and not overly sweet. Delivered still slightly warm.', true),
  ('p1000000-0000-0000-0000-000000000007', 's1000000-0000-0000-0000-000000000003', 'Shalini P.', 5, 'The terracotta earrings are feather-light and beautifully painted. Got so many compliments during Diwali!', true);
