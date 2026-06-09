import puppeteer from 'puppeteer-core'
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox'], defaultViewport: { width: 1440, height: 900 } })
const page = await browser.newPage()
await page.goto('https://classonesystems.in', { waitUntil: 'networkidle2', timeout: 60000 })
await new Promise(r => setTimeout(r, 2000))
// Kill modals
await page.evaluate(() => {
  document.querySelectorAll('body *').forEach(el => {
    const cs = getComputedStyle(el)
    if (cs.position === 'fixed') { const r = el.getBoundingClientRect(); if (r.height > innerHeight * 0.6 && r.width > innerWidth * 0.4 && +cs.zIndex >= 99) el.remove() }
  })
})
// Hover over Software link in the source
const menuItems = await page.$$('.elementor-nav-menu a, nav a')
for (const item of menuItems) {
  const text = await item.evaluate(el => el.textContent.trim())
  if (text === 'Software') {
    await item.hover()
    await new Promise(r => setTimeout(r, 800))
    break
  }
}
await page.screenshot({ path: 'review-images/src-software-dropdown.png' })
await browser.close()
console.log('done')
