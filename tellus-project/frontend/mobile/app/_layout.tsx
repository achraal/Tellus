import { HarvestProvider } from '@/contexts/HarvestContext';
import { UserProvider, useUser } from '@/contexts/UserContext';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

/**
 * RootLayout
 * Top-level Stack navigator for the entire app.
 * Wraps the tree with UserProvider and HarvestProvider.
 * Inner component subscribes to theme changes for live switching.
 */
export default function RootLayout() {
  return (
    <UserProvider>
      <HarvestProvider>
        <InnerLayout />
      </HarvestProvider>
    </UserProvider>
  );
}

/**
 * InnerLayout
 * Must be inside UserProvider so it can read the user's theme preference
 * and switch themes live without an app restart.
 */
function InnerLayout() {
  const colorScheme = useAppColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}