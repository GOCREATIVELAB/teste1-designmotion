---
name: go-motion-video
description: Build, render and QA deterministic motion-design videos in this repository.
---

# GO Motion Video

Use this skill when a task creates or edits a motion-design video.

## Production loop

1. Translate the brief into scenes and beats.
2. Keep timing declarative in `src/timeline.js`.
3. Implement visual state as a pure function of absolute time.
4. Preview through the browser, then render explicit frame times with Playwright.
5. Inspect representative frames and a contact sheet.
6. Fix the highest-impact visual problems before declaring completion.

## Architecture

- `src/timeline.js`: duration, FPS and scene timing.
- `src/motion.js`: reusable interpolation and spring helpers.
- `src/scene.js`: `seek(t, root)`; no render-time timers.
- `render/render.js`: browser capture and FFmpeg encoding.
- `qa/inspect.js`: render checks and report generation.

Read `references/rendering.md` for renderer constraints and `references/qa-checklist.md` before final delivery.

## Deliverables

The final response should point to the source project, MP4, contact sheet and QA report. If no audio or real product assets were supplied, say so explicitly.

