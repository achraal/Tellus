import { AccessibleText } from '@/components/ui/AccessibleText';
import { Card } from '@/components/ui/Card';
import { Colors, GLOVE_HIT_SLOP, Radius, Shadows, Spacing } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import { useUser } from '@/contexts/UserContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Animated,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

/* ──────────────────────────── Component ──────────────────────────── */

export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useAppColorScheme();
  const styles = React.useMemo(() => getStyles(colorScheme), [colorScheme]);
  const { profile } = useUser();
  const { t } = useTranslation();

  /* ── Settings Data (translated) ── */
  const SETTINGS_SECTIONS = [
    {
      title: t('Account'),
      items: [
        { icon: 'person-outline', label: t('Profile'), route: '/settings/profile' },
        { icon: 'key-outline', label: t('Account & Security'), route: '/settings/account' },
        { icon: 'card-outline', label: t('Subscription'), route: '/settings/subscription' },
      ],
    },
    {
      title: t('Preferences'),
      items: [
        { icon: 'notifications-outline', label: t('Notification Preferences'), route: '/settings/notification-preferences' },
        { icon: 'moon-outline', label: t('Appearance'), route: '/settings/appearance' },
        { icon: 'language-outline', label: t('Language'), route: '/settings/language' },
      ],
    },
    {
      title: t('Support'),
      items: [
        { icon: 'help-circle-outline', label: t('Help & Support'), route: '/settings/help' },
        { icon: 'document-text-outline', label: t('Terms of Service'), route: '/settings/terms' },
        { icon: 'shield-checkmark-outline', label: t('Privacy Policy'), route: '/settings/privacy' },
      ],
    },
  ];

  const handleLogout = () => {
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AccessibleText style={styles.screenTitle}>{t('Settings')}</AccessibleText>

        {/* Profile preview card */}
        <Pressable
          style={({ pressed }) => [pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
          onPress={() => router.push('/settings/profile' as any)}
          hitSlop={GLOVE_HIT_SLOP}
        >
          <View style={[styles.profileCard, Shadows.md]}>
            {profile.avatarUri ? (
              <Image
                source={{ uri: profile.avatarUri }}
                style={styles.avatarImage}
                cachePolicy="memory-disk"
                contentFit="cover"
                transition={200}
              />
            ) : (
              <View style={styles.avatar}>
                <Ionicons name="person" size={26} color="#fff" />
              </View>
            )}
            <View style={styles.profileInfo}>
              <AccessibleText style={styles.profileName}>{profile.fullName}</AccessibleText>
              <AccessibleText style={styles.profileEmail}>{profile.email}</AccessibleText>
              <View style={styles.roleBadge}>
                <AccessibleText style={styles.roleBadgeText}>{profile.role}</AccessibleText>
              </View>
            </View>
            <View style={styles.chevronWrap}>
              <Ionicons name="chevron-forward" size={18} color={Colors[colorScheme].textSecondary} />
            </View>
          </View>
        </Pressable>

        {/* Settings sections */}
        {SETTINGS_SECTIONS.map((section) => (
          <View key={section.title} style={styles.sectionBlock}>
            <AccessibleText style={styles.sectionTitle}>{section.title}</AccessibleText>
            <Card style={styles.sectionCard}>
              {section.items.map((item, idx) => (
                <Pressable
                  key={item.label}
                  style={({ pressed }) => [
                    styles.settingRow,
                    idx < section.items.length - 1 && styles.settingBorder,
                    pressed && styles.settingPressed,
                  ]}
                  onPress={() => router.push(item.route as any)}
                  hitSlop={GLOVE_HIT_SLOP}
                >
                  <View style={styles.settingIconWrap}>
                    <Ionicons name={item.icon as any} size={20} color={Colors[colorScheme].tint} />
                  </View>
                  <AccessibleText style={styles.settingLabel}>{item.label}</AccessibleText>
                  <Ionicons name="chevron-forward" size={16} color={Colors[colorScheme].textSecondary} />
                </Pressable>
              ))}
            </Card>
          </View>
        ))}

        {/* Logout */}
        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
          ]}
          onPress={handleLogout}
          hitSlop={GLOVE_HIT_SLOP}
        >
          <Ionicons name="log-out-outline" size={20} color={Colors[colorScheme].error} />
          <AccessibleText style={styles.logoutText}>{t('Logout')}</AccessibleText>
        </Pressable>

        {/* Logo + Version */}
        <View style={styles.footerContainer}>
          <Image
            source={require('@/assets/images/tellus-logo.png')}
            style={styles.footerLogo}
            contentFit="contain"
          />
          <AccessibleText style={styles.version}>Tellus v1.0.0</AccessibleText>
        </View>

        {/* Bottom spacing for floating tab bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ──────────────────────────── Styles ──────────────────────────── */

const getStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors[theme].backgroundSoft,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing['4xl'],
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors[theme].text,
    marginBottom: Spacing.xl,
    letterSpacing: -0.3,
  },

  /* Profile */
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
    backgroundColor: Colors[theme].darkSurface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors[theme].tint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatarImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  profileEmail: {
    fontSize: 13,
    color: Colors[theme].tintMuted,
    marginTop: 2,
  },
  roleBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  chevronWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Sections */
  sectionBlock: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors[theme].textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  sectionCard: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: 14,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  settingBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors[theme].divider,
  },
  settingPressed: {
    opacity: 0.6,
  },
  settingIconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors[theme].tintLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    color: Colors[theme].text,
    fontWeight: '500',
  },

  /* Logout */
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors[theme].errorLight,
    padding: 16,
    borderRadius: Radius.lg,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: theme === 'dark' ? '#5C2020' : '#FECACA',
  },
  logoutText: {
    color: Colors[theme].error,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },

  /* Footer with logo */
  footerContainer: {
    alignItems: 'center',
    marginTop: Spacing['3xl'],
    gap: 8,
  },
  footerLogo: {
    width: 60,
    height: 30,
    opacity: 0.6,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors[theme].textSecondary,
    fontWeight: '500',
  },

  /* Bottom spacer */
  bottomSpacer: {
    height: 100,
  },
});