import { useLayoutEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export const name = 'screens-header-items-morph';
export const description =
  'iOS 26: changing unstable_headerRightItems should morph the Liquid Glass items, not jump.';

export function component({ navigation }: { navigation: any }) {
  const [editing, setEditing] = useState(false);
  const [count, setCount] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Items (${count})`,
      unstable_headerRightItems: () =>
        editing
          ? [
              {
                type: 'button',
                label: 'Delete',
                icon: { type: 'sfSymbol', name: 'trash' },
                identifier: 'delete',
                onPress: () => {},
              },
              {
                type: 'button',
                label: 'Done',
                variant: 'done',
                identifier: 'done',
                onPress: () => setEditing(false),
              },
            ]
          : [
              {
                type: 'button',
                label: 'Edit',
                identifier: 'edit',
                onPress: () => setEditing(true),
              },
            ],
    });
  }, [navigation, editing, count]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Tap "Edit" / "Done" in the header (or the button below). On iOS 26 UIKit morphs the glass
        between the old and the new bar button items when they are set with
        setRightBarButtonItems:animated:. Here they jump.
      </Text>
      <Button title={editing ? 'Leave edit mode' : 'Enter edit mode'} onPress={() => setEditing((e) => !e)} />
      <Button title="Change title only (must NOT animate the items)" onPress={() => setCount((c) => c + 1)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16 },
  text: { fontSize: 15, lineHeight: 21 },
});
