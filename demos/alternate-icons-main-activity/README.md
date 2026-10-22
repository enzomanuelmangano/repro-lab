# alternate-icons-main-activity

**Library:** `expo-alternate-app-icons` 8.0.0 (latest on npm, also `main`)
**Platform:** Android (API 36 emulator)

## Steps

1. `npx expo run:android --variant release`, open **alternate-icons-main-activity**.
2. Tap **Use the Night icon**. Android closes the app (expected when the launcher alias changes).
3. Open the app again from the Night icon and open the demo.
4. Tap **App theme: dark** (`Appearance.setColorScheme('dark')`).
5. Tap **Open reprolab:// link**, or run `adb shell am start -a android.intent.action.VIEW -d reprolab://alternate-icons`.

## Expected

Step 4 changes "Color scheme" to dark. Step 5 opens the app.

## Actual (8.0.0)

- Step 4 recreates the activity twice (`wm_on_create_called` ×2 in `adb logcat -b events`), and the app restarts on its first screen.
- Step 5 fails: `Error: Activity not started, unable to resolve Intent { act=android.intent.action.VIEW dat=reprolab://... }`.

Before step 2, with the default icon, step 4 does not recreate anything and the link opens.

## Why

`setAlternateAppIcon` switches icons by disabling the component the current activity came from. With the primary icon, that is `MainActivity` itself, the real activity behind every alias:

- `MainActivity` is the only component with the app's `<intent-filter>`s, so no link resolves any more (pchalupa/expo-alternate-app-icons#260).
- AppCompat checks whether an activity handles `uiMode` by reading its manifest entry through `PackageManager.getActivityInfo`. A disabled component is not found, so AppCompat assumes it does not handle `uiMode` and recreates the activity on every night-mode change. `Appearance.setColorScheme` goes through `AppCompatDelegate.setDefaultNightMode`.

## pchalupa/expo-alternate-app-icons#267, and what it leaves

pchalupa/expo-alternate-app-icons#267 (open) stops disabling `MainActivity`: the launcher icon moves to a new `MainActivityDefault` alias and only aliases are toggled. On a fresh install that fixes both symptoms.

An install that already picked an icon with 8.0.0 stays broken after updating to it, because Android keeps a component's enabled state across updates:

| After updating from 8.0.0 with the Night icon picked | 8.0.0 | #267 | #267 + `fix/alternate-icons-main-activity` |
| --- | --- | --- | --- |
| `MainActivity` | disabled | disabled | enabled |
| Recreations on "App theme: dark" | 2 | 2 | 0 |
| `reprolab://` link | fails | fails | opens |
| Launcher icons | 1 | 2 (Night + Default) | 1 |

`fix/alternate-icons-main-activity` is #267 plus an `ExpoAlternateAppIconsPackage`:

- In `Application.onCreate`, before any activity reads its manifest entry, a disabled `MainActivity` is set back to its default state. It has no launcher entry any more, so this adds no icon and closes nothing.
- When an activity starts through an alias other than `MainActivityDefault` while an alternate alias is explicitly enabled, `MainActivityDefault` is disabled, which is the state `setAlternateAppIcon` leaves. It is never disabled while the task was started through it: Android finishes a task whose component is disabled (`wm_finish_activity ... disabled-package`). That launch keeps both icons until the next one.

Measured on an API 36 emulator, release builds: 3 update runs and 2 fresh-install runs, each read from `adb logcat -b events` (activity creations) and `dumpsys package` / `cmd package query-activities` (component states, launcher entries).

## Video

[before | after](../../media/alternate-icons-main-activity-before-after.mp4): Night icon picked, then **App theme: dark**.
