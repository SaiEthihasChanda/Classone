import { normalizePath } from './utils'
import { HomePage }               from './pages/HomePage'
import { AboutPage }              from './pages/AboutPage'
import { ProductsPage }           from './pages/ProductsPage'
import { ProductDetailPage }      from './pages/ProductDetailPage'
import { CategoryPage }           from './pages/CategoryPage'
import { SoftwarePage }           from './pages/SoftwarePage'
import { MyosPage }               from './pages/MyosPage'
import { SoftwareDetailPage }     from './pages/SoftwareDetailPage'
import { ResourcesPage }          from './pages/ResourcesPage'
import { ApplicationDetailPage }  from './pages/ApplicationDetailPage'
import { BatteriesPage }          from './pages/BatteriesPage'
import { ContactPage }            from './pages/ContactPage'
import { NewsPage }               from './pages/NewsPage'
import { NewsPostPage }           from './pages/NewsPostPage'
import { EventPage }              from './pages/EventPage'
import { EnquiryPage }            from './pages/EnquiryPage'
import { LoginPage }              from './pages/LoginPage'
import { AdminDashboardPage }     from './pages/AdminDashboardPage'
import { AdminProductsPage }      from './pages/AdminProductsPage'
import { AdminSiteManagerPage }   from './pages/AdminSiteManagerPage'
import { AdminNewsPage }          from './pages/AdminNewsPage'
import { AdminRecoveryPage }      from './pages/AdminRecoveryPage'
import { AdminAdminsPage }        from './pages/AdminAdminsPage'
import { AdminAccountPage }       from './pages/AdminAccountPage'
import { AdminEnquiriesPage }     from './pages/AdminEnquiriesPage'
import { NotFoundPage }           from './pages/NotFoundPage'

const categoryRoutes = [
  'single-channel-electrochemical',
  'multi-channel-electrochemical',
  'electrochemical-development-kit',
  'application-kits',
  'corrtest',
  'tob',
  'nano-technology',
  'electrodes',
  'glass-cell',
]

const softwareDetailRoutes = ['ps-trace', 'multitrace-2', 'pstouch-2', 'pstrace-xpress-2']

// Category slugs that resolve to a CategoryPage. Seeded with the built-in
// categories; the taxonomy provider registers admin-created ones at runtime so
// new category pages resolve without a code change.
let dynamicCategorySlugs = new Set(categoryRoutes)
export function registerCategorySlugs(slugs) {
  dynamicCategorySlugs = new Set([...categoryRoutes, ...(slugs || [])])
}

export function resolveRoute(pathname) {
  const path = normalizePath(pathname)

  if (path === '/') return { title: 'ClassOne Systems', component: HomePage }
  if (path === '/about') return { title: 'About Us — ClassOne Systems', component: AboutPage }
  if (path === '/product') return { title: 'Products — ClassOne Systems', component: ProductsPage }
  if (path === '/software') return { title: 'Software — ClassOne Systems', component: SoftwarePage }
  if (path === '/myos' || path === '/myos/') return { title: 'MYOS — Make Your Own Software — ClassOne Systems', component: MyosPage }
  if (path === '/resources') return { title: 'Resources — ClassOne Systems', component: ResourcesPage }
  if (path === '/batteries') return { title: 'Batteries — ClassOne Systems', component: BatteriesPage }
  if (path === '/contact' || path === '/contact/') return { title: 'Contact — ClassOne Systems', component: ContactPage }
  if (path === '/news') return { title: 'News — ClassOne Systems', component: NewsPage }
  if (path.startsWith('/news/')) {
    const slug = path.replace(/^\/news\//, '').replace(/\/$/, '')
    return { title: 'News — ClassOne Systems', component: NewsPostPage, pageProps: { slug } }
  }
  if (path === '/event' || path === '/event/') return { title: 'Event — ClassOne Systems', component: EventPage }
  if (path === '/enquiry' || path === '/enquiry/') return { title: 'Enquiry — ClassOne Systems', component: EnquiryPage }
  if (path === '/login' || path === '/login/') return { title: 'Admin Sign In — ClassOne Systems', component: LoginPage }
  if (path === '/admin' || path === '/admin/') return { title: 'Admin Dashboard — ClassOne Systems', component: AdminDashboardPage }
  if (path === '/admin/products' || path === '/admin/products/') return { title: 'Manage Products — ClassOne Systems', component: AdminProductsPage }
  if (path === '/admin/site' || path === '/admin/site/') return { title: 'Site Manager — ClassOne Systems', component: AdminSiteManagerPage }
  // Old standalone carousel route → Site Manager (carousel tab) for back-compat.
  if (path === '/admin/carousel' || path === '/admin/carousel/') return { title: 'Site Manager — ClassOne Systems', component: AdminSiteManagerPage, pageProps: { tab: 'carousel' } }
  if (path === '/admin/news' || path === '/admin/news/') return { title: 'News Manager — ClassOne Systems', component: AdminNewsPage }
  if (path === '/admin/recovery' || path === '/admin/recovery/') return { title: 'Recovery — ClassOne Systems', component: AdminRecoveryPage }
  if (path === '/admin/admins' || path === '/admin/admins/') return { title: 'Admins — ClassOne Systems', component: AdminAdminsPage }
  if (path === '/admin/account' || path === '/admin/account/') return { title: 'Account — ClassOne Systems', component: AdminAccountPage }
  if (path === '/admin/enquiries' || path === '/admin/enquiries/') return { title: 'Enquiries — ClassOne Systems', component: AdminEnquiriesPage }

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

  // Category pages (built-in + admin-created, registered at runtime)
  for (const key of dynamicCategorySlugs) {
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
