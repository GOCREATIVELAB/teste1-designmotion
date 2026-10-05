# GO Motion Benchmark

Peça vertical de 15 segundos para a GO Creative Lab, com timeline determinística, identidade baseada nos assets públicos da marca e quatro batidas editoriais: hook, sistema, processo e lockup. A saída é silenciosa porque nenhum áudio foi fornecido.

## Rodar localmente

```bash
npm install
npm run setup
npm run render
npm run qa
```

Para visualizar a peça:

```bash
npm run preview
```

Abra `http://127.0.0.1:4173`.

## Saídas

- `output/video.mp4` — vídeo H.264 silencioso.
- `output/stills/` — frames representativos.
- `output/contact-sheet.png` — folha de contato gerada pelo QA.
- `output/qa/report.md` — verificações automatizadas e limitações conhecidas.

O renderer chama `window.seek(t)` em cada frame; o preview usa `requestAnimationFrame` apenas para reprodução visual. O render final usa 450 frames, H.264, CRF 16 e `yuv420p`.
