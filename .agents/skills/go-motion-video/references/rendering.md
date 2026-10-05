# Rendering contract

The renderer visits every frame at an explicit time and calls `seek(t)` before taking a screenshot. The page must be stable after fonts and assets load.

Do not use CSS transitions or keyframes as the source of truth for export timing. CSS is allowed for layout, filters and compositing. All animated values must be written from JavaScript state derived from `t`.

The benchmark uses 1080x1920 at 30 FPS and exports H.264 MP4 when the local FFmpeg binary is available.

