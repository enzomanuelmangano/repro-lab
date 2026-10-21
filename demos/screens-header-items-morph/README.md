# screens-header-items-morph

**Library:** `react-native-screens` 4.30.0 (also `main`), through `@react-navigation/native-stack` 7.21.0
**Platform:** iOS 26 (Liquid Glass). Earlier iOS versions are unaffected by the fix.

## Steps

1. Open **screens-header-items-morph**.
2. Tap **Edit** in the header (or *Enter edit mode*). The items become **Delete** + **Done**.
3. Tap **Done**. The items go back to **Edit**.
4. Tap *Change title only*: only the title changes.

## Expected

On iOS 26, when the set of bar button items changes, UIKit morphs the Liquid Glass
between the old and the new items, as it does for
`-[UINavigationItem setRightBarButtonItems:animated:]` in a native app. The items
carry `identifier`, which UIKit uses to match them across the change.

Step 4 must not animate the items: they did not change.

## Actual

The items jump: the old glass disappears and the new one appears in the next frame.

## Why

`+[RNSScreenStackHeaderConfig updateViewController:withConfig:animated:]` clears
`navitem.rightBarButtonItems = nil` at the start of every header update and then assigns
the new items without animation, so UIKit never sees a change it can animate.

## Upstream

- Issue: https://github.com/software-mansion/react-native-screens/issues/5003
- PR: https://github.com/software-mansion/react-native-screens/pull/5004
- Fix branch here: `fix/screens-header-items-morph`
