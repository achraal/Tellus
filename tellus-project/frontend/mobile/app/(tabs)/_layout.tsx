import { SyncStatusIndicator } from '@/components/ui/SyncStatusIndicator';
import { Colors, GLOVE_HIT_SLOP, Radius, Shadows } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useUser } from '@/contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { AccessibleText } from '@/components/ui/AccessibleText';

/**
 * Main App Tab Layout
 * Floating-style bottom tab navigator with rounded corners, shadow,
 * and a persistent SyncStatusIndicator in the header area.
 */

export default function TabLayout() {
  const theme = useAppColorScheme();
  const styles = useMemo(() => getStyles(theme), [theme]);
  const { t } = useTranslation();
  const { profile } = useUser();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerRight: () => (
          <View style={styles.headerRight}>
            <SyncStatusIndicator status="synced" />
          </View>
        ),
        tabBarActiveTintColor: Colors[theme].tint,
        tabBarInactiveTintColor: Colors[theme].tabIconDefault,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      {/* Tab 1 — Dashboard */}
      <Tabs.Screen
        name="index"
        options={{
          title: t('Dashboard'),
          headerTitle: '',
          headerLeft: () => (
            <Pressable
              style={({ pressed }) => [
                styles.logoutButton,
                pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
              ]}
              onPress={() => router.replace('/login')}
              hitSlop={GLOVE_HIT_SLOP}
            >
              <Ionicons name="log-out-outline" size={14} color={Colors[theme].error} />
              <AccessibleText style={styles.logoutText}>{t('Logout')}</AccessibleText>
            </Pressable>
          ),
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : styles.inactiveIconWrap}>
              <Ionicons
                name={focused ? 'grid' : 'grid-outline'}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />

      {/* Tab 2 — New Harvest */}
      <Tabs.Screen
        name="add-harvest"
        options={{
          href: profile.role === 'Agriculteur' ? '/add-harvest' : null,
          title: t('New Harvest'),
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : styles.inactiveIconWrap}>
              <Ionicons
                name={focused ? 'add-circle' : 'add-circle-outline'}
                size={24}
                color={color}
              />
            </View>
          ),
        }}
      />

      {/* Tab 3 — Notifications */}
      <Tabs.Screen
        name="notifications"
        options={{
          title: t('Alerts'),
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : styles.inactiveIconWrap}>
              <Ionicons
                name={focused ? 'notifications' : 'notifications-outline'}
                size={22}
                color={color}
              />
            </View>
          ),
          tabBarBadge: 4,
          tabBarBadgeStyle: styles.badge,
        }}
      />

      {/* Tab 4 — Settings */}
      <Tabs.Screen
        name="settings"
        options={{
          title: t('Settings'),
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : styles.inactiveIconWrap}>
              <Ionicons
                name={focused ? 'settings' : 'settings-outline'}
                size={22}
                color={color}
              />
            </View>
          ),
        }}
      />

      {/* Hidden from tabs */}
      <Tabs.Screen
        name="location"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const getStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  headerStyle: {
    backgroundColor: Colors[theme].backgroundSoft,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerTitleStyle: {
    color: Colors[theme].text,
    fontWeight: '700',
    fontSize: 17,
  },
  headerRight: {
    marginRight: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors[theme].errorLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: theme === 'dark' ? '#5C2020' : '#FECACA',
    marginLeft: 16,
  },
  logoutText: {
    color: Colors[theme].error,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  tabBar: {
    backgroundColor: Colors[theme].background,
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    paddingTop: 8,
    marginHorizontal: 12,
    marginBottom: Platform.OS === 'ios' ? 0 : 8,
    borderRadius: Radius.xl,
    position: 'absolute',
    ...Shadows.lg,
    borderWidth: 1,
    borderColor: Colors[theme].cardBorder,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  tabBarItem: {
    paddingTop: 2,
  },
  activeIconWrap: {
    backgroundColor: Colors[theme].tintLight,
    width: 44,
    height: 44,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveIconWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: Colors[theme].tint,
    fontSize: 10,
    fontWeight: '700',
    minWidth: 18,
    height: 18,
    lineHeight: 18,
    borderRadius: 9,
  },
});