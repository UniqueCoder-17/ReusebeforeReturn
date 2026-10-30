const express = require('express')
const router = express.Router()
const { sendEmail } = require('../services/emailService')
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

function getSupabase() {
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

function loadTemplate(name) {
  try {
    return fs.readFileSync(path.join(__dirname, '../templates', `${name}.html`), 'utf8')
  } catch {
    return null
  }
}

function fillTemplate(template, vars) {
  if (!template) return Object.entries(vars).map(([k, v]) => `<p>${k}: ${v}</p>`).join('')
  return Object.entries(vars).reduce((t, [k, v]) => t.replaceAll(`{{${k}}}`, String(v ?? '')), template)
}

async function logDelivery(supabase, params) {
  if (!supabase) return
  try {
    await supabase.from('email_delivery_logs').insert(params)
  } catch (e) {
    console.error('[EmailRoute] Failed to log delivery:', e.message)
  }
}

async function isAlreadySent(supabase, idempotency_key) {
  if (!supabase || !idempotency_key) return false
  const { data } = await supabase
    .from('email_delivery_logs')
    .select('id')
    .eq('idempotency_key', idempotency_key)
    .eq('status', 'sent')
    .maybeSingle()
  return !!data
}

const TEMPLATES = {
  welcome: 'Welcome to Reuse Before Return! 🌱',
  new_request: 'Someone wants your item — Reuse Before Return',
  request_accepted: 'Your request was accepted! — Reuse Before Return',
  request_rejected: 'Update on your request — Reuse Before Return',
  new_message: 'New message — Reuse Before Return',
  availability_alert: 'An item you saved is available — Reuse Before Return',
  redistribution_complete: '🎉 Item redistributed! — Reuse Before Return',
  password_reset: 'Reset your password — Reuse Before Return',
  daily_digest: 'Your daily digest — Reuse Before Return',
}

router.post('/send', async (req, res) => {
  const { type, to, vars = {}, user_id, idempotency_key } = req.body
  if (!type || !to) return res.status(400).json({ error: 'type and to are required' })

  const subject = TEMPLATES[type]
  if (!subject) return res.status(400).json({ error: `Unknown email type: ${type}` })

  const supabase = getSupabase()
  if (idempotency_key && await isAlreadySent(supabase, idempotency_key)) {
    return res.json({ success: true, deduplicated: true })
  }

  const template = loadTemplate(type)
  const html = fillTemplate(template, {
    ...vars,
    app_name: 'Reuse Before Return',
    app_url: process.env.VITE_APP_URL || 'http://localhost:5173',
  })

  try {
    const result = await sendEmail({ to, subject, html })
    await logDelivery(supabase, {
      user_id, email_type: type, recipient_email: to,
      status: result.skipped ? 'skipped' : 'sent', idempotency_key,
    })
    res.json({ success: true, ...result })
  } catch (err) {
    await logDelivery(supabase, {
      user_id, email_type: type, recipient_email: to,
      status: 'failed', error_message: err.message, idempotency_key,
    })
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
