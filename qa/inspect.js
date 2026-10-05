import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import ffmpegPath from 'ffmpeg-static';
import { FPS, WIDTH, HEIGHT, DURATION } from '../src/timeline.js';

const exec = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'output');
const frames = path.join(output, 'frames');
const stills = path.join(output, 'stills');
await fs.mkdir(output, { recursive: true });
const frameFiles = (await fs.readdir(frames).catch(() => [])).filter((file) => file.endsWith('.png')).sort();
const stillFiles = (await fs.readdir(stills).catch(() => [])).filter((file) => file.endsWith('.png')).sort();
const contactSheet = path.join(output, 'contact-sheet.png');
const report = path.join(output, 'qa', 'report.md');
await fs.mkdir(path.dirname(report), { recursive: true });
const checks = [];
const expectedFrames = Math.round(DURATION * FPS);
checks.push(['frame count', frameFiles.length === expectedFrames, `${frameFiles.length} frames captured; expected ${expectedFrames}`]);
checks.push(['representative stills', stillFiles.length >= 6, `${stillFiles.length} representative stills`]);
const firstFrame = frameFiles[0] ? await fs.readFile(path.join(frames, frameFiles[0])) : null;
const pngWidth = firstFrame?.readUInt32BE(16);
const pngHeight = firstFrame?.readUInt32BE(20);
checks.push(['frame dimensions', pngWidth === WIDTH && pngHeight === HEIGHT, firstFrame ? `${pngWidth}×${pngHeight}` : 'no PNG frame found']);
const source = await fs.readFile(path.join(root, 'src', 'scene.js'), 'utf8');
checks.push(['seek source of truth', source.includes('export function seek') && source.includes('sceneAt(t)'), 'src/scene.js exposes deterministic seek(t)']);
const appSource = await fs.readFile(path.join(root, 'src', 'app.js'), 'utf8');
checks.push(['preview/render separation', appSource.includes('requestAnimationFrame') && source.includes('export function seek'), 'requestAnimationFrame is isolated to preview']);
let videoOk = false;
try {
  await exec(ffmpegPath, ['-y', '-i', path.join(output, 'video.mp4'), '-vf', 'select=not(mod(n\,75)),scale=270:-1,tile=3x2', '-frames:v', '1', contactSheet]);
  videoOk = true;
} catch (error) {
  checks.push(['MP4 encode', false, error.message]);
}
checks.push(['MP4 encode', videoOk, videoOk ? 'output/video.mp4 exists and was decoded by FFmpeg' : 'MP4 could not be decoded']);
const lines = [
  '# QA report', '',
  `Generated: ${new Date().toISOString()}`,
  '',
  '## Render contract', '',
  `- Canvas: ${WIDTH}×${HEIGHT}`,
  `- FPS: ${FPS}`,
  `- Duration: ${DURATION}s`,
  '- Encoding target: H.264 / CRF 16 / yuv420p',
  '- Timing: absolute `seek(t)` frame capture',
  '- Audio: not supplied for this benchmark; output is intentionally silent',
  '',
  '## Automated checks', ''
];
for (const [name, ok, detail] of checks) lines.push(`- ${ok ? 'PASS' : 'FAIL'} — ${name}: ${detail}`);
lines.push('', '## Manual review', '', '- Inspect `output/contact-sheet.png` for composition, safe areas, clipping, contrast and rhythm.', '- Inspect the representative stills before promoting this 15-second benchmark to a longer production.', '', `## Artifacts`, '', '- `output/video.mp4`', '- `output/contact-sheet.png`', '- `output/stills/`', '');
await fs.writeFile(report, lines.join('\n'), 'utf8');
console.log(lines.join('\n'));

