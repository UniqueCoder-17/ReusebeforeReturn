const nodemailer = require('nodemailer')

let transporter = null

function getTransporter() {
  if (transporter) return transporter
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn('[EmailService] SMTP not configured — emails will be skipped')
    return null
  }
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '587', 10),
    secure: parseInt(SMTP_PORT || '587', 10) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })
  return transporter
}

async function sendEmail({ to, subject, html }) {
  const t = getTransporter()
  if (!t) {
    console.log(`[EmailService] SMTP not configured. Would send: "${subject}" to ${to}`)
    return { skipped: true }
  }
  try {
    const info = await t.sendMail({
      from: process.env.SMTP_FROM || '"Reuse Before Return" <noreply@reusebeforereturn.in>',
      to, subject, html,
    })
    console.log(`[EmailService] Sent: "${subject}" to ${to} — ${info.messageId}`)
    return { success: true, messageId: info.messageId }
  } catch (err) {
    console.error(`[EmailService] Failed to send "${subject}" to ${to}:`, err.message)
    throw err
  }
}

module.exports = { sendEmail }
