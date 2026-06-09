import puppeteer from 'puppeteer-core'
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox'], defaultViewport: { width: 1440, height: 900 } })
const page = await browser.newPage()
await page.goto('https://classonesystems.in/energy/', { waitUntil: 'networkidle2', timeout: 60000 })
await new Promise(r => setTimeout(r, 2000))
const info = await page.evaluate(() => {
  const sections = document.querySelectorAll('.elementor-section, .e-con')
  const first = sections[0]
  const bg = first ? getComputedStyle(first).background : 'none'
  const imgs = Array.from(document.querySelectorAll('img')).slice(0, 5).map(i => i.src || i.getAttribute('data-lazy-src'))
  const h1 = document.querySelector('h1, h2, h3')?.textContent?.trim()
  return { bg, imgs, h1, sections: sections.length }
})
console.log(JSON.stringify(info, null, 2))
await browser.close()
