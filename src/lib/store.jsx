/**
 * Data store for the frontend.
 *
 * - <DataProvider> runs api.bootstrap() once (site settings + the collections
 *   the chrome and home page need) and shares it via context. The app shell
 *   waits for this so Header/Footer/Home always have data.
 * - useSite()        → the bootstrap payload (settings, slides, areas, …)
 * - useCollection(n) → fetch a full collection on demand (lists)
 * - useEntity(n, id) → fetch one document by slug/id (detail pages)
 *
 * The backend is Cloud Firestore, reached only through src/lib/api.js — these
 * hooks stay the same regardless of where the data lives.
 */
import { createContext, useContext, useEffect, useState } from 'react'
import { api } from './api'

const SiteContext = createContext(null)

export function DataProvider({ children }) {
  const [state, setState] = useState({ ready: false, error: null, data: null })

  useEffect(() => {
    let alive = true
    api.bootstrap()
      .then((data) => alive && setState({ ready: true, error: null, data }))
      .catch((error) => alive && setState({ ready: false, error, data: null }))
    return () => { alive = false }
  }, [])

  return <SiteContext.Provider value={state}>{children}</SiteContext.Provider>
}

/** Bootstrap status for the shell loader. */
export function useBootstrap() {
  return useContext(SiteContext) || { ready: false, error: null, data: null }
}

/** The site-wide data (settings + home collections). Safe empty defaults. */
export function useSite() {
  const ctx = useContext(SiteContext)
  return ctx?.data || {}
}

/** Convenience: site settings object (contact, nav, assets, about, …). */
export function useSettings() {
  return useSite().settings || {}
}

/** Editorial page copy (all headings, summaries, CTA text — modularised). */
export function useContent() {
  return useSite().content || {}
}

/** Fetch a whole collection on demand. */
export function useCollection(name) {
  const [data, setData] = useState(null)
  useEffect(() => {
    let alive = true
    setData(null)
    api.list(name)
      .then((d) => alive && setData(d))
      .catch(() => alive && setData([]))
    return () => { alive = false }
  }, [name])
  return { data: data || [], loading: data === null }
}

/** All products (nested catalog), ordered by menu. */
export function useProducts() {
  const [data, setData] = useState(null)
  useEffect(() => {
    let alive = true
    api.listProducts()
      .then((d) => alive && setData(d))
      .catch(() => alive && setData([]))
    return () => { alive = false }
  }, [])
  return { data: data || [], loading: data === null }
}

/** Every catalog entry across all menus (includes external links). */
export function useCatalog() {
  const [data, setData] = useState(null)
  useEffect(() => {
    let alive = true
    api.listCatalog()
      .then((d) => alive && setData(d))
      .catch(() => alive && setData([]))
    return () => { alive = false }
  }, [])
  return { data: data || [], loading: data === null }
}

/** Products within one menu category (includes external catalog links). */
export function useProductsByCategory(category) {
  const [data, setData] = useState(null)
  useEffect(() => {
    let alive = true
    setData(null)
    api.listProductsByCategory(category)
      .then((d) => alive && setData(d))
      .catch(() => alive && setData([]))
    return () => { alive = false }
  }, [category])
  return { data: data || [], loading: data === null }
}

/** One product by slug. status: 'loading' | 'ready' | 'notfound'. */
export function useProductBySlug(slug) {
  const [state, setState] = useState({ data: null, status: 'loading' })
  useEffect(() => {
    let alive = true
    setState({ data: null, status: 'loading' })
    api.getProductBySlug(slug)
      .then((d) => alive && setState({ data: d, status: 'ready' }))
      .catch(() => alive && setState({ data: null, status: 'notfound' }))
    return () => { alive = false }
  }, [slug])
  return { ...state, loading: state.status === 'loading' }
}

/** Fetch one document by id/slug. status: 'loading' | 'ready' | 'notfound'. */
export function useEntity(name, id) {
  const [state, setState] = useState({ data: null, status: 'loading' })
  useEffect(() => {
    let alive = true
    setState({ data: null, status: 'loading' })
    api.getOne(name, id)
      .then((d) => alive && setState({ data: d, status: 'ready' }))
      .catch(() => alive && setState({ data: null, status: 'notfound' }))
    return () => { alive = false }
  }, [name, id])
  return { ...state, loading: state.status === 'loading' }
}
