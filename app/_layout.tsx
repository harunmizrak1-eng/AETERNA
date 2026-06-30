import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getDb } from '../src/db/client';
import { colors } from '../src/theme/tokens';

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getDb()
      .then(() => setReady(true))
      .catch((err) => {
        console.error('DB init failed', err);
        setReady(true); // don't block UI forever; surface error in-app later
      });
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.gold} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="compound/[id]" options={{ presentation: 'card', headerShown: false }} />
        <Stack.Screen name="stack/add/[compoundId]" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
