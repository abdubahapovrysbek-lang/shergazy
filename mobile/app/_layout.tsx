import { Stack, Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/Colors';
import { SavedProvider } from '../context/SavedContext';
import { AuthProvider, useAuth } from '../context/AuthContext';

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <>
        <StatusBar style="dark" backgroundColor={Colors.background} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="auth" />
        </Stack>
        <Redirect href="/auth" />
      </>
    );
  }

  return (
    <>
      <StatusBar style="dark" backgroundColor={Colors.background} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SavedProvider>
          <RootNavigator />
        </SavedProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
