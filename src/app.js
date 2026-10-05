import { seek } from './scene.js';

const root = document.getElementById('content');
const state = {};
let started = performance.now();
let paused = false;

function preview(now) {
  if (!paused) seek(((now - started) / 1000) % 15, root, state);
  requestAnimationFrame(preview);
}

window.seek = (time) => seek(Number(time) || 0, root, state);
window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    paused = !paused;
    if (!paused) started = performance.now() - Number(document.getElementById('timecode').textContent.split(':')[1] || 0) * 1000;
  }
});
seek(0, root, state);
requestAnimationFrame(preview);

