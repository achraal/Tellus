import { useUser } from '@/contexts/UserContext';
import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * Web variant of useAppColorScheme.
 * Supports hydration for static rendering and respects user's theme preference.
 */
export function useAppColorScheme(): 'light' | 'dark' {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const deviceScheme = useRNColorScheme();

  if (!hasHydrated) {
    return 'light';
  }

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { preferences } = useUser();
    if (preferences.theme === 'light') return 'light';
    if (preferences.theme === 'dark') return 'dark';
    return deviceScheme === 'dark' ? 'dark' : 'light';
  } catch {
    return deviceScheme === 'dark' ? 'dark' : 'light';
  }
}

// Backward compat alias
export const useColorScheme = useAppColorScheme;

export { useColorScheme as useDeviceColorScheme } from 'react-native';
