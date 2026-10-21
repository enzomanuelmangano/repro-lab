import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Canvas, Circle, LinearGradient, Rect, vec } from 'react-native-skia';

export const name = 'screens-android-back-reattach';
export const description =
  'Android: a pushed screen removes the one under it from the window, so going back re-attaches and redraws all of it in the first frame of the pop.';

const Stack = createNativeStackNavigator();

// A heavy screen: many translucent views and a Skia canvas.
function Heavy({ navigation }: { navigation: any }) {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Canvas style={styles.canvas}>
          <Rect x={0} y={0} width={360} height={200}>
            <LinearGradient start={vec(0, 0)} end={vec(360, 200)} colors={['#3b82f6', '#111']} />
          </Rect>
          <Circle cx={180} cy={100} r={70} color="white" opacity={0.8} />
        </Canvas>
        {Array.from({ length: 30 }, (_, i) => (
          <View key={i} style={[styles.card, { backgroundColor: `hsl(${(i * 37) % 360}, 70%, 60%)` }]}>
            {Array.from({ length: 6 }, (_, j) => (
              <View key={j} style={[styles.chip, { opacity: 0.5 + j * 0.08 }]}>
                <Text style={styles.chipText}>
                  {i}.{j}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <Button testID="push" title="Push" onPress={() => navigation.push('Light')} />
      </View>
    </View>
  );
}

function Light({ navigation }: { navigation: any }) {
  return (
    <View style={[styles.screen, styles.light]}>
      <Text style={styles.title}>Go back: the screen underneath is re-attached in this pop.</Text>
      <View style={styles.footer}>
        <Button testID="pop" title="Back" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

function BackReattach() {
  return (
    <Stack.Navigator screenOptions={{ animation: 'default' }}>
      <Stack.Screen name="Heavy" component={Heavy} />
      <Stack.Screen name="Light" component={Light} />
    </Stack.Navigator>
  );
}

export const component = BackReattach;
export const options = { headerShown: false };

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'white' },
  light: { justifyContent: 'center' },
  content: { padding: 12, gap: 8 },
  canvas: { width: 360, height: 200, alignSelf: 'center' },
  card: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, padding: 10, borderRadius: 14 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, backgroundColor: 'white' },
  chipText: { fontSize: 12, fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '600', padding: 24, textAlign: 'center' },
  footer: { padding: 16, paddingBottom: 48, backgroundColor: 'white' },
});
