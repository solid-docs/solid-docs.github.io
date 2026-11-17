// Renders tools/og.html to the three share pictures of solidos.org (1200 × 630).
//   node tools/og.mjs [path to playwright's index.mjs] [docs repo] [userguide repo]
// Always writes ../img/social-card.png (front page). With the two repo paths it also writes
// <docs>/static/img/solidos-social-card.png and <userguide>/static/img/userguide-social-card.png.
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
const { chromium } = await import(process.argv[2] || 'playwright')
const here = (p) => fileURLToPath(new URL(p, import.meta.url))
const out = [['home', here('../img/social-card.png')]]
if (process.argv[3]) out.push(['docs', resolve(process.argv[3], 'static/img/solidos-social-card.png')])
if (process.argv[4]) out.push(['userguide', resolve(process.argv[4], 'static/img/userguide-social-card.png')])
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
for (const [kind, path] of out) {
  await page.goto('file://' + here('./og.html') + '?kind=' + kind)
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path })
  console.log(kind, '→', path)
}
await browser.close()
