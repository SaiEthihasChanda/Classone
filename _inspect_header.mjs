import puppeteer from 'puppeteer-core'
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox'], defaultViewport: { width: 1440, height: 900 } })
const page = await browser.newPage()
await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' })
await new Promise(r => setTimeout(r, 800))
const info = await page.evaluate(() => {
  const results = []
  document.querySelectorAll('header, nav, .header-bar, .contact-topbar, .top-bar').forEach(el => {
    const r = el.getBoundingClientRect()
    if (r.height > 0 && r.top < 200) results.push({ class: el.className.substring(0, 60), top: r.top, bottom: r.bottom, height: r.height })
  })
  return results
})
console.log(JSON.stringify(info, null, 2))
await browser.close()
