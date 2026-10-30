require('dotenv').config({ path: '../.env' })
const express = require('express')
const cors = require('cors')
const emailRoutes = require('./routes/email')

const app = express()
const PORT = process.env.SERVER_PORT || 3001

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:4173',
    process.env.VITE_APP_URL || 'http://localhost:5173',
  ],
  credentials: true,
}))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/email', emailRoutes)

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.use((err, req, res, _next) => {
  console.error('[Server Error]', err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`[Reuse Before Return] Email server running on http://localhost:${PORT}`)
  if (!process.env.SMTP_HOST) {
    console.warn('[Warning] SMTP_HOST not configured. Email sending will be skipped. Set SMTP env vars to enable.')
  }
})
