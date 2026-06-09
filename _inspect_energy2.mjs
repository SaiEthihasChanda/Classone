import puppeteer from 'puppeteer-core'
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox'], defaultViewport: { width: 1440, height: 900 } })
const page = await browser.newPage()
await page.goto('https://classonesystems.in/energy/', { waitUntil: 'networkidle2', timeout: 60000 })
await new Promise(r => setTimeout(r, 2000))
// Kill modals
await page.evaluate(() => {
  document.querySelectorAll('body *').forEach(el => {
    const cs = getComputedStyle(el)
    if (cs.position === 'fixed') { const r = el.getBoundingClientRect(); if (r.height > innerHeight * 0.6 && r.width > innerWidth * 0.4 && +cs.zIndex >= 99) el.remove() }
  })
})
// Get hero area background and structure
const info = await page.evaluate(() => {
  // Find the main hero section (usually the first large section)
  const sections = document.querySelectorAll('.elementor-section, .e-con')
  const results = []
  for (let i = 0; i < Math.min(3, sections.length); i++) {
    const s = sections[i]
    const r = s.getBoundingClientRect()
    if (r.top > 200) continue
    const bg = getComputedStyle(s).backgroundColor
    const bgImg = getComputedStyle(s).backgroundImage
    results.push({ index: i, bg, bgImg: bgImg.substring(0, 80), height: r.height, class: s.className.substring(0, 100) })
  }
  return results
})
console.log(JSON.stringify(info, null, 2))
await browser.close()
