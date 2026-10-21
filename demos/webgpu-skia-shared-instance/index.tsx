import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Skia } from 'react-native-skia';
import { importDevice } from 'react-native-webgpu';

export const name = 'webgpu-skia-shared-instance';
export const description =
  "iOS and Android: react-native-webgpu can't find Skia's Dawn instance, so async work on Skia's device never settles.";

const TIMEOUT_MS = 3000;

// Imports Skia's GPU device into WebGPU and waits for an async GPU operation on it.
// Callbacks settle only when WebGPU pumps the instance the device belongs to, i.e. when
// it adopted Skia's instance through `rnskia_getWGPUInstance`.
async function checkSharedInstance(): Promise<string> {
  const device = importDevice(Skia.getNativeDevice());
  const buffer = device.createBuffer({ size: 16, usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST });
  const started = performance.now();
  const result = await Promise.race([
    buffer.mapAsync(GPUMapMode.READ).then(() => 'settled'),
    new Promise<string>((resolve) => setTimeout(() => resolve('timeout'), TIMEOUT_MS)),
  ]);
  const ms = Math.round(performance.now() - started);
  return result === 'settled'
    ? `mapAsync on Skia's device settled in ${ms} ms (shared instance found)`
    : `mapAsync on Skia's device did not settle after ${TIMEOUT_MS} ms (instance not shared)`;
}

function SharedInstance() {
  const [status, setStatus] = useState('Not run');
  return (
    <View style={styles.container}>
      <Button
        testID="run"
        title="Import Skia's device and mapAsync"
        onPress={() => {
          setStatus('Running…');
          checkSharedInstance().then(setStatus, (e) => setStatus(`Error: ${String(e)}`));
        }}
      />
      <Text testID="status" style={styles.status}>
        {status}
      </Text>
    </View>
  );
}

export const component = SharedInstance;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16, justifyContent: 'flex-end', paddingBottom: 96 },
  status: { fontSize: 16 },
});
