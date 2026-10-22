# repro-lab

Minimal, self-contained reproductions of bugs in React Native libraries, each on the
**latest published version** of the library.

- `main` runs every library **stock**: each demo shows its bug.
- `fix/<demo>` adds only the proposed fix for that demo (as a `patchedDependencies`
  entry), so `git diff main...fix/<demo>` is exactly the change proposed upstream.

Each demo is a single folder under `demos/` that imports only the library it is about,
so it can be copied into a fresh project.

## Run

```sh
bun install
npx expo run:ios      # or: npx expo run:android
```

Open the demo from the list on the first screen and follow the steps in its README.

To see a fix:

```sh
git checkout fix/<demo>
bun install           # applies the patch
npx expo run:ios
```

## Demos

| Demo | Library | Platform | Issue | PR |
|---|---|---|---|---|
| [screens-header-items-morph](demos/screens-header-items-morph) | react-native-screens 4.30.0 | iOS 26 | [#5003](https://github.com/software-mansion/react-native-screens/issues/5003) | [#5004](https://github.com/software-mansion/react-native-screens/pull/5004) |
| [expo-ui-secure-text-input](demos/expo-ui-secure-text-input) | @expo/ui 58.0.21 | Android | [expo#52009](https://github.com/expo/expo/issues/52009) | [expo#52010](https://github.com/expo/expo/pull/52010) |
| [webgpu-skia-shared-instance](demos/webgpu-skia-shared-instance) | react-native-skia 3.7.2 + react-native-webgpu 0.17.0 | iOS, Android | [skia#4305](https://github.com/wcandillon/react-native-skia/issues/4305) (iOS), [webgpu#581](https://github.com/wcandillon/react-native-webgpu/issues/581) (Android) | [skia#4306](https://github.com/wcandillon/react-native-skia/pull/4306) (iOS), [webgpu#582](https://github.com/wcandillon/react-native-webgpu/pull/582) (Android) |
| [screens-interactive-pop-release](demos/screens-interactive-pop-release) | react-native-screens 4.30.0 | iOS | [#5009](https://github.com/software-mansion/react-native-screens/issues/5009) | [#5010](https://github.com/software-mansion/react-native-screens/pull/5010) |
| [bottom-tabs-surface-rebuild](demos/bottom-tabs-surface-rebuild) | @react-navigation/bottom-tabs 7.21.0 | Android | – | – |
| [screens-android-back-reattach](demos/screens-android-back-reattach) | react-native-screens 4.30.0 | Android | [Discussion #5012](https://github.com/software-mansion/react-native-screens/discussions/5012) | – |
| [screens-system-back-button](demos/screens-system-back-button) | react-native-screens 4.30.0 | iOS | [Discussion \#5006](https://github.com/software-mansion/react-native-screens/discussions/5006) | – |
| [alternate-icons-main-activity](demos/alternate-icons-main-activity) | expo-alternate-app-icons 8.0.0 | Android | [#278](https://github.com/pchalupa/expo-alternate-app-icons/issues/278) | [theeket#1](https://github.com/theeket/expo-alternate-app-icons/pull/1) (into [#267](https://github.com/pchalupa/expo-alternate-app-icons/pull/267)) |
| [expo-ui-sheet-nav-bar](demos/expo-ui-sheet-nav-bar) | @expo/ui 58.0.21 | Android 15+ | [expo#52080](https://github.com/expo/expo/issues/52080) | [expo#52081](https://github.com/expo/expo/pull/52081) |

## Versions

Expo SDK 58.0.16 · React Native 0.88.0 · React 19.3.0 · `@react-navigation/native-stack` 7.21.0 · `@expo/ui` 58.0.21 · `react-native-skia` 3.7.2 · `react-native-webgpu` 0.17.0 · `react-native-reanimated` 4.7.1
