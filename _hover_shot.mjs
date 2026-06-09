import puppeteer from 'puppeteer-core'
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox'], defaultViewport: { width: 1440, height: 900 } })
const page = await browser.newPage()
await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' })
await new Promise(r => setTimeout(r, 1000))
const links = await page.$$('a.nav__link, button.nav__link')
for (const link of links) {
  const text = await link.evaluate(el => el.textContent)
  if (text.includes('Software')) {
    await link.hover()
    await new Promise(r => setTimeout(r, 800))
    break
  }
}
await page.screenshot({ path: 'review-images/local-sw-hover3.png' })
await browser.close()
console.log('done')
