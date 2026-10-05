# GO Motion Benchmark

## Objective

Build deterministic, production-quality vertical motion design videos with HTML, CSS and JavaScript.

## Rendering contract

- The source of truth is absolute time: `seek(t)` reconstructs the full visual state.
- Final frames use `t = frame / fps`; do not use `requestAnimationFrame`, timers or accumulated animation state.
- Keep randomness deterministic. Do not fabricate product claims, metrics or assets.
- Preview playback may use `requestAnimationFrame`, but export must not depend on it.

## Workflow

Use `.agents/skills/go-motion-video/SKILL.md` for video work. Read only the references needed for the current stage.

For this benchmark, prefer the commands below:

```text
npm run preview
npm run render
npm run qa
```

Do not call a video final until the render and QA report exist. If a dependency is unavailable, report the limitation and do not claim success.

## Output contract

Deliver source, representative frames, contact sheet, final MP4 and `output/qa/report.md`.

