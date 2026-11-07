/**
 * Creates demo profiles and sample listings for the Explore page.
 * Run with: npm run seed:demo
 * Requires VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the project .env.
 */

const crypto = require('node:crypto')
const path = require('node:path')
const dotenv = require('dotenv')
const { createClient } = require('@supabase/supabase-js')

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || SERVICE_ROLE_KEY.startsWith('your_')) {
  console.error('Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the project .env before seeding.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const DEMO_USERS = [
  {
    email: 'citizen1@rbr.demo',
    full_name: 'Arjun Reddy (Demo)',
    city: 'Hyderabad',
    locality: 'Madhapur',
    state: 'Telangana',
    pin_code: '500081',
    latitude: 17.4486,
    longitude: 78.3908,
    bio: 'Demonstration account with sample listings.',
  },
  {
    email: 'citizen2@rbr.demo',
    full_name: 'Priya Sharma (Demo)',
    city: 'Hyderabad',
    locality: 'Gachibowli',
    state: 'Telangana',
    pin_code: '500032',
    latitude: 17.4401,
    longitude: 78.3489,
    bio: 'Demonstration account with sample listings.',
  },
  {
    email: 'citizen3@rbr.demo',
    full_name: 'Ravi Kumar (Demo)',
    city: 'Hyderabad',
    locality: 'Kukatpally',
    state: 'Telangana',
    pin_code: '500072',
    latitude: 17.4849,
    longitude: 78.4138,
    bio: 'Demonstration account with sample listings.',
  },
]

const CATEGORIES = [
  ['Mobiles, Electronics & Accessories', 'electronics', 'Phones, tablets, chargers, earphones and more', 'Smartphone'],
  ['Clothing, Footwear & Bags', 'clothing', 'Apparel, shoes, bags, and accessories', 'ShoppingBag'],
  ['Books, Stationery & Exam Prep', 'books', 'Books, notebooks, competitive exam material', 'BookOpen'],
  ['Home, Kitchen & Household', 'home-kitchen', 'Utensils, home decor, cleaning supplies and more', 'Home'],
  ['Furniture & Home Décor', 'furniture', 'Furniture, lighting, and decorative items', 'Sofa'],
  ['Toys, Games & Baby Items', 'toys-baby', 'Toys, board games, baby products', 'Baby'],
  ['Sports & Fitness', 'sports', 'Sports equipment, gym gear, outdoor items', 'Activity'],
  ['Small Appliances', 'appliances', 'Mixers, irons, fans, small kitchen appliances', 'Zap'],
  ['Handicrafts & Art', 'handicrafts', 'Handmade items, craft supplies, art tools', 'Palette'],
  ['Other', 'other', 'Miscellaneous items not fitting any category', 'Package'],
]

const DEMO_LISTINGS = [
  {
    id: 'a1111111-0000-4000-8000-000000000001', owner: 0, category: 'electronics',
    title: 'USB-C Fast Charger (Demo Listing)',
    description: 'Sample listing for demonstration. A spare USB-C fast charger in working condition.',
    condition: 'like_new', listing_type: 'free', price: null, original_price: 1299,
    brand: 'OnePlus', locality: 'Madhapur', pin_code: '500081', latitude: 17.4486, longitude: 78.3908,
    pickup_preference: 'public_place',
  },
  {
    id: 'a1111111-0000-4000-8000-000000000002', owner: 1, category: 'books',
    title: 'Engineering Textbooks (Demo Listing)',
    description: 'Sample listing for demonstration. A small set of gently used engineering textbooks.',
    condition: 'gently_used', listing_type: 'free', price: null, original_price: 900,
    brand: null, locality: 'Gachibowli', pin_code: '500032', latitude: 17.4401, longitude: 78.3489,
    pickup_preference: 'public_place',
  },
  {
    id: 'a1111111-0000-4000-8000-000000000003', owner: 2, category: 'home-kitchen',
    title: 'Stainless Steel Cookware Set (Demo Listing)',
    description: 'Sample listing for demonstration. A lightly used cookware set in good condition.',
    condition: 'gently_used', listing_type: 'resale', price: 450, original_price: 1200,
    brand: null, locality: 'Kukatpally', pin_code: '500072', latitude: 17.4849, longitude: 78.4138,
    pickup_preference: 'public_place',
  },
  {
    id: 'a1111111-0000-4000-8000-000000000004', owner: 0, category: 'clothing',
    title: 'Unopened Cotton Backpack (Demo Listing)',
    description: 'Sample listing for demonstration. An unused everyday backpack in its original packaging.',
    condition: 'new_unopened', listing_type: 'resale', price: 300, original_price: 799,
    brand: null, locality: 'Madhapur', pin_code: '500081', latitude: 17.4486, longitude: 78.3908,
    pickup_preference: 'gate',
  },
  {
    id: 'a1111111-0000-4000-8000-000000000005', owner: 1, category: 'sports',
    title: 'Yoga Mat (Demo Listing)',
    description: 'Sample listing for demonstration. A clean yoga mat available for exchange.',
    condition: 'like_new', listing_type: 'exchange', price: null, original_price: null,
    brand: null, locality: 'Gachibowli', pin_code: '500032', latitude: 17.4401, longitude: 78.3489,
    pickup_preference: 'public_place',
  },
  {
    id: 'a1111111-0000-4000-8000-000000000006', owner: 2, category: 'appliances',
    title: 'Table Fan (Demo Listing)',
    description: 'Sample listing for demonstration. A working table fan offered at a low price.',
    condition: 'used_functional', listing_type: 'resale', price: 500, original_price: 1500,
    brand: null, locality: 'Kukatpally', pin_code: '500072', latitude: 17.4849, longitude: 78.4138,
    pickup_preference: 'public_place',
  },
  {
    id: 'a1111111-0000-4000-8000-000000000007', owner: 0, category: 'toys-baby',
    title: 'Board Game Set (Demo Listing)',
    description: 'Sample listing for demonstration. Complete board game set, all pieces included.',
    condition: 'like_new', listing_type: 'free', price: null, original_price: 650,
    brand: null, locality: 'Madhapur', pin_code: '500081', latitude: 17.4486, longitude: 78.3908,
    pickup_preference: 'public_place',
  },
  {
    id: 'a1111111-0000-4000-8000-000000000008', owner: 1, category: 'furniture',
    title: 'Compact Study Lamp (Demo Listing)',
    description: 'Sample listing for demonstration. A compact desk lamp in good working condition.',
    condition: 'gently_used', listing_type: 'free', price: null, original_price: 800,
    brand: null, locality: 'Gachibowli', pin_code: '500032', latitude: 17.4401, longitude: 78.3489,
    pickup_preference: 'gate',
  },
  {
    id: 'a1111111-0000-4000-8000-000000000009', owner: 2, category: 'handicrafts',
    title: 'Handmade Wall Hanging (Demo Listing)',
    description: 'Sample listing for demonstration. A decorative handmade wall hanging available for exchange.',
    condition: 'like_new', listing_type: 'exchange', price: null, original_price: null,
    brand: null, locality: 'Kukatpally', pin_code: '500072', latitude: 17.4849, longitude: 78.4138,
    pickup_preference: 'public_place',
  },
  {
    id: 'a1111111-0000-4000-8000-000000000010', owner: 1, category: 'other',
    title: 'Reusable Storage Boxes (Demo Listing)',
    description: 'Sample listing for demonstration. Stackable storage boxes in clean condition.',
    condition: 'gently_used', listing_type: 'free', price: null, original_price: 400,
    brand: null, locality: 'Gachibowli', pin_code: '500032', latitude: 17.4401, longitude: 78.3489,
    pickup_preference: 'public_place',
  },
  {
    id: 'a1111111-0000-4000-8000-000000000011', owner: 0, category: 'books',
    title: 'Competitive Exam Guidebooks (Demo Listing)',
    description: 'Sample listing for demonstration. Gently used exam preparation guidebooks.',
    condition: 'gently_used', listing_type: 'resale', price: 200, original_price: 550,
    brand: null, locality: 'Madhapur', pin_code: '500081', latitude: 17.4486, longitude: 78.3908,
    pickup_preference: 'public_place',
  },
  {
    id: 'a1111111-0000-4000-8000-000000000012', owner: 2, category: 'electronics',
    title: 'Wireless Mouse (Demo Listing)',
    description: 'Sample listing for demonstration. A working wireless mouse with its USB receiver.',
    condition: 'like_new', listing_type: 'resale', price: 250, original_price: 699,
    brand: null, locality: 'Kukatpally', pin_code: '500072', latitude: 17.4849, longitude: 78.4138,
    pickup_preference: 'public_place',
  },
]

async function ensureDemoUser(user, pageUsers) {
  let authUser = pageUsers.find(existing => existing.email?.toLowerCase() === user.email)

  if (!authUser) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: crypto.randomBytes(32).toString('base64url'),
      email_confirm: true,
      user_metadata: { full_name: user.full_name },
    })
    if (error) throw new Error(`Could not create ${user.full_name}: ${error.message}`)
    authUser = data.user
    pageUsers.push(authUser)
  }

  const { error } = await supabase.from('profiles').upsert({
    id: authUser.id,
    full_name: user.full_name,
    city: user.city,
    locality: user.locality,
    state: user.state,
    pin_code: user.pin_code,
    latitude: user.latitude,
    longitude: user.longitude,
    bio: user.bio,
    role: 'user',
    is_active: true,
  }, { onConflict: 'id' })
  if (error) throw new Error(`Could not save profile ${user.full_name}: ${error.message}`)

  return authUser.id
}

