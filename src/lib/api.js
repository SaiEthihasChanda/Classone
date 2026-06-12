/**
 * Tiny API client. Same-origin `/api/...` (Vite proxies to the backend in dev,
 * and it works through ngrok too). All reads/writes go through here, so moving
 * to a different backend later is a one-file change.
 */
const BASE = '/api'

async function request(path, options) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = new Error(`${options?.method || 'GET'} ${path} → ${res.status}`)
    err.status = res.status
    throw err
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  get: (path) => request(path),
  list: (entity) => request(`/${entity}`),
  getOne: (entity, id) => request(`/${entity}/${encodeURIComponent(id)}`),
  create: (entity, body) => request(`/${entity}`, { method: 'POST', body: JSON.stringify(body) }),
  update: (entity, id, body) => request(`/${entity}/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(body) }),
  remove: (entity, id) => request(`/${entity}/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  bootstrap: () => request('/bootstrap'),
}
