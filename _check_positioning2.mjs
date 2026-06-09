import puppeteer from 'puppeteer-core'
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox'], defaultViewport: { width: 1440, height: 900 } })
const page = await browser.newPage()
await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' })
await new Promise(r => setTimeout(r, 800))
// Force menu via React hover first
const links = await page.$$('a.nav__link, button.nav__link')
for (const link of links) {
  const text = await link.evaluate(el => el.textContent)
  if (text.includes('Software')) { await link.hover(); await new Promise(r => setTimeout(r, 600)); break }
}
// Force via CSS
await page.addStyleTag({ content: '.nav__dropdown-panel--mega { opacity: 1 !important; visibility: visible !important; pointer-events: auto !important; display: block !important; }' })
await new Promise(r => setTimeout(r, 300))
const info = await page.evaluate(() => {
  const panel = document.querySelector('.nav__dropdown-panel--mega')
  if (!panel) return { error: 'still no panel', allPanels: document.querySelectorAll('[class*="mega"]').length }
  const ancestors = []
  let el = panel.parentElement
  while (el && el !== document.body) {
    const pos = getComputedStyle(el).position
    const r = el.getBoundingClientRect()
    ancestors.push({ tag: el.tagName, class: el.className.substring(0, 60), position: pos, width: Math.round(r.width), height: Math.round(r.height) })
    if (pos !== 'static') break
    el = el.parentElement
  }
  const panelRect = panel.getBoundingClientRect()
  return { found: true, panelRect: { top: panelRect.top, left: panelRect.left, width: panelRect.width }, ancestors }
})
console.log(JSON.stringify(info, null, 2))
await browser.close()
