import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';
import { Canvas, Circle, LinearGradient, Rect, vec } from 'react-native-skia';

export const name = 'bottom-tabs-surface-rebuild';
export const description =
  'Android: with detachInactiveScreens off, switching tabs takes the focused scene off the window, so every TextureView (Skia, WebGPU, video) rebuilds its surface.';

const Tab = createBottomTabNavigator();

function makeTab(label: string, hue: number) {
  function TabScreen() {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>{label}</Text>
        <Canvas style={styles.canvas}>
          <Rect x={0} y={0} width={400} height={400}>
            <LinearGradient start={vec(0, 0)} end={vec(400, 400)} colors={[`hsl(${hue}, 80%, 55%)`, '#111']} />
          </Rect>
          <Circle cx={160} cy={160} r={80} color="white" opacity={0.8} />
        </Canvas>
        <Text style={styles.hint}>
          Switch tabs and watch `adb logcat -s SkiaTextureView`: each switch should not log a new
          onSurfaceTextureAvailable.
        </Text>
      </View>
    );
  }
  return TabScreen;
}

const First = makeTab('First', 210);
const Second = makeTab('Second', 20);
const Third = makeTab('Third', 130);

function SurfaceRebuild() {
  return (
    <Tab.Navigator detachInactiveScreens={false} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="First" component={First} />
      <Tab.Screen name="Second" component={Second} />
      <Tab.Screen name="Third" component={Third} />
    </Tab.Navigator>
  );
}

export const component = SurfaceRebuild;

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 24, gap: 16, backgroundColor: 'white' },
  title: { fontSize: 22, fontWeight: '700' },
  canvas: { width: 320, height: 320, alignSelf: 'center' },
  hint: { fontSize: 14, color: '#6e6e73' },
});
