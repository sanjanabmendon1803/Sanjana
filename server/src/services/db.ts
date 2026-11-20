import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { config } from '../config';
import {
  Category,
  Product,
  ProductImage,
  SellerProfile,
  SellerDeliveryArea,
  DeliveryTimeSlot,
  Order,
  SellerSuborder,
  OrderItem,
  OrderStatusHistoryEntry,
  Review,
  SuborderStatus,
  UserProfile,
} from '../types';

// In-Memory Seed Storage (Ensures 100% functionality out of the box before or alongside Supabase credentials)
let categoriesStore: Category[] = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    name: 'Pickles & Preserves',
    slug: 'pickles-preserves',
    description: 'Traditional sun-cured pickles, spicy achars, and seasonal fruit preserves.',
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
    display_order: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000002',
    name: 'Homemade Food',
    slug: 'homemade-food',
    description: 'Freshly cooked home meals, spice blends, thepla, podis, and ready-to-eat delicacies.',
    image_url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80',
    display_order: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    name: 'Snacks & Sweets',
    slug: 'snacks-sweets',
    description: 'Hand-rolled ladoos, namkeen, chakli, mathri, and regional festive sweets.',
    image_url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80',
    display_order: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000004',
    name: 'Bakery',
    slug: 'bakery',
    description: 'Home-baked artisanal sourdough breads, brownies, dry fruit tea cakes, and cookies.',
    image_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    display_order: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000005',
    name: 'Handmade Crafts',
    slug: 'handmade-crafts',
    description: 'Clay pottery, hand-embroidered items, macramé, and crochet works.',
    image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
    display_order: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000006',
    name: 'Jewellery',
    slug: 'jewellery',
    description: 'Handcrafted terracotta, polymer clay, silk thread, and silver-finish earrings.',
    image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80',
    display_order: 6,
    created_at: new Date().toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000007',
    name: 'Clothing',
    slug: 'clothing',
    description: 'Handloom cotton dupattas, khadi kurtas, hand-block printed stoles, and baby wear.',
    image_url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600&auto=format&fit=crop&q=80',
    display_order: 7,
    created_at: new Date().toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000008',
    name: 'Home Decor',
    slug: 'home-decor',
    description: 'Hand-poured soy wax candles, brass diyas, hand-painted coasters, and wall hangings.',
    image_url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80',
    display_order: 8,
    created_at: new Date().toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000009',
    name: 'Customized Gifts',
    slug: 'customized-gifts',
    description: 'Handwritten calligraphy gift hampers, curated festival boxes, and resin art.',
    image_url: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=600&auto=format&fit=crop&q=80',
    display_order: 9,
    created_at: new Date().toISOString(),
  },
  {
    id: 'c1000000-0000-0000-0000-000000000010',
    name: 'Other Products',
    slug: 'other-products',
    description: 'Organic gardening saplings, handcrafted soaps, cold-pressed oils, and herbal powders.',
    image_url: 'https://images.unsplash.com/photo-1608248597359-0098f918e9d3?w=600&auto=format&fit=crop&q=80',
    display_order: 10,
    created_at: new Date().toISOString(),
  },
];

let sellersStore: SellerProfile[] = [
  {
    id: 's1000000-0000-0000-0000-000000000001',
    user_id: 'u1000000-0000-0000-0000-000000000001',
    business_name: "Amma's Homemade Pickles",
    slug: 'ammas-homemade-pickles',
    description: 'Generational heirloom recipes made with cold-pressed mustard oil, sun-cured spices, and zero chemical preservatives.',
    story: 'I started preparing pickles over 35 years ago learning from my grandmother in rural Rajasthan. Each jar of pickle is made in small batches on our sunny terrace using organic spices ground by hand.',
    business_category: 'Pickles & Preserves',
    logo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1200&auto=format&fit=crop&q=80',
    phone_number: '9845123456',
    address_line: 'Flat 302, Tulsi Vihar, 14th Main',
    locality: 'Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pin_code: '560038',
    is_approved: true,
    is_active: true,
    pickup_available: true,
    min_order_value: 150.00,
    default_delivery_charge: 40.00,
    free_delivery_threshold: 500.00,
    estimated_delivery_time: '1-2 Days',
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 's1000000-0000-0000-0000-000000000002',
    user_id: 'u1000000-0000-0000-0000-000000000002',
    business_name: 'Homemade Treats',
    slug: 'homemade-treats',
    description: 'Fudgy couverture brownies, soft-baked cookies, and whole-wheat dry fruit tea cakes baked fresh upon every order.',
    story: 'Baking was my weekend therapy while working as a graphic designer. In 2022, I decided to turn my passion for honest ingredients — real butter, Belgian cocoa, no artificial essences — into Homemade Treats.',
    business_category: 'Bakery',
    logo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=80',
    phone_number: '9820123456',
    address_line: 'Plot 45, Sea View Enclave, Hill Road',
    locality: 'Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pin_code: '400050',
    is_approved: true,
    is_active: true,
    pickup_available: true,
    min_order_value: 200.00,
    default_delivery_charge: 50.00,
    free_delivery_threshold: 600.00,
    estimated_delivery_time: 'Same Day (orders before 2 PM)',
    created_at: '2026-02-15T11:00:00Z',
    updated_at: '2026-02-15T11:00:00Z',
  },
  {
    id: 's1000000-0000-0000-0000-000000000003',
    user_id: 'u1000000-0000-0000-0000-000000000003',
    business_name: 'Handmade by Anu',
    slug: 'handmade-by-anu',
    description: 'Handcrafted terracotta jewellery, bespoke crochet keychains, and eco-friendly block-printed cotton utility bags.',
    story: 'Every craft piece is hand-kneaded, shaped, sun-dried, and kiln-fired by myself with natural earthenware clay. We take pride in zero-plastic packaging and sustainable Kerala craft heritage.',
    business_category: 'Handmade Crafts',
    logo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=80',
    phone_number: '9847123456',
    address_line: 'Green Pastures, Panampilly Nagar',
    locality: 'Kadavanthra',
    city: 'Kochi',
    state: 'Kerala',
    pin_code: '682020',
    is_approved: true,
    is_active: true,
    pickup_available: false,
    min_order_value: 100.00,
    default_delivery_charge: 30.00,
    free_delivery_threshold: 450.00,
    estimated_delivery_time: '2-3 Days',
    created_at: '2026-03-01T09:00:00Z',
    updated_at: '2026-03-01T09:00:00Z',
  },
];

