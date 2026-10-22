import { useEffect, useState } from 'react';
import { Appearance, Button, Linking, StyleSheet, Text, View } from 'react-native';
import { getAppIconName, setAlternateAppIcon } from 'expo-alternate-app-icons';

export const name = 'alternate-icons-main-activity';
export const description =
  'Android: after switching to an alternate icon, MainActivity is disabled — deep links stop resolving and every light/dark change recreates the activity.';

// Survives activity recreation (same JS runtime), so a growing number means the
// activity was torn down and React's root mounted again.
let mounts = 0;

function AlternateIcons() {
  const [mount] = useState(() => ++mounts);
  const [icon, setIcon] = useState(() => getAppIconName());
  const [scheme, setScheme] = useState(() => Appearance.getColorScheme());
  const [link, setLink] = useState('');

  useEffect(() => {
    console.log(`[alternate-icons] mount #${mount} icon=${icon} scheme=${scheme}`);
    const sub = Appearance.addChangeListener(({ colorScheme }) => setScheme(colorScheme));
    return () => sub.remove();
  }, []);

  const tryLink = async () => {
    try {
      await Linking.openURL('reprolab://alternate-icons');
      setLink('opened');
    } catch (error) {
      setLink(String(error));
    }
  };

  return (
    <View style={styles.container}>
      <Text testID="mounts" style={styles.big}>
        Root mounts: {mount}
      </Text>
      <Text style={styles.row}>Icon: {icon ?? 'default'}</Text>
      <Text style={styles.row}>Color scheme: {scheme}</Text>
      <Button
        title="Use the Night icon"
        onPress={async () => setIcon(await setAlternateAppIcon('Night'))}
      />
      <Button title="Use the default icon" onPress={async () => setIcon(await setAlternateAppIcon(null))} />
      <Button title="App theme: dark" onPress={() => Appearance.setColorScheme('dark')} />
      <Button title="App theme: system" onPress={() => Appearance.setColorScheme('unspecified')} />
      <Button title="Open reprolab:// link" onPress={tryLink} />
      <Text testID="link" style={styles.row}>
        {link}
      </Text>
      <Text style={styles.hint}>
        Switch to the Night icon (Android closes the app — expected), reopen it from the new icon, then
        pick "App theme: dark" (Appearance.setColorScheme). The scheme should just change; on 8.0.0
        the activity is recreated instead.
      </Text>
    </View>
  );
}

export const component = AlternateIcons;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12 },
  big: { fontSize: 28, fontWeight: '700' },
  row: { fontSize: 16 },
  hint: { marginTop: 16, fontSize: 14, color: '#6e6e73' },
});
