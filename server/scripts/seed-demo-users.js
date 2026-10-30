/**
 * seed-demo-users.js
 * Creates demo users in Supabase Auth + profiles table.
 * Run ONCE after applying migrations:
 *   node server/scripts/seed-demo-users.js
 *
 * Requires VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in ../.env
 */

require('dotenv').config({ path: '../../.env' })
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('\n❌ Missing env vars. Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env\n')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const DEMO_USERS = [
  {
    email: 'citizen1@rbr.demo',
    password: 'Demo@1234',
    full_name: 'Arjun Reddy',
    phone: '9876543210',
    role: 'user',
    state: 'Telangana',
    city: 'Hyderabad',
    locality: 'Banjara Hills',
    pin_code: '500034',
    bio: 'Tech enthusiast from Hyderabad. Love giving items a second life!',
    latitude: 17.4156,
    longitude: 78.4485,
  },
  {
    email: 'citizen2@rbr.demo',
    password: 'Demo@1234',
    full_name: 'Priya Sharma',
    phone: '9823456781',
    role: 'user',
    state: 'Telangana',
    city: 'Hyderabad',
    locality: 'Kondapur',
    pin_code: '500084',
    bio: 'Minimalist living in Kondapur. Happy to share what I don\'t need.',
    latitude: 17.4700,
    longitude: 78.3546,
  },
  {
    email: 'citizen3@rbr.demo',
    password: 'Demo@1234',
    full_name: 'Ravi Kumar',
    phone: '9901234567',
    role: 'user',
    state: 'Telangana',
    city: 'Hyderabad',
    locality: 'Madhapur',
    pin_code: '500081',
    bio: 'Software engineer. Firm believer in reducing e-waste.',
    latitude: 17.4486,
    longitude: 78.3908,
  },
  {
    email: 'admin@rbr.demo',
    password: 'Admin@1234',
    full_name: 'Platform Admin',
    phone: '9000000001',
    role: 'admin',
    state: 'Telangana',
    city: 'Hyderabad',
    locality: 'Jubilee Hills',
    pin_code: '500033',
    bio: 'Platform administrator for Reuse Before Return.',
    latitude: 17.4317,
    longitude: 78.4089,
  },
]

async function createDemoUser(userData) {
  const { email, password, role, full_name, phone, state, city, locality, pin_code, bio, latitude, longitude } = userData

  console.log(`\n→ Creating user: ${email}`)

  // 1. Check if user already exists by listing users and filtering
  const { data: existingUsers } = await supabase.auth.admin.listUsers()
  const existing = existingUsers?.users?.find(u => u.email === email)

  let userId

  if (existing) {
    console.log(`  ℹ️  Auth user already exists (id: ${existing.id}), updating password...`)
    userId = existing.id
    // Update password
    await supabase.auth.admin.updateUserById(userId, {
      password,
      email_confirm: true,
    })
  } else {
    // Create auth user — email_confirm: true skips email verification
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,   // ← THIS skips email verification completely
      user_metadata: { full_name, role },
    })

    if (error) {
      console.error(`  ❌ Failed to create auth user: ${error.message}`)
      return false
    }

    userId = data.user.id
    console.log(`  ✅ Auth user created (id: ${userId})`)
  }

  // 2. Upsert profile
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userId,
    full_name,
    phone,
    role,
    state,
    city,
    locality,
    pin_code,
    bio,
    latitude,
    longitude,
    is_active: true,
  }, { onConflict: 'id' })

  if (profileError) {
    console.error(`  ❌ Failed to upsert profile: ${profileError.message}`)
    return false
  }

  console.log(`  ✅ Profile upserted — role: ${role}, city: ${city}`)
  return true
}

async function main() {
  console.log('\n🌱 Seeding demo users for Reuse Before Return...')
  console.log(`   Supabase: ${SUPABASE_URL}\n`)

  let success = 0
  for (const user of DEMO_USERS) {
    const ok = await createDemoUser(user)
    if (ok) success++
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`✅ Done! ${success}/${DEMO_USERS.length} demo users ready.\n`)
  console.log('Demo Credentials:')
  console.log('─────────────────────────────────────────')
  console.log('  citizen1@rbr.demo  / Demo@1234  (Arjun Reddy, Hyderabad)')
  console.log('  citizen2@rbr.demo  / Demo@1234  (Priya Sharma, Hyderabad)')
  console.log('  citizen3@rbr.demo  / Demo@1234  (Ravi Kumar, Hyderabad)')
  console.log('  admin@rbr.demo     / Admin@1234 (Platform Admin)')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
