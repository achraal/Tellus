import { AccessibleText } from '@/components/ui/AccessibleText';
import { Card } from '@/components/ui/Card';
import { Colors, Spacing } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import { useUser } from '@/contexts/UserContext';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';

interface NotifToggle {
  key: string;
  label: string;
  hint: string;
}

const PUSH_TOGGLES: NotifToggle[] = [
  { key: 'orders', label: 'New Orders', hint: 'Receive alerts when buyers place orders' },
  { key: 'bids', label: 'Bid Updates', hint: 'Get notified about new and changed bids' },
  { key: 'messages', label: 'Messages', hint: 'Alerts for new buyer messages' },
  { key: 'sync', label: 'Sync Status', hint: 'Notifications about data upload progress' },
  { key: 'market', label: 'Market Watch', hint: 'Daily commodity price updates' },
];

const EMAIL_TOGGLES: NotifToggle[] = [
  { key: 'weekly', label: 'Weekly Digest', hint: 'Summary of your farm activity every Monday' },
  { key: 'promo', label: 'Promotions', hint: 'Special offers and new features' },
  { key: 'audits', label: 'Audit Reminders', hint: 'Upcoming certification audit alerts' },
];

/**
 * NotificationPreferencesScreen
 * Push and email notification toggles — persisted via UserContext.
 */
export default function NotificationPreferencesScreen() {
  const colorScheme = useAppColorScheme();
  const styles = React.useMemo(() => getStyles(colorScheme), [colorScheme]);
  const { preferences, updatePreferences } = useUser();

  const togglePush = (key: string) => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    const updated = { ...preferences.pushNotifications, [key]: !preferences.pushNotifications[key] };
    updatePreferences({ pushNotifications: updated });
  };

  const toggleEmail = (key: string) => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    const updated = { ...preferences.emailNotifications, [key]: !preferences.emailNotifications[key] };
    updatePreferences({ emailNotifications: updated });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <AccessibleText style={styles.sectionTitle}>Push Notifications</AccessibleText>
        <Card style={styles.card}>
          {PUSH_TOGGLES.map((item, idx) => (
            <View
              key={item.key}
              style={[styles.row, idx < PUSH_TOGGLES.length - 1 && styles.rowBorder]}
            >
              <View style={styles.textWrap}>
                <AccessibleText style={styles.label}>{item.label}</AccessibleText>
                <AccessibleText style={styles.hint}>{item.hint}</AccessibleText>
              </View>
              <Switch
                trackColor={{ false: '#D1D5DB', true: '#A5D6A7' }}
                thumbColor={preferences.pushNotifications[item.key] ? Colors[colorScheme].tint : '#f4f3f4'}
                value={preferences.pushNotifications[item.key]}
                onValueChange={() => togglePush(item.key)}
              />
            </View>
          ))}
        </Card>

        <AccessibleText style={styles.sectionTitle}>Email Notifications</AccessibleText>
        <Card style={styles.card}>
          {EMAIL_TOGGLES.map((item, idx) => (
            <View
              key={item.key}
              style={[styles.row, idx < EMAIL_TOGGLES.length - 1 && styles.rowBorder]}
            >
              <View style={styles.textWrap}>
                <AccessibleText style={styles.label}>{item.label}</AccessibleText>
                <AccessibleText style={styles.hint}>{item.hint}</AccessibleText>
              </View>
              <Switch
                trackColor={{ false: '#D1D5DB', true: '#A5D6A7' }}
                thumbColor={preferences.emailNotifications[item.key] ? Colors[colorScheme].tint : '#f4f3f4'}
                value={preferences.emailNotifications[item.key]}
                onValueChange={() => toggleEmail(item.key)}
              />
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors[theme].backgroundSoft },
  container: { padding: Spacing.xl, paddingBottom: Spacing['4xl'] },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors[theme].textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
    marginLeft: Spacing.xs,
  },
  card: { marginBottom: Spacing.sm, paddingHorizontal: 14, paddingVertical: Spacing.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors[theme].divider },
  textWrap: { flex: 1, marginRight: Spacing.md },
  label: { fontSize: 15, fontWeight: '600', color: Colors[theme].text },
  hint: { fontSize: 12, color: Colors[theme].textSecondary, marginTop: 2 },
});
