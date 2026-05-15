import { Stack } from 'expo-router';
import { Colors } from '../../src/constants/Colors';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.lightGray },
        animation: 'slide_from_right',
      }}
    />
  );
}
