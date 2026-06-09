import puppeteer from 'puppeteer-core'
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox'], defaultViewport: { width: 1440, height: 900 } })
const page = await browser.newPage()
await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' })
await new Promise(r => setTimeout(r, 1000))
// Hover and also force the menu to show via CSS injection so we can see it
const links = await page.$$('a.nav__link, button.nav__link')
for (const link of links) {
  const text = await link.evaluate(el => el.textContent)
  if (text.includes('Software')) {
    await link.hover()
    await new Promise(r => setTimeout(r, 800))
    break
  }
}
// Force menu visible in case hover didn't trigger React state
await page.addStyleTag({ content: '.nav__dropdown-panel--mega { opacity: 1 !important; visibility: visible !important; pointer-events: auto !important; }' })
await new Promise(r => setTimeout(r, 300))
const menuInfo = await page.evaluate(() => {
  const panel = document.querySelector('.nav__dropdown-panel--mega')
  if (!panel) return { found: false }
  const r = panel.getBoundingClientRect()
  return { found: true, top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width }
})
console.log('Menu position:', JSON.stringify(menuInfo))
await page.screenshot({ path: 'review-images/local-mega-fixed.png' })
await browser.close()
console.log('done')
