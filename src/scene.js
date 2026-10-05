import { sceneAt, localTime, formatTime } from './timeline.js';
import { clamp, fade, reveal, stagger } from './motion.js';

const esc = (value) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

function splitLines(text) {
  return text.split('\n').map((line) => `<span class="title-line">${esc(line)}</span>`).join('');
}

function renderMarkup(root, scene) {
  const visual = scene.id === 'system'
    ? `<div class="service-grid">
         <article class="service-card card-main"><span class="card-no">01</span><strong>Branding<br>Estratégico</strong><small>posicionamento<br>identidade visual</small></article>
         <article class="service-card card-ui"><span class="card-no">02</span><strong>UI/UX<br>Design</strong><small>research<br>protótipos</small></article>
         <article class="service-card card-web"><span class="card-no">03</span><strong>Web Design<br>Premium</strong><small>código limpo<br>performance</small></article>
         <article class="service-card card-saas"><span class="card-no">04</span><strong>SaaS<br>Development</strong><small>APIs · cloud<br>escala</small></article>
         <span class="cursor-dot"></span>
       </div>`
    : scene.id === 'mechanism'
      ? `<div class="process-track"><div class="process-line"></div>
          <div class="process-step step-1"><span>01</span><strong>Descoberta</strong><small>investigar</small></div>
          <div class="process-step step-2"><span>02</span><strong>Estratégia</strong><small>direcionar</small></div>
          <div class="process-step step-3"><span>03</span><strong>Design</strong><small>materializar</small></div>
          <div class="process-step step-4"><span>04</span><strong>Desenvolvimento</strong><small>construir</small></div>
          <div class="process-step step-5"><span>05</span><strong>Crescimento</strong><small>escalar</small></div>
        </div>`
      : scene.id === 'lockup'
        ? `<div class="lockup-visual"><div class="lockup-ring ring-1"></div><div class="lockup-ring ring-2"></div><img src="/assets/go-logo-small.png" alt="GO Creative Lab" /><span class="lockup-arrow">↗</span></div>`
        : `<div class="hook-visual"><img src="/assets/go-symbol-small.png" alt="GO" /><div class="hook-axis"></div><div class="hook-word">GO</div></div>`;
  root.innerHTML = `<div class="scene-copy"><p class="eyebrow">${esc(scene.eyebrow)}</p><h1>${splitLines(scene.title)}</h1><p class="accent-copy">${esc(scene.accent)}</p></div><div class="scene-visual visual-${scene.id}">${visual}</div><div class="scene-index"><span class="scene-number">01</span><span class="slash">/</span><span>04</span></div>`;
}

function updateVisual(visual, id, progress, time) {
  visual.style.setProperty('--p', progress.toFixed(4));
  visual.style.setProperty('--spin', `${time * 13}deg`);
  if (id === 'system') {
    visual.querySelectorAll('.service-card').forEach((card, index) => card.style.setProperty('--card-p', reveal(progress, index * 0.12, 0.62).toFixed(4)));
    const cursor = visual.querySelector('.cursor-dot');
    cursor.style.transform = `translate(${(progress * 240).toFixed(1)}px, ${(-progress * 105).toFixed(1)}px)`;
  }
  if (id === 'mechanism') visual.querySelectorAll('.process-step').forEach((step, index) => step.style.setProperty('--step-p', reveal(progress, index * 0.12, 0.58).toFixed(4)));
}

export function seek(t, root, state = {}) {
  const scene = sceneAt(t);
  const lt = localTime(t, scene);
  const duration = scene.end - scene.start;
  const progress = clamp(lt / duration);
  if (state.sceneId !== scene.id) {
    renderMarkup(root, scene);
    state.sceneId = scene.id;
    root.querySelector('.scene-number').textContent = String(['hook', 'system', 'mechanism', 'lockup'].indexOf(scene.id) + 1).padStart(2, '0');
  }
  const enter = reveal(lt, 0.04, 0.62);
  const exit = 1 - fade(lt, Math.max(0, duration - 0.5), 0.5);
  const opacity = Math.min(enter, exit);
  const copy = root.querySelector('.scene-copy');
  const visual = root.querySelector('.scene-visual');
  const index = root.querySelector('.scene-index');
  copy.style.opacity = opacity.toFixed(4);
  copy.style.transform = `translate3d(0, ${((1 - enter) * 48).toFixed(2)}px, 0)`;
  visual.style.opacity = opacity.toFixed(4);
  visual.style.transform = `translate3d(0, ${((1 - enter) * 24).toFixed(2)}px, 0) scale(${(0.94 + enter * 0.06).toFixed(4)})`;
  index.style.opacity = opacity.toFixed(4);
  index.style.transform = `translateY(${((1 - enter) * 12).toFixed(2)}px)`;
  updateVisual(visual, scene.id, progress, t);
  root.dataset.scene = scene.id;
  root.style.setProperty('--scene-progress', progress.toFixed(4));
  root.querySelector('.eyebrow').style.setProperty('--line-scale', enter.toFixed(4));
  root.querySelectorAll('.title-line').forEach((line, index) => {
    const lineProgress = reveal(lt, 0.15 + stagger(index, 2, 0.1), 0.66);
    line.style.opacity = lineProgress.toFixed(4);
    line.style.transform = `translateY(${((1 - lineProgress) * 28).toFixed(2)}px)`;
  });
  const accentProgress = reveal(lt, 0.48, 0.58);
  root.querySelector('.accent-copy').style.opacity = accentProgress.toFixed(4);
  root.querySelector('.accent-copy').style.transform = `translateY(${((1 - accentProgress) * 16).toFixed(2)}px)`;
  document.getElementById('timecode').textContent = formatTime(t);
  return state;
}

