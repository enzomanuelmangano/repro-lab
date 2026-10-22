import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { demos } from './demos';

const Stack = createNativeStackNavigator();

function DemoList({ navigation }: { navigation: any }) {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.list}>
      {demos.map((demo) => (
        <Pressable
          key={demo.name}
          testID={`demo-${demo.name}`}
          style={styles.row}
          onPress={() => navigation.navigate(demo.name)}
        >
          <Text style={styles.rowTitle}>{demo.name}</Text>
          <Text style={styles.rowSubtitle}>{demo.description}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

// reprolab://demo/<name> opens a demo directly, so a run can be started without taps.
const linking = {
  prefixes: ['reprolab://'],
  config: { screens: Object.fromEntries(demos.map((demo) => [demo.name, `demo/${demo.name}`])) },
};

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name="repro-lab" component={DemoList} options={{ headerLargeTitle: true }} />
        {demos.map((demo) => (
          <Stack.Screen key={demo.name} name={demo.name} component={demo.component} options={demo.options} />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, gap: 12 },
  row: { padding: 16, borderRadius: 16, backgroundColor: '#f2f2f7' },
  rowTitle: { fontSize: 17, fontWeight: '600' },
  rowSubtitle: { marginTop: 4, fontSize: 14, color: '#6e6e73' },
});