async function main() {
  const users = []
  for (let page = 1; ; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) throw new Error(`Could not list Auth users: ${error.message}`)
    users.push(...data.users)
    if (data.users.length < 1000) break
  }

  const { error: categorySeedError } = await supabase
    .from('categories')
    .upsert(CATEGORIES.map(([name, slug, description, icon]) => ({ name, slug, description, icon })), {
      onConflict: 'slug',
      ignoreDuplicates: true,
    })
  if (categorySeedError) throw new Error(`Could not ensure categories exist: ${categorySeedError.message}`)

  const categoryRows = await supabase.from('categories').select('id, slug')
  if (categoryRows.error) throw new Error(`Could not load categories: ${categoryRows.error.message}`)
  const categoryIds = new Map(categoryRows.data.map(category => [category.slug, category.id]))

  const userIds = []
  for (const user of DEMO_USERS) userIds.push(await ensureDemoUser(user, users))

  const products = DEMO_LISTINGS.map(listing => {
    const categoryId = categoryIds.get(listing.category)
    if (!categoryId) throw new Error(`Missing category "${listing.category}".`)
    const owner = DEMO_USERS[listing.owner]
    return {
      id: listing.id,
      owner_id: userIds[listing.owner],
      title: listing.title,
      description: listing.description,
      category_id: categoryId,
      condition: listing.condition,
      listing_type: listing.listing_type,
      price: listing.price,
      original_price: listing.original_price,
      brand: listing.brand,
      state: owner.state,
      city: owner.city,
      locality: listing.locality,
      pin_code: listing.pin_code,
      latitude: listing.latitude,
      longitude: listing.longitude,
      pickup_preference: listing.pickup_preference,
      status: 'active',
      is_draft: false,
    }
  })

  const { error: productError } = await supabase.from('products').upsert(products, { onConflict: 'id' })
  if (productError) throw new Error(`Could not save sample listings: ${productError.message}`)

  console.log(`Seeded ${products.length} clearly labeled sample listings across ${DEMO_USERS.length} demo accounts.`)
  console.log('Listings will be visible in Explore. Existing demo account passwords are not changed.')
}

main().catch(error => {
  console.error(`Demo data seeding failed: ${error.message}`)
  process.exitCode = 1
})
