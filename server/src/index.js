import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connect } from './db.js'
import { buildRouter } from './routes.js'

const PORT = process.env.PORT || 4000

async function main() {
  await connect()

  const app = express()
  app.use(cors())
  app.use(express.json({ limit: '4mb' }))

  app.get('/api/health', (_req, res) => res.json({ ok: true }))
  app.use('/api', buildRouter())

  app.listen(PORT, () => console.log(`[api] listening on http://localhost:${PORT}`))
}

main().catch((err) => {
  console.error('[api] failed to start:', err)
  process.exit(1)
})