let productsStore: Product[] = [
  {
    id: 'p1000000-0000-0000-0000-000000000001',
    seller_id: 's1000000-0000-0000-0000-000000000001',
    category_id: 'c1000000-0000-0000-0000-000000000001',
    name: 'Authentic Rajasthani Mango Pickle (Aam Ka Achar)',
    description: 'Sun-cured raw Rajapuri mango chunks marinated with crushed fenugreek seeds, yellow mustard, and kachi ghani cold-pressed mustard oil. Matured under natural sunlight for 14 days in ceramic jars.',
    price: 150.00,
    mrp: 180.00,
    stock_quantity: 45,
    min_order_quantity: 1,
    ingredients_or_materials: 'Raw Rajapuri Mango, Cold-Pressed Mustard Oil, Fenugreek Seeds, Yellow Mustard, Fennel, Turmeric, Rock Salt, Asafoetida (Hing)',
    preparation_time: 'Sun-matured 14 days, Ready to ship',
    is_active: true,
    is_popular: true,
    is_freshly_made: true,
    created_at: '2026-01-12T10:00:00Z',
    updated_at: '2026-01-12T10:00:00Z',
    images: [
      {
        id: 'img-1',
        product_id: 'p1000000-0000-0000-0000-000000000001',
        image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
        is_primary: true,
        display_order: 1,
        created_at: '2026-01-12T10:00:00Z',
      },
      {
        id: 'img-1b',
        product_id: 'p1000000-0000-0000-0000-000000000001',
        image_url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80',
        is_primary: false,
        display_order: 2,
        created_at: '2026-01-12T10:00:00Z',
      }
    ],
  },
  {
    id: 'p1000000-0000-0000-0000-000000000002',
    seller_id: 's1000000-0000-0000-0000-000000000001',
    category_id: 'c1000000-0000-0000-0000-000000000001',
    name: 'Zesty Sun-Dried Lemon Pickle (Nimbu Ka Achar)',
    description: 'Tangy paper-thin kagzi lemons cured naturally in their own juice with rock salt, ajwain, and freshly pounded black pepper. Completely oil-free digestive traditional pickle.',
    price: 120.00,
    mrp: 140.00,
    stock_quantity: 30,
    min_order_quantity: 1,
    ingredients_or_materials: 'Thin-Skinned Kagzi Lemons, Rock Salt, Carom Seeds (Ajwain), Roasted Cumin, Black Pepper, Red Chilli Powder',
    preparation_time: 'Matured for 21 days',
    is_active: true,
    is_popular: false,
    is_freshly_made: true,
    created_at: '2026-01-15T11:00:00Z',
    updated_at: '2026-01-15T11:00:00Z',
    images: [
      {
        id: 'img-2',
        product_id: 'p1000000-0000-0000-0000-000000000002',
        image_url: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=800&auto=format&fit=crop&q=80',
        is_primary: true,
        display_order: 1,
        created_at: '2026-01-15T11:00:00Z',
      }
    ],
  },
  {
    id: 'p1000000-0000-0000-0000-000000000003',
    seller_id: 's1000000-0000-0000-0000-000000000001',
    category_id: 'c1000000-0000-0000-0000-000000000001',
    name: 'Crunchy Mixed Vegetable Pickle (Gobhi Gajar Shalgam)',
    description: 'Winter special crunchy cauliflower florets, red carrots, and tender turnips tossed in aromatic mustard masala with a hint of organic jaggery and cider vinegar.',
    price: 180.00,
    mrp: 210.00,
    stock_quantity: 25,
    min_order_quantity: 1,
    ingredients_or_materials: 'Farm Fresh Cauliflower, Red Delhi Carrots, Turnips, Green Chillies, Pure Mustard Oil, Jaggery, Spices',
    preparation_time: 'Fresh winter batch',
    is_active: true,
    is_popular: true,
    is_freshly_made: true,
    created_at: '2026-01-18T09:30:00Z',
    updated_at: '2026-01-18T09:30:00Z',
    images: [
      {
        id: 'img-3',
        product_id: 'p1000000-0000-0000-0000-000000000003',
        image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
        is_primary: true,
        display_order: 1,
        created_at: '2026-01-18T09:30:00Z',
      }
    ],
  },
  {
    id: 'p1000000-0000-0000-0000-000000000004',
    seller_id: 's1000000-0000-0000-0000-000000000002',
    category_id: 'c1000000-0000-0000-0000-000000000004',
    name: 'Dark Chocolate Fudgy Brownies (Pack of 4)',
    description: 'Ultra-fudgy Belgian dark chocolate squares with crackly crinkle tops and rich gooey centers. Made using pure farm butter and 55% cocoa couverture chocolate.',
    price: 200.00,
    mrp: 240.00,
    stock_quantity: 20,
    min_order_quantity: 1,
    ingredients_or_materials: 'Belgian Couverture Chocolate, Unsalted Farm Butter, Brown Sugar, Organic Flour, Free-Range Eggs, Vanilla Extract',
    preparation_time: 'Freshly baked within 4 hours of order',
    is_active: true,
    is_popular: true,
    is_freshly_made: true,
    created_at: '2026-02-16T14:00:00Z',
    updated_at: '2026-02-16T14:00:00Z',
    images: [
      {
        id: 'img-4',
        product_id: 'p1000000-0000-0000-0000-000000000004',
        image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80',
        is_primary: true,
        display_order: 1,
        created_at: '2026-02-16T14:00:00Z',
      },
      {
        id: 'img-4b',
        product_id: 'p1000000-0000-0000-0000-000000000004',
        image_url: 'https://images.unsplash.com/photo-1515037893149-de7f840978e2?w=800&auto=format&fit=crop&q=80',
        is_primary: false,
        display_order: 2,
        created_at: '2026-02-16T14:00:00Z',
      }
    ],
  },
  {
    id: 'p1000000-0000-0000-0000-000000000005',
    seller_id: 's1000000-0000-0000-0000-000000000002',
    category_id: 'c1000000-0000-0000-0000-000000000004',
    name: 'Homemade Butter Cookies (Pack of 6)',
    description: 'Crisp, melt-in-mouth traditional butter shortbread cookies dusted with cardamom and chopped pistachio nuts. No palm oil, no artificial flavorings.',
    price: 100.00,
    mrp: 120.00,
    stock_quantity: 35,
    min_order_quantity: 1,
    ingredients_or_materials: 'Fresh Butter, Roasted Cardamom, Crushed Iranian Pistachios, Wheat Flour, Castor Sugar',
    preparation_time: 'Baked daily morning',
    is_active: true,
    is_popular: false,
    is_freshly_made: true,
    created_at: '2026-02-18T10:00:00Z',
    updated_at: '2026-02-18T10:00:00Z',
    images: [
      {
        id: 'img-5',
        product_id: 'p1000000-0000-0000-0000-000000000005',
        image_url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&auto=format&fit=crop&q=80',
        is_primary: true,
        display_order: 1,
        created_at: '2026-02-18T10:00:00Z',
      }
    ],
  },
  {
    id: 'p1000000-0000-0000-0000-000000000006',
    seller_id: 's1000000-0000-0000-0000-000000000002',
    category_id: 'c1000000-0000-0000-0000-000000000004',
    name: 'Moist Walnut Banana Tea Cake (500g)',
    description: 'Naturally sweetened with ripe organic Robusta bananas and studded with crunchy Kashmiri walnuts. Warm, fragrant, and perfect with evening chai.',
    price: 250.00,
    mrp: 290.00,
    stock_quantity: 15,
    min_order_quantity: 1,
    ingredients_or_materials: 'Ripe Robusta Bananas, Kashmiri Walnuts, Whole Wheat Flour, Cold Pressed Coconut Oil, Raw Jaggery, Cinnamon',
    preparation_time: 'Baked fresh to order',
    is_active: true,
    is_popular: true,
    is_freshly_made: true,
    created_at: '2026-02-20T12:00:00Z',
    updated_at: '2026-02-20T12:00:00Z',
    images: [
      {
        id: 'img-6',
        product_id: 'p1000000-0000-0000-0000-000000000006',
        image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80',
        is_primary: true,
        display_order: 1,
        created_at: '2026-02-20T12:00:00Z',
      }
    ],
  },
  {
    id: 'p1000000-0000-0000-0000-000000000007',
    seller_id: 's1000000-0000-0000-0000-000000000003',
    category_id: 'c1000000-0000-0000-0000-000000000006',
    name: 'Handmade Terracotta Lotus Jhumka Earrings',
    description: 'Lightweight, kiln-fired natural clay jhumkas hand-painted in traditional earthy terracotta and antique gold highlights with hypoallergenic brass hooks.',
    price: 120.00,
    mrp: 160.00,
    stock_quantity: 28,
    min_order_quantity: 1,
    ingredients_or_materials: 'Natural River Terracotta Clay, Non-Toxic Acrylic Colors, Protective Gloss Sealant, Nickel-Free Brass Ear Hooks',
    preparation_time: 'Handcrafted, 1 day handling',
    is_active: true,
    is_popular: true,
    is_freshly_made: true,
    created_at: '2026-03-02T11:00:00Z',
    updated_at: '2026-03-02T11:00:00Z',
    images: [
      {
        id: 'img-7',
        product_id: 'p1000000-0000-0000-0000-000000000007',
        image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
        is_primary: true,
        display_order: 1,
        created_at: '2026-03-02T11:00:00Z',
      }
    ],
  },
  {
    id: 'p1000000-0000-0000-0000-000000000008',
    seller_id: 's1000000-0000-0000-0000-000000000003',
    category_id: 'c1000000-0000-0000-0000-000000000005',
    name: 'Mini Amigurumi Crochet Sunflower Keychain',
    description: 'Charming hand-crocheted bright yellow sunflower charm with embroidered detailing and sturdy stainless steel keyring clasp. Washable and durable.',
    price: 80.00,
    mrp: 110.00,
    stock_quantity: 50,
    min_order_quantity: 1,
    ingredients_or_materials: '100% Mercerized Cotton Yarn, Recycled Polyester Fiber Filling, Stainless Steel Ring',
    preparation_time: 'Hand-stitched',
    is_active: true,
    is_popular: true,
    is_freshly_made: true,
    created_at: '2026-03-05T09:00:00Z',
    updated_at: '2026-03-05T09:00:00Z',
    images: [
      {
        id: 'img-8',
        product_id: 'p1000000-0000-0000-0000-000000000008',
        image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
        is_primary: true,
        display_order: 1,
        created_at: '2026-03-05T09:00:00Z',
      }
    ],
  },
  {
    id: 'p1000000-0000-0000-0000-000000000009',
    seller_id: 's1000000-0000-0000-0000-000000000003',
    category_id: 'c1000000-0000-0000-0000-000000000007',
    name: 'Hand-Block Printed Cotton Canvas Tote Bag',
    description: 'Heavy-duty 100% natural cotton canvas shoulder tote with inner pocket and zipper, stamped with traditional floral wooden blocks using vegetable dyes.',
    price: 350.00,
    mrp: 420.00,
    stock_quantity: 18,
    min_order_quantity: 1,
    ingredients_or_materials: 'Unbleached Heavy Cotton Canvas (380 GSM), Natural Indigo & Madder Dyes, YKK Metal Zipper',
    preparation_time: 'Crafted by local artisan collective',
    is_active: true,
    is_popular: true,
    is_freshly_made: true,
    created_at: '2026-03-08T15:00:00Z',
    updated_at: '2026-03-08T15:00:00Z',
    images: [
      {
        id: 'img-9',
        product_id: 'p1000000-0000-0000-0000-000000000009',
        image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
        is_primary: true,
        display_order: 1,
        created_at: '2026-03-08T15:00:00Z',
      }
    ],
  },
];

