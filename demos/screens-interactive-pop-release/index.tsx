import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, StyleSheet, Text, View } from 'react-native';

export const name = 'screens-interactive-pop-release';
export const description =
  'iOS: release a short full-screen drag and the screen snaps back in a couple of frames instead of following the finger.';

const Stack = createNativeStackNavigator();

function Home({ navigation }: { navigation: any }) {
  return (
    <View style={[styles.fill, styles.home]}>
      <Button testID="open" title="Open the sheet-like screen" onPress={() => navigation.navigate('Sheet')} />
    </View>
  );
}

function Sheet() {
  return (
    <View style={[styles.fill, styles.sheet]}>
      <Text style={styles.title}>Drag down anywhere</Text>
      <Text style={styles.body}>
        Drag down a short way and let go: the screen should glide back. Drag past half and let go: it
        should close at the finger's speed.
      </Text>
      {Array.from({ length: 6 }, (_, i) => (
        <View key={i} style={[styles.stripe, { backgroundColor: `hsl(${i * 50}, 80%, 60%)` }]} />
      ))}
    </View>
  );
}

function InteractivePopRelease() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen
        name="Sheet"
        component={Sheet}
        options={{
          animation: 'slide_from_bottom',
          animationDuration: 250,
          animationMatchesGesture: true,
          gestureDirection: 'vertical',
          fullScreenGestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
}

export const component = InteractivePopRelease;
export const options = { headerShown: false };

const styles = StyleSheet.create({
  fill: { flex: 1 },
  home: { alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' },
  sheet: { padding: 24, gap: 12, backgroundColor: '#1c1c1e' },
  title: { fontSize: 24, fontWeight: '700', color: 'white' },
  body: { fontSize: 15, lineHeight: 21, color: '#d1d1d6' },
  stripe: { height: 60, borderRadius: 12 },
});
