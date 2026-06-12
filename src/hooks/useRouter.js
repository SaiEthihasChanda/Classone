import { useCallback, useEffect, useState } from 'react'
import { normalizePath } from '../utils'

export function useRouter() {
  const [pathname, setPathname] = useState(() => normalizePath(window.location.pathname))

  useEffect(() => {
    const onPop = () => setPathname(normalizePath(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Scroll to top on every route change
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }) }, [pathname])

  const navigate = useCallback((href) => {
    const next = normalizePath(new URL(href, window.location.origin).pathname)
    if (next !== normalizePath(window.location.pathname)) {
      window.history.pushState({}, '', next)
      setPathname(next)
    }
  }, [])

  return { pathname, navigate }
}