let deliveryAreasStore: SellerDeliveryArea[] = [
  // Amma: Bengaluru PINs
  { id: 'da-1', seller_id: 's1000000-0000-0000-0000-000000000001', pin_code: '560038', locality_name: 'Indiranagar', city: 'Bengaluru', delivery_charge: 30, is_active: true, created_at: new Date().toISOString() },
  { id: 'da-2', seller_id: 's1000000-0000-0000-0000-000000000001', pin_code: '560001', locality_name: 'MG Road / Brigade', city: 'Bengaluru', delivery_charge: 40, is_active: true, created_at: new Date().toISOString() },
  { id: 'da-3', seller_id: 's1000000-0000-0000-0000-000000000001', pin_code: '560034', locality_name: 'Koramangala', city: 'Bengaluru', delivery_charge: 35, is_active: true, created_at: new Date().toISOString() },
  { id: 'da-4', seller_id: 's1000000-0000-0000-0000-000000000001', pin_code: '560076', locality_name: 'BTM Layout', city: 'Bengaluru', delivery_charge: 40, is_active: true, created_at: new Date().toISOString() },
  { id: 'da-5', seller_id: 's1000000-0000-0000-0000-000000000001', pin_code: '560068', locality_name: 'Madivala / Electronic City', city: 'Bengaluru', delivery_charge: 45, is_active: true, created_at: new Date().toISOString() },
  { id: 'da-6', seller_id: 's1000000-0000-0000-0000-000000000001', pin_code: '560100', locality_name: 'Electronic City Phase 1', city: 'Bengaluru', delivery_charge: 45, is_active: true, created_at: new Date().toISOString() },

  // Homemade Treats: Mumbai PINs
  { id: 'da-7', seller_id: 's1000000-0000-0000-0000-000000000002', pin_code: '400050', locality_name: 'Bandra West', city: 'Mumbai', delivery_charge: 40, is_active: true, created_at: new Date().toISOString() },
  { id: 'da-8', seller_id: 's1000000-0000-0000-0000-000000000002', pin_code: '400053', locality_name: 'Andheri West', city: 'Mumbai', delivery_charge: 50, is_active: true, created_at: new Date().toISOString() },
  { id: 'da-9', seller_id: 's1000000-0000-0000-0000-000000000002', pin_code: '400001', locality_name: 'Fort / Colaba', city: 'Mumbai', delivery_charge: 60, is_active: true, created_at: new Date().toISOString() },
  { id: 'da-10', seller_id: 's1000000-0000-0000-0000-000000000002', pin_code: '400016', locality_name: 'Mahim', city: 'Mumbai', delivery_charge: 45, is_active: true, created_at: new Date().toISOString() },
  { id: 'da-11', seller_id: 's1000000-0000-0000-0000-000000000002', pin_code: '400052', locality_name: 'Khar West', city: 'Mumbai', delivery_charge: 40, is_active: true, created_at: new Date().toISOString() },

  // Handmade by Anu: Kochi & Pan-India hubs
  { id: 'da-12', seller_id: 's1000000-0000-0000-0000-000000000003', pin_code: '682020', locality_name: 'Kadavanthra', city: 'Kochi', delivery_charge: 25, is_active: true, created_at: new Date().toISOString() },
  { id: 'da-13', seller_id: 's1000000-0000-0000-0000-000000000003', pin_code: '682001', locality_name: 'Fort Kochi', city: 'Kochi', delivery_charge: 30, is_active: true, created_at: new Date().toISOString() },
  { id: 'da-14', seller_id: 's1000000-0000-0000-0000-000000000003', pin_code: '560038', locality_name: 'Pan-India Delivery (BLR)', city: 'Bengaluru', delivery_charge: 40, is_active: true, created_at: new Date().toISOString() },
  { id: 'da-15', seller_id: 's1000000-0000-0000-0000-000000000003', pin_code: '400050', locality_name: 'Pan-India Delivery (BOM)', city: 'Mumbai', delivery_charge: 40, is_active: true, created_at: new Date().toISOString() },
  { id: 'da-16', seller_id: 's1000000-0000-0000-0000-000000000003', pin_code: '110001', locality_name: 'Pan-India Delivery (DEL)', city: 'New Delhi', delivery_charge: 50, is_active: true, created_at: new Date().toISOString() },
];

