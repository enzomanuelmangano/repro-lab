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
| [screens-header-items-morph](demos/screens-header-items-morph) | react-native-screens 4.30.0 | iOS 26 | – | – |

## Versions

Expo SDK 58.0.16 · React Native 0.88.0 · React 19.3.0 · `@react-navigation/native-stack` 7.21.0
