# skia-atlas-perspective

**Library:** `react-native-skia` 3.10.2 (Graphite; also 3.9.0+ and `main`), with `react-native-webgpu` 0.21.4 (same Dawn 158)
**Platforms:** iOS and Android (the cause is in Skia Graphite, shared by both).

## Steps

1. `bun install && npx expo run:ios`, then open **skia-atlas-perspective** (or `reprolab://demo/skia-atlas-perspective`).
2. The canvas draws 16 opaque squares with `<Atlas>` (left) and the same 16 squares as `<Image>`s (right),
   both inside one `<Group matrix={…}>` whose 3x3 matrix has perspective (a plane tilting away).
3. Toggle **Perspective** off and on.

## Expected

Both sides show 16 whole squares, flat or tilted. This is what `react-native-skia` 3.8 drew.

## Actual

With perspective on, the atlas squares are cut along their diagonal or missing; the `<Image>` squares are
whole. Flat, both sides are identical.

## Why

Since 3.9.0 (wcandillon/react-native-skia#4379) an atlas is drawn as one `drawVertices` call
(`drawAtlasAsVertices`, `packages/skia/cpp/rnskia/RNSkAtlas.h`). Graphite's vertices render step
(`src/gpu/graphite/render/VerticesRenderStep.cpp`) writes `devPosition.z = depth;` without multiplying it
by `devPosition.w`, unlike Graphite's other render steps (`depth * w`). Under a perspective matrix
`w != 1`, so after the perspective divide the depth varies across each triangle and the depth test drops
part of it. `SkCanvas::drawAtlas` draws each sprite with a render step that handles perspective.

Branch `fix/skia-atlas-perspective`: `drawAtlasAsVertices` falls back to `SkCanvas::drawAtlas` when the
canvas matrix has perspective.