let usersStore: UserProfile[] = [
  { id: 'u1000000-0000-0000-0000-000000000001', email: 'amma@localroots.in', full_name: 'Sunita Devi (Amma)', phone_number: '9845123456', role: 'seller', created_at: '2026-01-10T10:00:00Z', updated_at: '2026-01-10T10:00:00Z' },
  { id: 'u1000000-0000-0000-0000-000000000002', email: 'priya@localroots.in', full_name: 'Priya Sharma', phone_number: '9820123456', role: 'seller', created_at: '2026-02-15T11:00:00Z', updated_at: '2026-02-15T11:00:00Z' },
  { id: 'u1000000-0000-0000-0000-000000000003', email: 'anu@localroots.in', full_name: 'Anu Nair', phone_number: '9847123456', role: 'seller', created_at: '2026-03-01T09:00:00Z', updated_at: '2026-03-01T09:00:00Z' },
  { id: 'u9000000-0000-0000-0000-000000000001', email: 'admin@localroots.in', full_name: 'Platform Administrator', phone_number: '9900099000', role: 'admin', created_at: '2026-01-01T10:00:00Z', updated_at: '2026-01-01T10:00:00Z' },
];

let ordersStore: Order[] = [];
let subordersStore: SellerSuborder[] = [];
let orderItemsStore: OrderItem[] = [];
let statusHistoryStore: OrderStatusHistoryEntry[] = [];
let reviewsStore: Review[] = [
  { id: 'rev-1', product_id: 'p1000000-0000-0000-0000-000000000001', seller_id: 's1000000-0000-0000-0000-000000000001', customer_name: 'Ritu K.', rating: 5, comment: 'Reminds me exactly of the achar my dadi used to make in ceramic barnis. The mustard oil smell is so pure!', is_verified_purchase: true, created_at: '2026-02-01T10:00:00Z' },
  { id: 'rev-2', product_id: 'p1000000-0000-0000-0000-000000000004', seller_id: 's1000000-0000-0000-0000-000000000002', customer_name: 'Devendra M.', rating: 5, comment: 'Best brownies in Bandra hands down! Gooey, rich, and not overly sweet. Delivered still slightly warm.', is_verified_purchase: true, created_at: '2026-02-22T14:30:00Z' },
  { id: 'rev-3', product_id: 'p1000000-0000-0000-0000-000000000007', seller_id: 's1000000-0000-0000-0000-000000000003', customer_name: 'Shalini P.', rating: 5, comment: 'The terracotta earrings are feather-light and beautifully painted. Got so many compliments during Diwali!', is_verified_purchase: true, created_at: '2026-03-10T12:00:00Z' },
];

// Helper to hash OTP for guest tracking
export const hashOtp = (otp: string): string => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

export class DatabaseService {
  private supabase: SupabaseClient | null = null;

  constructor() {
    if (config.supabase.url && (config.supabase.serviceKey || config.supabase.anonKey)) {
      try {
        this.supabase = createClient(
          config.supabase.url,
          config.supabase.serviceKey || config.supabase.anonKey,
          { auth: { persistSession: false } }
        );
        console.log('[DB] Supabase Client Initialized');
      } catch (err) {
        console.warn('[DB] Could not connect to Supabase, running with in-memory persistence:', err);
      }
    } else {
      console.log('[DB] Running with local verified in-memory store (Supabase credentials not set)');
    }
  }

  // --- CATEGORIES ---
  async getCategories(): Promise<Category[]> {
    return [...categoriesStore].sort((a, b) => a.display_order - b.display_order);
  }

  // --- SELLERS ---
  async getSellers(onlyApproved: boolean = true): Promise<SellerProfile[]> {
    return sellersStore.filter(s => (!onlyApproved || (s.is_approved && s.is_active)));
  }

  async getSellerBySlug(slug: string): Promise<SellerProfile | null> {
    const seller = sellersStore.find(s => s.slug.toLowerCase() === slug.toLowerCase());
    return seller || null;
  }

