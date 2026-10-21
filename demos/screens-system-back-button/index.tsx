import { useState } from 'react';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenStack, ScreenStackHeaderLeftView, ScreenStackItem } from 'react-native-screens';

export const name = 'screens-system-back-button';
export const description =
  'iOS: the first screen of a nested stack has no back button. A drawn chevron is not the system one; systemBackButton shows the real one and hands its press to JS.';

// The first (root) screen of a nested native stack: UIKit draws no back button
// for it, because nothing is behind it in its own UINavigationController.
function NestedRoot({ onBack, system }: { onBack: () => void; system: boolean }) {
  return (
    <ScreenStack style={StyleSheet.absoluteFill}>
      <ScreenStackItem
        screenId="nested-root"
        activityState={2}
        headerConfig={
          system
            ? // `systemBackButton` / `onPressBackButton` come from the proposed change.
              ({ title: 'Nested root', systemBackButton: true, onPressBackButton: onBack } as object)
            : {
                title: 'Nested root',
                children: (
                  <ScreenStackHeaderLeftView>
                    <Pressable onPress={onBack} hitSlop={12}>
                      <Text style={styles.chevron}>‹ Back</Text>
                    </Pressable>
                  </ScreenStackHeaderLeftView>
                ),
              }
        }
        style={StyleSheet.absoluteFill}>
        <View style={styles.content}>
          <Text style={styles.text}>
            {system
              ? 'systemBackButton: the real UIKit back button (glass on iOS 26), press handled in JS.'
              : 'Today: a chevron drawn as headerLeft. Not the system button.'}
          </Text>
        </View>
      </ScreenStackItem>
    </ScreenStack>
  );
}

function SystemBackButton() {
  const [open, setOpen] = useState<null | 'custom' | 'system'>(null);
  if (open) {
    return <NestedRoot system={open === 'system'} onBack={() => setOpen(null)} />;
  }
  return (
    <View style={styles.content}>
      <Button testID="open-custom" title="Open nested stack (drawn chevron)" onPress={() => setOpen('custom')} />
      <Button testID="open-system" title="Open nested stack (systemBackButton)" onPress={() => setOpen('system')} />
    </View>
  );
}

export const component = SystemBackButton;
export const options = { headerShown: false };

const styles = StyleSheet.create({
  content: { flex: 1, padding: 24, gap: 16, justifyContent: 'center', backgroundColor: 'white' },
  text: { fontSize: 16, lineHeight: 22 },
  chevron: { fontSize: 17, color: '#007aff' },
});
