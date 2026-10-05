# QA report

Generated: 2026-10-03T17:31:05.691Z

## Render contract

- Canvas: 1080×1920
- FPS: 30
- Duration: 15s
- Encoding target: H.264 / CRF 16 / yuv420p
- Timing: absolute `seek(t)` frame capture
- Audio: not supplied for this benchmark; output is intentionally silent

## Automated checks

- FAIL — frame count: 0 frames captured; expected 450
- FAIL — representative stills: 0 representative stills
- FAIL — frame dimensions: no PNG frame found
- PASS — seek source of truth: src/scene.js exposes deterministic seek(t)
- PASS — preview/render separation: requestAnimationFrame is isolated to preview
- FAIL — MP4 encode: spawn EFTYPE
- FAIL — MP4 encode: MP4 could not be decoded

## Manual review

- Inspect `output/contact-sheet.png` for composition, safe areas, clipping, contrast and rhythm.
- Inspect the representative stills before promoting this 15-second benchmark to a longer production.

## Artifacts

- `output/video.mp4`
- `output/contact-sheet.png`
- `output/stills/`

