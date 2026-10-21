# screens-android-back-reattach

**Library:** `react-native-screens` 4.30.0 (also `main`, `android/.../legacy/ScreenStack.kt`), through `@react-navigation/native-stack` 7.21.0
**Platform:** Android. Measured on a Redmi Note 8 Pro, release build.

## Steps

1. `npx expo run:android --variant release`, open **screens-android-back-reattach**.
2. Tap **Push**, then go back (system back or **Back**).

## What happens

When a screen is pushed, `ScreenStack` removes the fragment of the screen underneath (`transaction.remove`), so its
views leave the window and Android drops their display lists. Going back adds the fragment again, and the first
frame of the pop re-attaches and redraws the whole screen underneath.

`fix/screens-android-back-reattach` hides the covered fragment instead (`transaction.hide`) and shows it again on
the way back. Preloaded (`INACTIVE`) screens and never-added ones are still removed.

| Back, 8 pops per run, 2 interleaved runs per build | 4.30.0 | `fix/screens-android-back-reattach` |
| --- | --- | --- |
| worst frame of each pop | 47–74 ms (median ~56) | 22–35 ms (median ~27) |
| frames over 50 ms | 7, 8 | 0, 0 |
| PSS after the runs | ~235 MB | ~216 MB |

## Trade-offs of the change

- A hidden fragment stays resumed, so `ScreenFragment` and `ScreensAnimation` treat a hidden fragment as
  disappearing (`isResumed && !isHidden`).
- The covered screen's views stay attached: its GPU surfaces (Skia, WebGPU, video) and running animations are kept.
