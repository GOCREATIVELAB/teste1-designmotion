import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const url = 'https://gocreativelab.vercel.app';
const assetsDir = path.resolve('assets');
await fs.mkdir(assetsDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(1500);
const inspection = await page.evaluate(() => {
  const bodyStyle = getComputedStyle(document.body);
  const all = [...document.querySelectorAll('*')];
  const colors = [...new Set(all.flatMap((node) => {
    const style = getComputedStyle(node);
    return [style.color, style.backgroundColor, style.borderColor].filter((value) => value && value !== 'rgba(0, 0, 0, 0)');
  }))].slice(0, 80);
  return {
    url: location.href,
    title: document.title,
    text: document.body.innerText.slice(0, 8000),
    viewport: { width: innerWidth, height: innerHeight },
    body: { backgroundColor: bodyStyle.backgroundColor, color: bodyStyle.color, fontFamily: bodyStyle.fontFamily },
    headings: [...document.querySelectorAll('h1,h2,h3')].map((node) => ({ tag: node.tagName, text: node.innerText.trim() })).slice(0, 40),
    images: [...document.images].map((image) => ({ src: image.currentSrc || image.src, alt: image.alt, width: image.naturalWidth, height: image.naturalHeight })).slice(0, 40),
    svgs: [...document.querySelectorAll('svg')].map((svg) => ({ viewBox: svg.getAttribute('viewBox'), aria: svg.getAttribute('aria-label'), markup: svg.outerHTML.slice(0, 12000) })).slice(0, 20),
    fonts: [...document.fonts].map((font) => ({ family: font.family, weight: font.weight, status: font.status })),
    colors
  };
});
await fs.writeFile(path.join(assetsDir, 'site-inspection.json'), JSON.stringify(inspection, null, 2), 'utf8');
await page.screenshot({ path: path.join(assetsDir, 'site-reference.png'), fullPage: true });
await browser.close();
console.log(JSON.stringify({ title: inspection.title, url: inspection.url, headings: inspection.headings, images: inspection.images.length, svgs: inspection.svgs.length, fonts: inspection.fonts, colors: inspection.colors.slice(0, 20) }, null, 2));

