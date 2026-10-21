import { Host, TextInput as ExpoTextInput } from '@expo/ui';
import { StyleSheet, Text, TextInput as RNTextInput, View } from 'react-native';

export const name = 'expo-ui-secure-text-input';
export const description =
  'Android: @expo/ui TextInput with secureTextEntry masks the text but tells the keyboard it is plain text, so the keyboard suggests and learns the password.';

function SecureTextInput() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>@expo/ui TextInput, secureTextEntry</Text>
      <Host matchContents style={styles.host}>
        <ExpoTextInput testID="expo-ui-password" secureTextEntry placeholder="Password" style={styles.field} />
      </Host>

      <Text style={styles.label}>React Native TextInput, secureTextEntry (reference)</Text>
      <RNTextInput testID="rn-password" secureTextEntry placeholder="Password" style={styles.field} />

      <Text style={styles.hint}>
        Type in each field and watch the keyboard's suggestion strip. With React Native's field the
        keyboard gets a password input type and shows no suggestions; with @expo/ui's it suggests the
        typed text.
      </Text>
    </View>
  );
}

export const component = SecureTextInput;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12 },
  label: { fontSize: 15, fontWeight: '600', marginTop: 12 },
  host: { alignSelf: 'stretch' },
  field: { fontSize: 18, padding: 12, borderRadius: 10, backgroundColor: '#e9e9ee' },
  hint: { marginTop: 16, fontSize: 14, color: '#6e6e73' },
});
