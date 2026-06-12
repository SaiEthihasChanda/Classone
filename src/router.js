import { normalizePath } from './utils'
import { HomePage }               from './pages/HomePage'
import { AboutPage }              from './pages/AboutPage'
import { ProductsPage }           from './pages/ProductsPage'
import { ProductDetailPage }      from './pages/ProductDetailPage'
import { CategoryPage }           from './pages/CategoryPage'
import { SoftwarePage }           from './pages/SoftwarePage'
import { SoftwareDetailPage }     from './pages/SoftwareDetailPage'
import { ResourcesPage }          from './pages/ResourcesPage'
import { ApplicationsPage }       from './pages/ApplicationsPage'
import { ApplicationDetailPage }  from './pages/ApplicationDetailPage'
import { BatteriesPage }          from './pages/BatteriesPage'
import { ContactPage }            from './pages/ContactPage'
import { NewsPage }               from './pages/NewsPage'
import { EventPage }              from './pages/EventPage'
import { EnquiryPage }            from './pages/EnquiryPage'
import { NotFoundPage }           from './pages/NotFoundPage'

const categoryRoutes = [
  'single-channel-electrochemical',
  'multi-channel-electrochemical',
  'electrochemical-development-kit',
  'corrtest',
  'tob',
  'nano-technology',
  'electrodes',
  'glass-cell',
  'electrochemical-accessories',
]

const softwareDetailRoutes = ['ps-trace', 'multitrace-2', 'pstouch-2', 'pstrace-xpress-2']

export function resolveRoute(pathname) {
  const path = normalizePath(pathname)

  if (path === '/') return { title: 'ClassOne Systems', component: HomePage }
  if (path === '/about') return { title: 'About Us — ClassOne Systems', component: AboutPage }
  if (path === '/product') return { title: 'Products — ClassOne Systems', component: ProductsPage }
  if (path === '/software') return { title: 'Software — ClassOne Systems', component: SoftwarePage }
  if (path === '/resources') return { title: 'Resources — ClassOne Systems', component: ResourcesPage }
  if (path === '/applications') return { title: 'Applications — ClassOne Systems', component: ApplicationsPage }
  if (path === '/batteries') return { title: 'Batteries — ClassOne Systems', component: BatteriesPage }
  if (path === '/contact' || path === '/contact/') return { title: 'Contact — ClassOne Systems', component: ContactPage }
  if (path === '/news') return { title: 'News — ClassOne Systems', component: NewsPage }
  if (path === '/event' || path === '/event/') return { title: 'Event — ClassOne Systems', component: EventPage }
  if (path === '/enquiry' || path === '/enquiry/') return { title: 'Enquiry — ClassOne Systems', component: EnquiryPage }

  // Application detail pages
  if (path === '/spectroelectrochemistry' || path === '/spectroelectrochemistry/') {
    return { title: 'Spectroelectrochemistry — ClassOne Systems', component: ApplicationDetailPage, pageProps: { pageKey: 'spectroelectrochemistry' } }
  }
  if (path === '/educational-kit' || path === '/educational-kit/') {
    return { title: 'Educational Kit — ClassOne Systems', component: ApplicationDetailPage, pageProps: { pageKey: 'educationalKit' } }
  }
  if (path === '/corrosion-package' || path === '/corrosion-package/') {
    return { title: 'Corrosion Package — ClassOne Systems', component: ApplicationDetailPage, pageProps: { pageKey: 'corrosionPackage' } }
  }

  // Software detail pages
  for (const slug of softwareDetailRoutes) {
    if (path === `/${slug}` || path === `/${slug}/`) {
      return { title: `Software — ClassOne Systems`, component: SoftwareDetailPage, pageProps: { slug } }
    }
  }

  // Category pages
  for (const key of categoryRoutes) {
    if (path === `/${key}` || path === `/${key}/`) {
      return { title: `Products — ClassOne Systems`, component: CategoryPage, pageProps: { categoryKey: key } }
    }
  }

  // Product detail pages — slug is the last path segment (matches the DB key)
  if (path.startsWith('/product/')) {
    const slug = path.replace(/^\/product\//, '').replace(/\/$/, '')
    return { title: 'Product — ClassOne Systems', component: ProductDetailPage, pageProps: { slug } }
  }

  return { title: 'Page Not Found — ClassOne Systems', component: NotFoundPage }
}
