/**
 * server/db/neon.js
 * Neon serverless PostgreSQL client.
 * Stores email_accounts and email_logs in a dedicated serverless DB.
 *
 * Setup:
 *   1. Create a free project at https://neon.tech
 *   2. Copy the connection string into .env as NEON_DATABASE_URL
 *   3. Run migrations: node server/db/migrate.js
 */

const { neon } = require('@neondatabase/serverless')

let _sql = null

function getDb() {
  if (_sql) return _sql
  const url = process.env.NEON_DATABASE_URL
  if (!url || url.includes('your-neon')) {
    console.warn(
      '[Neon] NEON_DATABASE_URL not configured — email logs will be skipped. ' +
      'Set it in .env to enable persistent email logging.'
    )
    return null
  }
  _sql = neon(url)
  return _sql
}

/**
 * Log an email delivery event to Neon.
 * @param {object} params
 */
async function logEmailDelivery({ user_id, email_type, recipient_email, status, error_message, idempotency_key }) {
  const sql = getDb()
  if (!sql) return
  try {
    await sql`
      INSERT INTO email_logs
        (user_id, email_type, recipient_email, status, error_message, idempotency_key)
      VALUES
        (${user_id ?? null}, ${email_type}, ${recipient_email}, ${status}, ${error_message ?? null}, ${idempotency_key ?? null})
      ON CONFLICT (idempotency_key) DO UPDATE
        SET status = EXCLUDED.status,
            error_message = EXCLUDED.error_message
    `
  } catch (err) {
    console.error('[Neon] Failed to log email delivery:', err.message)
  }
}

/**
 * Check whether an email with this idempotency key was already sent.
 * @param {string} idempotency_key
 * @returns {Promise<boolean>}
 */
async function isAlreadySent(idempotency_key) {
  if (!idempotency_key) return false
  const sql = getDb()
  if (!sql) return false
  try {
    const rows = await sql`
      SELECT id FROM email_logs
      WHERE idempotency_key = ${idempotency_key}
        AND status = 'sent'
      LIMIT 1
    `
    return rows.length > 0
  } catch (err) {
    console.error('[Neon] isAlreadySent check failed:', err.message)
    return false
  }
}

/**
 * Fetch all active SMTP accounts from Neon.
 * @returns {Promise<Array>}
 */
async function getActiveEmailAccounts() {
  const sql = getDb()
  if (!sql) return []
  try {
    const rows = await sql`
      SELECT * FROM email_accounts WHERE is_active = TRUE ORDER BY id
    `
    return rows
  } catch (err) {
    console.error('[Neon] Failed to fetch email accounts:', err.message)
    return []
  }
}

/**
 * Fetch recent email logs (for admin dashboard use).
 * @param {number} limit
 * @returns {Promise<Array>}
 */
async function getRecentLogs(limit = 50) {
  const sql = getDb()
  if (!sql) return []
  try {
    return await sql`
      SELECT * FROM email_logs ORDER BY sent_at DESC LIMIT ${limit}
    `
  } catch (err) {
    console.error('[Neon] Failed to fetch email logs:', err.message)
    return []
  }
}

module.exports = { getDb, logEmailDelivery, isAlreadySent, getActiveEmailAccounts, getRecentLogs }
