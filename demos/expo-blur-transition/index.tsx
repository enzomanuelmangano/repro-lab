import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export const name = 'expo-blur-transition';
export const description =
  'iOS: a full-screen dark BlurView mounted with a transparent screen, its intensity driven from 0 to 40 as the screen opens.';

const Stack = createNativeStackNavigator();
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const DURATION = 450;

function List({ navigation }: { navigation: any }) {
  return (
    <ScrollView contentContainerStyle={styles.list}>
      {Array.from({ length: 14 }, (_, i) => (
        <Pressable
          key={i}
          testID={`card-${i}`}
          onPress={() => navigation.navigate('Preview', { index: i })}
          style={[styles.card, { backgroundColor: `hsl(${(i * 47) % 360}, 75%, 55%)` }]}>
          <Text style={styles.cardText}>Card {i + 1}: list content behind the blur</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function Preview({ navigation, route }: { navigation: any; route: any }) {
  // 0 → 1 as the screen opens: the blur's intensity and the card follow it.
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(1, { duration: DURATION });
  }, [progress]);

  const blurProps = useAnimatedProps(() => ({ intensity: 40 * progress.value }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.8 + 0.2 * progress.value }],
  }));

  return (
    <Pressable
      testID="dismiss"
      style={StyleSheet.absoluteFill}
      onPress={() => {
        progress.value = withTiming(0, { duration: DURATION });
        setTimeout(() => navigation.goBack(), DURATION);
      }}>
      <AnimatedBlurView animatedProps={blurProps} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.center} pointerEvents="none">
        <Animated.View style={[styles.preview, cardStyle]}>
          <Text style={styles.previewText}>Card {route.params.index + 1}</Text>
        </Animated.View>
      </View>
    </Pressable>
  );
}

function BlurTransition() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="List" component={List} />
      <Stack.Screen
        name="Preview"
        component={Preview}
        options={{ presentation: 'transparentModal', animation: 'none' }}
      />
    </Stack.Navigator>
  );
}

export const component = BlurTransition;

const styles = StyleSheet.create({
  list: { padding: 16, gap: 10, backgroundColor: 'black' },
  card: { padding: 22, borderRadius: 16 },
  cardText: { fontSize: 17, fontWeight: '700', color: 'white' },
  center: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  preview: { width: 280, height: 360, borderRadius: 24, backgroundColor: '#f2f2f7', alignItems: 'center', justifyContent: 'center' },
  previewText: { fontSize: 24, fontWeight: '800' },
});
