export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION = 15;

export const scenes = [
  { id: 'hook', start: 0, end: 3, label: '01 / HOOK', eyebrow: 'GO CREATIVE LAB', title: 'MARCAS EM\nMOVIMENTO.', accent: 'Design sem estratégia é decoração.' },
  { id: 'system', start: 3, end: 8, label: '02 / SISTEMA', eyebrow: 'UM ECOSSISTEMA DIGITAL', title: 'Do primeiro sinal\nao produto.', accent: 'Branding · UI/UX · Web · SaaS' },
  { id: 'mechanism', start: 8, end: 12, label: '03 / PROCESSO', eyebrow: 'ESTRATÉGIA ANTES DE QUALQUER PIXEL', title: 'Ideias ganham\ndireção.', accent: 'Descoberta → Estratégia → Design → Desenvolvimento → Crescimento' },
  { id: 'lockup', start: 12, end: 15, label: '04 / LOCKUP', eyebrow: 'GO CREATIVE LAB', title: 'O próximo nível\ncomeça aqui.', accent: 'Solicitar proposta' }
];

export function sceneAt(t) {
  const safe = Math.max(0, Math.min(DURATION - 1e-6, t));
  return scenes.find((scene) => safe >= scene.start && safe < scene.end) || scenes.at(-1);
}

export function localTime(t, scene) {
  return Math.max(0, Math.min(scene.end - scene.start, t - scene.start));
}

export function formatTime(t) {
  const totalFrames = Math.max(0, Math.floor(t * FPS));
  const seconds = Math.floor(totalFrames / FPS);
  const frames = totalFrames % FPS;
  return `00:${String(seconds).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
}

