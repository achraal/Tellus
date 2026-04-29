import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

/* ──────────────────────────── Types ──────────────────────────── */

export type UserRole = 'Agriculteur' | 'Acheteur' | 'Admin';

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  farmName: string;
  avatarUri: string | null;
  memberSince: string;
  farmLocation?: { latitude: number; longitude: number; };
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  highContrast: boolean;
  pushNotifications: Record<string, boolean>;
  emailNotifications: Record<string, boolean>;
  twoFactorEnabled: boolean;
}

interface UserContextValue {
  profile: UserProfile;
  preferences: UserPreferences;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  isProfileLoaded: boolean;
}

/* ──────────────────────────── Defaults ──────────────────────────── */

const DEFAULT_PROFILE: UserProfile = {
  fullName: 'Silas Kamau',
  email: 'silas@agridirect.farm',
  phone: '+254 700 123 456',
  password: 'hashed_password_mock',
  role: 'Agriculteur',
  farmName: 'Kamau Highland Farm',
  avatarUri: null,
  memberSince: 'March 2025',
};

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  language: 'en',
  highContrast: false,
  pushNotifications: {
    orders: true,
    bids: true,
    messages: true,
    sync: false,
    market: true,
  },
  emailNotifications: {
    weekly: true,
    promo: false,
    audits: true,
  },
  twoFactorEnabled: false,
};

const STORAGE_KEY_PROFILE = '@tellus/user_profile';
const STORAGE_KEY_PREFS = '@tellus/user_preferences';

/* ──────────────────────────── Context ──────────────────────────── */

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  /* ── Load from storage on mount ── */
  useEffect(() => {
    const load = async () => {
      try {
        const [storedProfile, storedPrefs] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_PROFILE),
          AsyncStorage.getItem(STORAGE_KEY_PREFS),
        ]);
        if (storedProfile) {
          setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(storedProfile) });
        }
        if (storedPrefs) {
          setPreferences({ ...DEFAULT_PREFERENCES, ...JSON.parse(storedPrefs) });
        }
      } catch {
        // First launch — use defaults
      } finally {
        setIsProfileLoaded(true);
      }
    };
    load();
  }, []);

  /* ── Persist profile updates ── */
  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      AsyncStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(next)).catch(() => {
        Alert.alert('Error', 'Failed to save profile changes.');
      });
      return next;
    });
  }, []);

  /* ── Persist preference updates ── */
  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...updates };
      AsyncStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(next)).catch(() => {
        Alert.alert('Error', 'Failed to save preferences.');
      });
      return next;
    });
  }, []);

  return (
    <UserContext.Provider
      value={{ profile, preferences, updateProfile, updatePreferences, isProfileLoaded }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
}
