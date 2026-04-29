import { useUser } from '@/contexts/UserContext';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

/**
 * useAppColorScheme
 *
 * Returns the resolved color scheme, respecting the user's theme preference:
 * - 'system' → follows device setting
 * - 'light' → always light
 * - 'dark' → always dark
 *
 * This enables **live** theme switching from Settings > Appearance
 * without requiring an app restart.
 */
export function useAppColorScheme(): 'light' | 'dark' {
  const deviceScheme = useDeviceColorScheme();
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { preferences } = useUser();
    if (preferences.theme === 'light') return 'light';
    if (preferences.theme === 'dark') return 'dark';
    // 'system'
    return deviceScheme === 'dark' ? 'dark' : 'light';
  } catch {
    // If called outside UserProvider (shouldn't happen, but safe fallback)
    return deviceScheme === 'dark' ? 'dark' : 'light';
  }
}

// Re-export for the root layout which needs the raw device hook before UserProvider
export { useColorScheme as useDeviceColorScheme } from 'react-native';

// Alias for backward compat with files importing useColorScheme from this hook
export const useColorScheme = useAppColorScheme;