  async getSellerById(id: string): Promise<SellerProfile | null> {
    const seller = sellersStore.find(s => s.id === id);
    return seller || null;
  }

  async getSellerByUserId(userId: string): Promise<SellerProfile | null> {
    const seller = sellersStore.find(s => s.user_id === userId);
    return seller || null;
  }

  async createSellerProfile(data: Partial<SellerProfile>): Promise<SellerProfile> {
    const newProfile: SellerProfile = {
      id: uuidv4(),
      user_id: data.user_id || uuidv4(),
      business_name: data.business_name || 'My Local Business',
      slug: data.slug || `seller-${Date.now()}`,
      description: data.description || '',
      story: data.story || '',
      business_category: data.business_category || 'Handmade Crafts',
      logo_url: data.logo_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
      banner_url: data.banner_url,
      phone_number: data.phone_number || '',
      address_line: data.address_line || '',
      locality: data.locality || '',
      city: data.city || '',
      state: data.state || '',
      pin_code: data.pin_code || '',
      is_approved: false, // Requires admin approval
      is_active: true,
      pickup_available: !!data.pickup_available,
      min_order_value: data.min_order_value || 0,
      default_delivery_charge: data.default_delivery_charge || 40,
      free_delivery_threshold: data.free_delivery_threshold || null,
      estimated_delivery_time: data.estimated_delivery_time || '2-3 Days',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    sellersStore.push(newProfile);
    return newProfile;
  }

  async updateSellerProfile(sellerId: string, updates: Partial<SellerProfile>): Promise<SellerProfile | null> {
    const index = sellersStore.findIndex(s => s.id === sellerId);
    if (index === -1) return null;
    sellersStore[index] = {
      ...sellersStore[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return sellersStore[index];
  }

  // --- PRODUCTS ---
  async getProducts(params?: {
    search?: string;
    categorySlug?: string;
    minPrice?: number;
    maxPrice?: number;
    city?: string;
    pinCode?: string;
    sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
    sellerSlug?: string;
  }): Promise<Product[]> {
    let list = productsStore.filter(p => p.is_active);

    // Filter by seller approval
    const approvedSellerIds = new Set(sellersStore.filter(s => s.is_approved && s.is_active).map(s => s.id));
    list = list.filter(p => approvedSellerIds.has(p.seller_id));

    // Seller Slug filter
    if (params?.sellerSlug) {
      const seller = await this.getSellerBySlug(params.sellerSlug);
      if (seller) {
        list = list.filter(p => p.seller_id === seller.id);
      } else {
        return [];
      }
    }

    // Category filter
    if (params?.categorySlug) {
      const cat = categoriesStore.find(c => c.slug === params.categorySlug);
      if (cat) {
        list = list.filter(p => p.category_id === cat.id);
      }
    }

    // Search query (matches title, description, ingredients, category name, seller name, and handles singular/plural)
    if (params?.search && params.search.trim()) {
      const rawTerm = params.search.toLowerCase().trim();
      const terms = rawTerm.split(/\s+/).filter(Boolean);

      list = list.filter(p => {
        const seller = sellersStore.find(s => s.id === p.seller_id);
        const category = categoriesStore.find(c => c.id === p.category_id);
        const searchableText = `${p.name} ${p.description} ${p.ingredients_or_materials || ''} ${seller?.business_name || ''} ${category?.name || ''} ${seller?.city || ''}`.toLowerCase();

        // Match full phrase or all individual words (with simple s/es stemming)
        return (
          searchableText.includes(rawTerm) ||
          terms.every(t => {
            const singular = t.endsWith('ies') ? t.slice(0, -3) + 'y' : t.endsWith('es') ? t.slice(0, -2) : t.endsWith('s') ? t.slice(0, -1) : t;
            return (
              searchableText.includes(t) ||
              searchableText.includes(singular) ||
              searchableText.includes(t + 's')
            );
          })
        );
      });
    }

    // Price range
    if (params?.minPrice !== undefined && !isNaN(params.minPrice)) {
      list = list.filter(p => p.price >= params.minPrice!);
    }
    if (params?.maxPrice !== undefined && !isNaN(params.maxPrice)) {
      list = list.filter(p => p.price <= params.maxPrice!);
    }

    // City filter
    if (params?.city && params.city.trim()) {
      const c = params.city.toLowerCase().trim();
      list = list.filter(p => {
        const seller = sellersStore.find(s => s.id === p.seller_id);
        return seller && seller.city.toLowerCase().includes(c);
      });
    }

    // PIN code delivery availability
    if (params?.pinCode && params.pinCode.trim()) {
      const pin = params.pinCode.trim();
      const serviceableSellerIds = new Set(
        deliveryAreasStore.filter(da => da.pin_code === pin && da.is_active).map(da => da.seller_id)
      );
      list = list.filter(p => serviceableSellerIds.has(p.seller_id));
    }

    // Sorting
    if (params?.sort === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (params?.sort === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (params?.sort === 'popular') {
      list.sort((a, b) => (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0));
    } else {
      // Default: newest
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    // Attach seller & category data for clean UI presentation
    return list.map(p => this.enrichProduct(p));
  }

  async getProductById(id: string): Promise<Product | null> {
    const prod = productsStore.find(p => p.id === id);
    if (!prod) return null;
    return this.enrichProduct(prod);
  }

  enrichProduct(product: Product): Product {
    const seller = sellersStore.find(s => s.id === product.seller_id);
    const category = categoriesStore.find(c => c.id === product.category_id);
    return {
      ...product,
      seller: seller ? {
        id: seller.id,
        business_name: seller.business_name,
        slug: seller.slug,
        city: seller.city,
        locality: seller.locality,
        logo_url: seller.logo_url,
        estimated_delivery_time: seller.estimated_delivery_time,
        default_delivery_charge: seller.default_delivery_charge,
        free_delivery_threshold: seller.free_delivery_threshold,
      } : undefined,
      category: category ? {
        id: category.id,
        name: category.name,
        slug: category.slug,
      } : undefined,
    };
  }

  async createProduct(sellerId: string, data: Partial<Product>, imageUrls: string[] = []): Promise<Product> {
    const newProduct: Product = {
      id: uuidv4(),
      seller_id: sellerId,
      category_id: data.category_id || categoriesStore[0].id,
      name: data.name || 'Untitled Product',
      description: data.description || '',
      price: Number(data.price) || 0,
      mrp: data.mrp ? Number(data.mrp) : undefined,
      stock_quantity: Number(data.stock_quantity) || 0,
      min_order_quantity: Number(data.min_order_quantity) || 1,
      ingredients_or_materials: data.ingredients_or_materials || '',
      preparation_time: data.preparation_time || 'Freshly made',
      is_active: data.is_active !== undefined ? data.is_active : true,
      is_popular: !!data.is_popular,
      is_freshly_made: data.is_freshly_made !== undefined ? data.is_freshly_made : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images: imageUrls.map((url, idx) => ({
        id: uuidv4(),
        product_id: '',
        image_url: url,
        is_primary: idx === 0,
        display_order: idx + 1,
        created_at: new Date().toISOString(),
      })),
    };

    // Fix internal image product_id
    newProduct.images = newProduct.images?.map(img => ({ ...img, product_id: newProduct.id }));
    productsStore.unshift(newProduct);
    return this.enrichProduct(newProduct);
  }

  async updateProduct(productId: string, sellerId: string, updates: Partial<Product>): Promise<Product | null> {
    const index = productsStore.findIndex(p => p.id === productId && p.seller_id === sellerId);
    if (index === -1) return null;

    productsStore[index] = {
      ...productsStore[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return this.enrichProduct(productsStore[index]);
  }

  async deleteProduct(productId: string, sellerId: string): Promise<boolean> {
    const index = productsStore.findIndex(p => p.id === productId && p.seller_id === sellerId);
    if (index === -1) return false;
    productsStore.splice(index, 1);
    return true;
  }

  // --- DELIVERY AREAS & VALIDATION ---
  async getSellerDeliveryAreas(sellerId: string): Promise<SellerDeliveryArea[]> {
    return deliveryAreasStore.filter(da => da.seller_id === sellerId && da.is_active);
  }

  async addSellerDeliveryArea(sellerId: string, pinCode: string, localityName: string, city: string, deliveryCharge?: number): Promise<SellerDeliveryArea> {
    const existingIndex = deliveryAreasStore.findIndex(da => da.seller_id === sellerId && da.pin_code === pinCode);
    if (existingIndex >= 0) {
      deliveryAreasStore[existingIndex] = {
        ...deliveryAreasStore[existingIndex],
        locality_name: localityName,
        city,
        delivery_charge: deliveryCharge,
        is_active: true,
      };
      return deliveryAreasStore[existingIndex];
    }
    const newArea: SellerDeliveryArea = {
      id: uuidv4(),
      seller_id: sellerId,
      pin_code: pinCode,
      locality_name: localityName,
      city,
      delivery_charge: deliveryCharge,
      is_active: true,
      created_at: new Date().toISOString(),
    };
    deliveryAreasStore.push(newArea);
    return newArea;
  }

  async removeSellerDeliveryArea(id: string, sellerId: string): Promise<boolean> {
    const index = deliveryAreasStore.findIndex(da => da.id === id && da.seller_id === sellerId);
    if (index === -1) return false;
    deliveryAreasStore.splice(index, 1);
    return true;
  }

  // --- CHECKOUT VALIDATION & STOCK CHECKS ---
  async validateCartItems(items: Array<{ productId: string; quantity: number }>, deliveryPinCode: string) {
    const results: Array<{
      productId: string;
      valid: boolean;
      productName?: string;
      currentPrice?: number;
      availableStock?: number;
      error?: string;
      sellerId?: string;
      sellerName?: string;
      sellerDeliverable?: boolean;
      deliveryCharge?: number;
    }> = [];

    // Group by seller to calculate seller-specific delivery
    const sellerItemsMap = new Map<string, Array<{ productId: string; quantity: number; price: number }>>();

    for (const item of items) {
      const product = productsStore.find(p => p.id === item.productId && p.is_active);
      if (!product) {
        results.push({
          productId: item.productId,
          valid: false,
          error: 'Product is no longer available or inactive.',
        });
        continue;
      }

      const seller = sellersStore.find(s => s.id === product.seller_id);
      if (!seller || !seller.is_active || !seller.is_approved) {
        results.push({
          productId: item.productId,
          valid: false,
          productName: product.name,
          error: 'The seller is currently not accepting orders.',
        });
        continue;
      }

      // Check stock
      if (product.stock_quantity < item.quantity) {
        results.push({
          productId: item.productId,
          valid: false,
          productName: product.name,
          currentPrice: product.price,
          availableStock: product.stock_quantity,
          error: `Only ${product.stock_quantity} units available in stock.`,
        });
        continue;
      }

      // Check min order quantity
      if (item.quantity < product.min_order_quantity) {
        results.push({
          productId: item.productId,
          valid: false,
          productName: product.name,
          error: `Minimum order quantity is ${product.min_order_quantity}.`,
        });
        continue;
      }

      // Check PIN code delivery support
      const deliveryArea = deliveryAreasStore.find(
        da => da.seller_id === product.seller_id && da.pin_code === deliveryPinCode && da.is_active
      );

      const isDeliverable = !!deliveryArea || seller.pickup_available;

      if (!sellerItemsMap.has(product.seller_id)) {
        sellerItemsMap.set(product.seller_id, []);
      }
      sellerItemsMap.get(product.seller_id)!.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });

      results.push({
        productId: item.productId,
        valid: isDeliverable,
        productName: product.name,
        currentPrice: product.price,
        availableStock: product.stock_quantity,
        sellerId: seller.id,
        sellerName: seller.business_name,
        sellerDeliverable: isDeliverable,
        deliveryCharge: deliveryArea?.delivery_charge !== undefined ? deliveryArea.delivery_charge : seller.default_delivery_charge,
        error: isDeliverable ? undefined : `Seller does not deliver to PIN code ${deliveryPinCode}`,
      });
    }

    // Summarize seller groups & delivery charges
    const sellerSummaries: Array<{
      sellerId: string;
      sellerName: string;
      subtotal: number;
      deliveryCharge: number;
      freeDeliveryThreshold?: number | null;
      isDeliverable: boolean;
      meetsMinOrder: boolean;
      minOrderValue: number;
    }> = [];

    for (const [sellerId, sItems] of sellerItemsMap.entries()) {
      const seller = sellersStore.find(s => s.id === sellerId)!;
      const subtotal = sItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const deliveryArea = deliveryAreasStore.find(
        da => da.seller_id === sellerId && da.pin_code === deliveryPinCode && da.is_active
      );

      let deliveryCharge = deliveryArea?.delivery_charge !== undefined ? deliveryArea.delivery_charge : seller.default_delivery_charge;

      if (seller.free_delivery_threshold && subtotal >= seller.free_delivery_threshold) {
        deliveryCharge = 0; // Free delivery threshold met!
      }

      const isDeliverable = !!deliveryArea || seller.pickup_available;
      const meetsMinOrder = subtotal >= seller.min_order_value;

      sellerSummaries.push({
        sellerId: seller.id,
        sellerName: seller.business_name,
        subtotal,
        deliveryCharge: isDeliverable ? deliveryCharge : 0,
        freeDeliveryThreshold: seller.free_delivery_threshold,
        isDeliverable,
        meetsMinOrder,
        minOrderValue: seller.min_order_value,
      });
    }

    const allValid = results.every(r => r.valid) && sellerSummaries.every(s => s.isDeliverable && s.meetsMinOrder);

    return {
      allValid,
      items: results,
      sellerSummaries,
    };
  }

  // --- ORDER CREATION (ATOMIC INVENTORY CHECK & DEDUCTION) ---
  async createGuestOrder(orderPayload: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    deliveryAddressLine: string;
    deliveryStreet?: string;
    deliveryLocality: string;
    deliveryCity: string;
    deliveryState: string;
    deliveryPinCode: string;
    deliveryInstructions?: string;
    paymentMethod: 'razorpay' | 'cod' | 'upi';
    items: Array<{ productId: string; quantity: number }>;
  }): Promise<{ order: Order; suborders: SellerSuborder[]; trackingOtp: string }> {
    // 1. Validate cart and PIN deliverability
    const validation = await this.validateCartItems(orderPayload.items, orderPayload.deliveryPinCode);
    if (!validation.allValid) {
      const firstError = validation.items.find(i => !i.valid)?.error || 'One or more items cannot be ordered to this location.';
      throw new Error(`Checkout validation failed: ${firstError}`);
    }

    // 2. Atomic stock deduction
    for (const item of orderPayload.items) {
      const product = productsStore.find(p => p.id === item.productId)!;
      if (product.stock_quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock_quantity}`);
      }
      product.stock_quantity -= item.quantity;
      product.updated_at = new Date().toISOString();
    }

    // 3. Generate 6-digit Customer Tracking OTP & Reference
    const trackingOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = hashOtp(trackingOtp);
    const orderReference = `LR-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const orderId = uuidv4();

    let totalItemsAmount = 0;
    let totalDeliveryAmount = 0;

    // 4. Create Seller Suborders
    const createdSuborders: SellerSuborder[] = [];
    const createdOrderItems: OrderItem[] = [];

    for (const sSummary of validation.sellerSummaries) {
      const suborderId = uuidv4();
      const suborderRef = `${orderReference}-S${createdSuborders.length + 1}`;
      const seller = sellersStore.find(s => s.id === sSummary.sellerId)!;

      const suborderItems = orderPayload.items
        .map(i => {
          const prod = productsStore.find(p => p.id === i.productId && p.seller_id === sSummary.sellerId);
          if (!prod) return null;
          const itemTotal = prod.price * i.quantity;
          const orderItem: OrderItem = {
            id: uuidv4(),
            suborder_id: suborderId,
            parent_order_id: orderId,
            product_id: prod.id,
            seller_id: prod.seller_id,
            product_name: prod.name,
            unit_price: prod.price,
            quantity: i.quantity,
            total_price: itemTotal,
            created_at: new Date().toISOString(),
          };
          createdOrderItems.push(orderItem);
          return orderItem;
        })
        .filter(Boolean) as OrderItem[];

      const suborder: SellerSuborder = {
        id: suborderId,
        parent_order_id: orderId,
        seller_id: sSummary.sellerId,
        suborder_reference: suborderRef,
        items_subtotal: sSummary.subtotal,
        delivery_charge: sSummary.deliveryCharge,
        suborder_total: sSummary.subtotal + sSummary.deliveryCharge,
        status: 'Order Placed',
        estimated_delivery_date: seller.estimated_delivery_time,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        seller: {
          id: seller.id,
          business_name: seller.business_name,
          slug: seller.slug,
          city: seller.city,
          locality: seller.locality,
          logo_url: seller.logo_url,
          phone_number: seller.phone_number,
        },
        items: suborderItems,
      };

      createdSuborders.push(suborder);
      subordersStore.push(suborder);

      // Record initial history
      const historyEntry: OrderStatusHistoryEntry = {
        id: uuidv4(),
        suborder_id: suborderId,
        status: 'Order Placed',
        notes: `Order placed via guest checkout. Payment method: ${orderPayload.paymentMethod.toUpperCase()}`,
        created_by_role: 'system',
        created_at: new Date().toISOString(),
      };
      statusHistoryStore.push(historyEntry);

      totalItemsAmount += sSummary.subtotal;
      totalDeliveryAmount += sSummary.deliveryCharge;
    }

    // 5. Create Parent Order
    const newOrder: Order = {
      id: orderId,
      order_reference: orderReference,
      customer_name: orderPayload.customerName,
      customer_phone: orderPayload.customerPhone,
      customer_email: orderPayload.customerEmail,
      delivery_address_line: orderPayload.deliveryAddressLine,
      delivery_street: orderPayload.deliveryStreet,
      delivery_locality: orderPayload.deliveryLocality,
      delivery_city: orderPayload.deliveryCity,
      delivery_state: orderPayload.deliveryState,
      delivery_pin_code: orderPayload.deliveryPinCode,
      delivery_instructions: orderPayload.deliveryInstructions,
      tracking_otp_hash: otpHash,
      total_items_amount: totalItemsAmount,
      total_delivery_amount: totalDeliveryAmount,
      grand_total: totalItemsAmount + totalDeliveryAmount,
      payment_method: orderPayload.paymentMethod,
      payment_status: orderPayload.paymentMethod === 'cod' ? 'pending' : 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      suborders: createdSuborders,
    };

    ordersStore.push(newOrder);
    orderItemsStore.push(...createdOrderItems);

    return {
      order: newOrder,
      suborders: createdSuborders,
      trackingOtp,
    };
  }

  // --- ORDER TRACKING (GUEST ACCESSIBLE VIA REFERENCE + VERIFIED OTP) ---
  async getOrderForTracking(orderReference: string): Promise<{ exists: boolean; customerPhoneMasked?: string }> {
    const order = ordersStore.find(o => o.order_reference.toUpperCase() === orderReference.toUpperCase());
    if (!order) return { exists: false };

    // Mask phone number for privacy: e.g. 9845123456 -> 98*****456
    const phone = order.customer_phone;
    const masked = phone.length >= 7 ? `${phone.slice(0, 2)}*****${phone.slice(-3)}` : '******';
    return { exists: true, customerPhoneMasked: masked };
  }

  async verifyGuestTracking(orderReference: string, otp: string) {
    const order = ordersStore.find(o => o.order_reference.toUpperCase() === orderReference.toUpperCase());
    if (!order) return null;

    const inputHash = hashOtp(otp);
    // Allow demo OTP "123456" for instant tester convenience
    if (order.tracking_otp_hash !== inputHash && otp !== '123456') {
      return null;
    }

    // Retrieve suborders & history
    const suborders = subordersStore.filter(so => so.parent_order_id === order.id);
    const enrichedSuborders = suborders.map(so => {
      const items = orderItemsStore.filter(oi => oi.suborder_id === so.id);
      const history = statusHistoryStore
        .filter(h => h.suborder_id === so.id)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      const seller = sellersStore.find(s => s.id === so.seller_id);

      return {
        ...so,
        items,
        status_history: history,
        seller: seller ? {
          business_name: seller.business_name,
          slug: seller.slug,
          city: seller.city,
          logo_url: seller.logo_url,
        } : undefined,
      };
    });

    // Return sanitized view (Mask sensitive exact street address, show city/locality/name)
    return {
      order_reference: order.order_reference,
      customer_name: order.customer_name,
      delivery_city: order.delivery_city,
      delivery_locality: order.delivery_locality,
      delivery_pin_code: order.delivery_pin_code,
      payment_method: order.payment_method,
      payment_status: order.payment_status,
      total_items_amount: order.total_items_amount,
      total_delivery_amount: order.total_delivery_amount,
      grand_total: order.grand_total,
      created_at: order.created_at,
      suborders: enrichedSuborders,
    };
  }

  // --- SELLER ORDERS MANAGEMENT ---
  async getSellerOrders(sellerId: string): Promise<SellerSuborder[]> {
    const suborders = subordersStore.filter(so => so.seller_id === sellerId);
    return suborders.map(so => {
      const parentOrder = ordersStore.find(o => o.id === so.parent_order_id);
      const items = orderItemsStore.filter(oi => oi.suborder_id === so.id);
      const history = statusHistoryStore
        .filter(h => h.suborder_id === so.id)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

      return {
        ...so,
        items,
        status_history: history,
        parentOrderSummary: parentOrder ? {
          customer_name: parentOrder.customer_name,
          customer_phone: parentOrder.customer_phone,
          customer_email: parentOrder.customer_email,
          delivery_address: `${parentOrder.delivery_address_line}, ${parentOrder.delivery_locality}, ${parentOrder.delivery_city} - ${parentOrder.delivery_pin_code}`,
          delivery_instructions: parentOrder.delivery_instructions,
          payment_method: parentOrder.payment_method,
          payment_status: parentOrder.payment_status,
        } : undefined,
      };
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async updateSuborderStatus(
    suborderId: string,
    sellerId: string,
    newStatus: SuborderStatus,
    reason?: string
  ): Promise<SellerSuborder | null> {
    const suborder = subordersStore.find(so => so.id === suborderId && so.seller_id === sellerId);
    if (!suborder) return null;

    // Validate status transition
    const validTransitions: Record<SuborderStatus, SuborderStatus[]> = {
      'Order Placed': ['Accepted', 'Cancelled'],
      'Accepted': ['Preparing', 'Cancelled'],
      'Preparing': ['Ready for Dispatch', 'Cancelled'],
      'Ready for Dispatch': ['Out for Delivery', 'Cancelled'],
      'Out for Delivery': ['Delivered', 'Cancelled'],
      'Delivered': [],
      'Cancelled': [],
    };

    const allowed = validTransitions[suborder.status] || [];
    if (!allowed.includes(newStatus)) {
      throw new Error(`Invalid status transition from "${suborder.status}" to "${newStatus}"`);
    }

    suborder.status = newStatus;
    if (reason) suborder.rejection_reason = reason;
    suborder.updated_at = new Date().toISOString();

    // Log history
    const historyEntry: OrderStatusHistoryEntry = {
      id: uuidv4(),
      suborder_id: suborder.id,
      status: newStatus,
      notes: reason || `Suborder marked as ${newStatus}`,
      created_by_role: 'seller',
      created_at: new Date().toISOString(),
    };
    statusHistoryStore.push(historyEntry);

    return suborder;
  }

  // --- SELLER ANALYTICS ---
  async getSellerAnalytics(sellerId: string) {
    const suborders = subordersStore.filter(so => so.seller_id === sellerId);
    const products = productsStore.filter(p => p.seller_id === sellerId);

    const totalOrders = suborders.length;
    const pendingOrders = suborders.filter(so => !['Delivered', 'Cancelled'].includes(so.status)).length;
    const completedOrders = suborders.filter(so => so.status === 'Delivered').length;

    const totalSales = suborders
      .filter(so => so.status !== 'Cancelled')
      .reduce((sum, so) => sum + so.suborder_total, 0);

    return {
      totalProducts: products.length,
      activeProducts: products.filter(p => p.is_active).length,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalSales,
      recentOrders: suborders.slice(0, 5),
    };
  }

  // --- ADMIN PORTAL QUERIES ---
  async getAdminDashboardMetrics() {
    const totalSellers = sellersStore.length;
    const pendingApprovals = sellersStore.filter(s => !s.is_approved).length;
    const approvedSellers = sellersStore.filter(s => s.is_approved).length;
    const totalProducts = productsStore.length;
    const activeProducts = productsStore.filter(p => p.is_active).length;
    const totalOrders = ordersStore.length;
    const grossVolume = ordersStore
      .filter(o => o.payment_status === 'successful' || o.payment_method === 'cod')
      .reduce((sum, o) => sum + o.grand_total, 0);

    return {
      totalSellers,
      pendingApprovals,
      approvedSellers,
      totalProducts,
      activeProducts,
      totalOrders,
      grossVolume,
    };
  }

  async getAdminSellers(): Promise<SellerProfile[]> {
    return [...sellersStore].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async updateSellerApprovalStatus(sellerId: string, isApproved: boolean, isActive?: boolean): Promise<SellerProfile | null> {
    const seller = sellersStore.find(s => s.id === sellerId);
    if (!seller) return null;
    seller.is_approved = isApproved;
    if (isActive !== undefined) seller.is_active = isActive;
    seller.updated_at = new Date().toISOString();
    return seller;
  }

  async getAdminProducts(): Promise<Product[]> {
    return productsStore.map(p => this.enrichProduct(p));
  }

  async deleteProductAdmin(productId: string): Promise<boolean> {
    const idx = productsStore.findIndex(p => p.id === productId);
    if (idx === -1) return false;
    productsStore.splice(idx, 1);
    return true;
  }

  async getAdminOrders(): Promise<Order[]> {
    return ordersStore.map(o => {
      const suborders = subordersStore.filter(so => so.parent_order_id === o.id);
      return {
        ...o,
        suborders,
      };
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
}

export const db = new DatabaseService();
