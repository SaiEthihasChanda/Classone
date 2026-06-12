/**
 * Generic REST routes, generated from the entity registry.
 *
 * For every entity the same endpoints exist — this is what makes a future
 * admin UI trivial (one set of forms drives every content type):
 *
 *   GET    /api/<entity>            list
 *   GET    /api/<entity>/:id        one (by slug or _id)
 *   POST   /api/<entity>            create
 *   PATCH  /api/<entity>/:id        update
 *   DELETE /api/<entity>/:id        delete
 *
 * Singletons (settings) expose:
 *   GET    /api/<entity>            the single document
 *   PATCH  /api/<entity>            update it
 *
 * Plus:
 *   GET /api/bootstrap   one round-trip with the light collections the site
 *                        chrome + home page need, so first paint isn't N calls.
 *   GET /api/_meta       the registry (for a future admin UI to render itself)
 */
import { Router } from 'express'
import { entities, getEntity } from './registry.js'
import { repository as repo } from './repository.js'

const asyncH = (fn) => (req, res) => fn(req, res).catch((err) => {
  console.error('[api]', err)
  res.status(500).json({ error: err.message })
})

export function buildRouter() {
  const router = Router()

  // Registry metadata — lets an admin UI discover entities + their fields.
  router.get('/_meta', (_req, res) => res.json({ entities }))

  // Bootstrap: collections needed up-front by layout + home.
  router.get('/bootstrap', asyncH(async (_req, res) => {
    const names = ['settings', 'slides', 'areas', 'homeProducts', 'newProducts',
      'segments', 'testimonials', 'certificates', 'clients', 'contactMethods', 'categories']
    const out = {}
    await Promise.all(names.map(async (n) => { out[n] = await repo.list(n) }))
    // settings is a singleton → unwrap to an object
    out.settings = out.settings[0] || {}
    res.json(out)
  }))

  for (const ent of entities) {
    const base = `/${ent.name}`

    if (ent.singleton) {
      router.get(base, asyncH(async (_req, res) => {
        const list = await repo.list(ent.name)
        res.json(list[0] || {})
      }))
      router.patch(base, asyncH(async (req, res) => {
        const existing = (await repo.list(ent.name))[0]
        if (!existing) {
          const created = await repo.create(ent.name, req.body)
          return res.status(201).json(created)
        }
        const updated = await repo.update(ent.name, '_id', existing.id, req.body)
        res.json(updated)
      }))
      continue
    }

    const idField = ent.idField || '_id'

    router.get(base, asyncH(async (_req, res) => {
      res.json(await repo.list(ent.name))
    }))

    router.get(`${base}/:id`, asyncH(async (req, res) => {
      const doc = await repo.get(ent.name, idField, req.params.id)
      if (!doc) return res.status(404).json({ error: `${ent.name} not found` })
      res.json(doc)
    }))

    router.post(base, asyncH(async (req, res) => {
      res.status(201).json(await repo.create(ent.name, req.body))
    }))

    router.patch(`${base}/:id`, asyncH(async (req, res) => {
      const doc = await repo.update(ent.name, idField, req.params.id, req.body)
      if (!doc) return res.status(404).json({ error: `${ent.name} not found` })
      res.json(doc)
    }))

    router.delete(`${base}/:id`, asyncH(async (req, res) => {
      const ok = await repo.remove(ent.name, idField, req.params.id)
      if (!ok) return res.status(404).json({ error: `${ent.name} not found` })
      res.status(204).end()
    }))
  }

  return router
}
