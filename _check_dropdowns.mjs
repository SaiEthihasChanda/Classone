import puppeteer from 'puppeteer-core'
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox'], defaultViewport: { width: 1440, height: 900 } })
const page = await browser.newPage()
await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' })
await new Promise(r => setTimeout(r, 800))
// Hover Products
const links = await page.$$('a.nav__link, button.nav__link')
for (const link of links) {
  const text = await link.evaluate(el => el.textContent)
  if (text.includes('Products')) { await link.hover(); await new Promise(r => setTimeout(r, 600)); break }
}
// Force visible
await page.addStyleTag({ content: '.nav__dropdown-panel { opacity: 1 !important; visibility: visible !important; pointer-events: auto !important; }' })
await new Promise(r => setTimeout(r, 300))
const info = await page.evaluate(() => {
  const panels = document.querySelectorAll('.nav__dropdown-panel')
  return Array.from(panels).map(p => {
    const r = p.getBoundingClientRect()
    return { class: p.className.substring(0, 60), top: Math.round(r.top), left: Math.round(r.left), width: Math.round(r.width) }
  })
})
console.log(JSON.stringify(info, null, 2))
await page.screenshot({ path: 'review-images/local-products-dropdown.png' })
await browser.close()
console.log('done')
