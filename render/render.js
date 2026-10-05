import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import ffmpegPath from 'ffmpeg-static';
import { FPS, WIDTH, HEIGHT, DURATION } from '../src/timeline.js';
import { createServer } from './server-lib.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const framesDir = path.join(root, 'output', 'frames');
const stillsDir = path.join(root, 'output', 'stills');
const outputDir = path.join(root, 'output');
await fs.rm(framesDir, { recursive: true, force: true });
await fs.mkdir(framesDir, { recursive: true });
await fs.mkdir(stillsDir, { recursive: true });
await fs.mkdir(outputDir, { recursive: true });
const server = await createServer(root);
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const representativeFrames = new Set([0, 45, 89, 150, 239, 299, 359, 405, 449]);
const totalFrames = Math.round(DURATION * FPS);
for (let frame = 0; frame < totalFrames; frame += 1) {
  const t = frame / FPS;
  await page.evaluate((time) => window.seek(time), t);
  const target = representativeFrames.has(frame) ? stillsDir : framesDir;
  const filename = `frame-${String(frame).padStart(4, '0')}.png`;
  await page.screenshot({ path: path.join(target, filename), type: 'png' });
}
await browser.close();
await server.close();

const videoPath = path.join(outputDir, 'video.mp4');
await new Promise((resolve, reject) => {
  const args = ['-y', '-framerate', String(FPS), '-i', path.join(framesDir, 'frame-%04d.png'), '-c:v', 'libx264', '-preset', 'fast', '-crf', '16', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', videoPath];
  const proc = spawn(ffmpegPath, args, { stdio: ['ignore', 'ignore', 'pipe'] });
  let stderr = '';
  proc.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
  proc.on('error', reject);
  proc.on('close', (code) => code === 0 ? resolve() : reject(new Error(`FFmpeg failed (${code}): ${stderr.slice(-1200)}`)));
});
console.log(`Rendered ${totalFrames + 1} frames to ${framesDir}`);
console.log(`Encoded ${videoPath}`);

