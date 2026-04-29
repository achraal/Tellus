import { Colors } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import { Stack } from 'expo-router';
import React from 'react';


/**
 * Settings Stack Layout
 * Provides a back-navigable stack for all settings sub-screens.
 * Theme-aware header styling.
 */
export default function SettingsLayout() {
  const colorScheme = useAppColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Settings',
        headerTintColor: Colors[colorScheme].tint,
        headerTitleStyle: { fontWeight: '700', fontSize: 17, color: Colors[colorScheme].text } as any,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: Colors[colorScheme].backgroundSoft },
      }}
    >
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
      <Stack.Screen name="account" options={{ title: 'Account & Security' }} />
      <Stack.Screen name="subscription" options={{ title: 'Subscription' }} />
      <Stack.Screen name="notification-preferences" options={{ title: 'Notifications' }} />
      <Stack.Screen name="appearance" options={{ title: 'Appearance' }} />
      <Stack.Screen name="language" options={{ title: 'Language' }} />
      <Stack.Screen name="help" options={{ title: 'Help & Support' }} />
      <Stack.Screen name="terms" options={{ title: 'Terms of Service' }} />
      <Stack.Screen name="privacy" options={{ title: 'Privacy Policy' }} />
    </Stack>
  );
}
