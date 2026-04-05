import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '../constants/Colors';
import { SavedProvider } from '../context/SavedContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SavedProvider>
        <StatusBar style="dark" backgroundColor={Colors.background} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SavedProvider>
    </SafeAreaProvider>
  );
}
