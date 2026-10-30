-- ============================================================
-- Demo Users Setup
-- Run AFTER 001_schema.sql through 004_indexes.sql
--
-- Option A (Recommended for development/demo):
--   Disable email confirmation in Supabase Dashboard:
--   Authentication → Settings → uncheck "Enable email confirmations"
--   Then run: npm run seed:demo
--
-- Option B: Run this SQL to patch existing unconfirmed users
-- (only works if you've already run seed:demo and users exist)
-- ============================================================

-- After running `npm run seed:demo`, if users show as unconfirmed,
-- run the following to force-confirm all demo accounts:

UPDATE auth.users
SET
  email_confirmed_at = NOW(),
  confirmation_token  = '',
  confirmation_sent_at = NOW()
WHERE email IN (
  'citizen1@rbr.demo',
  'citizen2@rbr.demo',
  'citizen3@rbr.demo',
  'admin@rbr.demo'
)
AND email_confirmed_at IS NULL;

-- Verify:
SELECT email, email_confirmed_at, role FROM auth.users
WHERE email LIKE '%@rbr.demo';
