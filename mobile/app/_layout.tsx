import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { useRouter, useSegments } from 'expo-router';
import { useEffect as useEffectInner } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../src/constants/Colors';

function AuthGate() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffectInner(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const isProtectedRoute = 
      segments[0] === '(seller)' || 
      segments[0] === '(admin)' || 
      segments[0] === '(agent)' || 
      (segments[0] === '(tabs)' && (segments[1] === 'bookings' || segments[1] === 'profile'));

    if (!isAuthenticated && isProtectedRoute) {
      // Guest trying to access protected route
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Authenticated user trying to access login/register
      if (user?.role === 'admin') {
        router.replace('/(admin)/dashboard');
      } else if (user?.role === 'seller') {
        router.replace('/(seller)/dashboard');
      } else if (user?.role === 'agent') {
        router.replace('/(agent)/dashboard');
      } else {
        router.replace('/(tabs)/');
      }
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.primaryDark }}>
        <ActivityIndicator size="large" color={Colors.accentOrange} />
      </View>
    );
  }

  return (
    <Stack initialRouteName="(tabs)" screenOptions={{ 
      headerShown: false,
      gestureEnabled: false,
      cardStyle: { backgroundColor: '#fff' },
    }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="(seller)" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="(admin)" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="(agent)" options={{ headerShown: false, gestureEnabled: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="auto" />
          <AuthGate />
          <Toast />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
