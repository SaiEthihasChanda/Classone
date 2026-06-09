import puppeteer from 'puppeteer-core'
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox'], defaultViewport: { width: 1440, height: 900 } })
const page = await browser.newPage()
await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' })
await new Promise(r => setTimeout(r, 800))
const info = await page.evaluate(() => {
  const panel = document.querySelector('.nav__dropdown-panel--mega')
  if (!panel) return { error: 'no panel' }
  // Walk up the DOM to find all positioned ancestors
  const ancestors = []
  let el = panel.parentElement
  while (el && el !== document.body) {
    const pos = getComputedStyle(el).position
    const r = el.getBoundingClientRect()
    ancestors.push({ tag: el.tagName, class: el.className.substring(0, 50), position: pos, width: r.width, height: r.height })
    if (pos !== 'static') break
    el = el.parentElement
  }
  return ancestors
})
console.log(JSON.stringify(info, null, 2))
await browser.close()
