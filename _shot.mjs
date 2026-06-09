import puppeteer from 'puppeteer-core'
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const [url, out, w, h] = process.argv.slice(2)
const killModal = () => {
  if (!document.getElementById('__k')) { const st = document.createElement('style'); st.id = '__k'; st.textContent = '[id^="ekit_modal-popup"],.sgpb-popup-overlay,[id*="sgpb-popup-dialog"],[class*="sgpb-popup-builder-content"]{display:none!important}'; document.head.appendChild(st) }
  document.querySelectorAll('body *').forEach((el) => { const cs = getComputedStyle(el); if (cs.position === 'fixed') { const r = el.getBoundingClientRect(); if (r.height > innerHeight * 0.6 && r.width > innerWidth * 0.4 && +cs.zIndex >= 99) el.remove() } })
  document.documentElement.style.overflow = 'auto'; document.body.style.overflow = 'auto'
}
const browser = await puppeteer.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars', '--disable-gpu'], defaultViewport: { width: +w || 1440, height: +h || 1200 } })
const page = await browser.newPage()
await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })
await new Promise((r) => setTimeout(r, 2200))
for (let i = 0; i < 3; i++) { await page.evaluate(killModal); await new Promise((r) => setTimeout(r, 300)) }
await page.screenshot({ path: out })
await browser.close()
console.log('shot', out)
