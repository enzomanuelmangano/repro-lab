import { useLayoutEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

function Badge() {
  return <Text style={styles.badge}>custom</Text>;
}

export const name = 'screens-header-items-morph';
export const description =
  'iOS 26: changing unstable_headerRightItems should morph the Liquid Glass items, not jump.';

function HeaderItemsMorph({ navigation }: { navigation: any }) {
  const [editing, setEditing] = useState(false);
  const [count, setCount] = useState(0);
  const [custom, setCustom] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Items (${count})`,
      unstable_headerRightItems: () => [
        ...(custom ? [{ type: 'custom' as const, element: <Badge /> }] : []),
        ...(editing
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
            ]),
      ],
    });
  }, [navigation, editing, count, custom]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Tap "Edit" / "Done" in the header (or the button below). On iOS 26 UIKit morphs the glass
        between the old and the new bar button items when they are set with
        setRightBarButtonItems:animated:. Here they jump.
      </Text>
      <Button title={editing ? 'Leave edit mode' : 'Enter edit mode'} onPress={() => setEditing((e) => !e)} />
      <Button
        title={custom ? 'Remove the custom (React element) item' : 'Add a custom (React element) item'}
        onPress={() => setCustom((c) => !c)}
      />
      <Button title="Change title only (must NOT animate the items)" onPress={() => setCount((c) => c + 1)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16 },
  text: { fontSize: 15, lineHeight: 21 },
  badge: { fontSize: 13, fontWeight: '600', color: '#007aff', paddingHorizontal: 8 },
});
export const component = HeaderItemsMorph;
