import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Host, ModalBottomSheet, Text as ComposeText } from '@expo/ui/jetpack-compose';

export const name = 'expo-ui-sheet-nav-bar';
export const description =
  'Android: a ModalBottomSheet with a dark containerColor. Look at the system navigation bar under the open sheet.';

const SHEETS = {
  dark: { containerColor: '#1C1C1E', contentColor: '#FFFFFF' },
  light: { containerColor: '#FFF4E0', contentColor: '#1C1C1E' },
} as const;

function SheetNavBar() {
  const [open, setOpen] = useState<keyof typeof SHEETS | null>(null);
  return (
    <View style={styles.container}>
      <Button testID="open-dark" title="Open a dark sheet (#1C1C1E)" onPress={() => setOpen('dark')} />
      <Button testID="open-light" title="Open a cream sheet (#FFF4E0)" onPress={() => setOpen('light')} />
      <Text style={styles.hint}>
        With the sheet open, the navigation bar should take the sheet's colour, as it does on iOS and in
        Material's own BottomSheet samples. Try both gesture and 3-button navigation.
      </Text>
      {open && (
        <Host style={StyleSheet.absoluteFill} pointerEvents="none">
          <ModalBottomSheet
            onDismissRequest={() => setOpen(null)}
            skipPartiallyExpanded
            containerColor={SHEETS[open].containerColor}
            contentColor={SHEETS[open].contentColor}>
            <ComposeText>{`A ${open} sheet. The bar below should match it.`}</ComposeText>
          </ModalBottomSheet>
        </Host>
      )}
    </View>
  );
}

export const component = SheetNavBar;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16, backgroundColor: '#f2f2f7' },
  hint: { fontSize: 14, color: '#6e6e73' },
});
