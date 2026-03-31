import { AccessibleText } from '@/components/ui/AccessibleText';
import { Card } from '@/components/ui/Card';
import { CustomButton } from '@/components/ui/CustomButton';
import { Colors, Radius, Shadows, Spacing } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

/**
 * SubscriptionScreen
 * Current plan, usage stats, and upgrade options.
 */
export default function SubscriptionScreen() {
  const theme = useAppColorScheme();
  const styles = React.useMemo(() => getStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Current plan card */}
        <View style={[styles.planCard, Shadows.md]}>
          <View style={styles.planBadge}>
            <Ionicons name="leaf" size={16} color="#fff" />
            <AccessibleText style={styles.planBadgeText}>STARTER</AccessibleText>
          </View>
          <AccessibleText style={styles.planPrice}>
            Free <AccessibleText style={styles.planCycle}>/ month</AccessibleText>
          </AccessibleText>
          <AccessibleText style={styles.planDesc}>
            Basic harvest management with up to 5 active lots.
          </AccessibleText>
        </View>

        {/* Usage */}
        <AccessibleText style={styles.sectionTitle}>Usage This Month</AccessibleText>
        <Card style={styles.usageCard}>
          <UsageRow label="Active Harvests" value="3 / 5" />
          <UsageRow label="Photo Uploads" value="12 / 50" />
          <UsageRow label="Sync Operations" value="28 / 100" />
          <UsageRow label="GPS Lookups" value="8 / 20" last />
        </Card>

        {/* Available plans */}
        <AccessibleText style={styles.sectionTitle}>Available Plans</AccessibleText>

        <Card elevated style={styles.upgradeCard}>
          <View style={styles.upgradeHeader}>
            <View>
              <AccessibleText style={styles.upgradeName}>Pro Plan</AccessibleText>
              <AccessibleText style={styles.upgradePrice}>$9.99/mo</AccessibleText>
            </View>
            <View style={styles.popularBadge}>
              <AccessibleText style={styles.popularText}>Popular</AccessibleText>
            </View>
          </View>
          <AccessibleText style={styles.upgradeDesc}>
            Unlimited harvests, priority sync, advanced analytics, and buyer messaging.
          </AccessibleText>
          <CustomButton title="Upgrade to Pro" onPress={() => {}} style={styles.upgradeBtn} />
        </Card>

        <Card style={styles.upgradeCard}>
          <View style={styles.upgradeHeader}>
            <View>
              <AccessibleText style={styles.upgradeName}>Enterprise</AccessibleText>
              <AccessibleText style={styles.upgradePrice}>$29.99/mo</AccessibleText>
            </View>
          </View>
          <AccessibleText style={styles.upgradeDesc}>
            Everything in Pro plus multi-farm management, team accounts, and API access.
          </AccessibleText>
          <CustomButton
            title="Contact Sales"
            onPress={() => {}}
            variant="secondary"
            style={styles.upgradeBtn}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function UsageRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  const theme = useAppColorScheme();
  const styles = React.useMemo(() => getStyles(theme), [theme]);

  return (
    <View style={[styles.usageRow, !last && styles.usageBorder]}>
      <AccessibleText style={styles.usageLabel}>{label}</AccessibleText>
      <AccessibleText style={styles.usageValue}>{value}</AccessibleText>
    </View>
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
    marginTop: Spacing['2xl'],
    marginLeft: Spacing.xs,
  },

  /* Current plan */
  planCard: {
    backgroundColor: Colors[theme].darkSurface,
    borderRadius: Radius.xl,
    padding: Spacing['2xl'],
    marginBottom: Spacing.sm,
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors[theme].tint,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
    marginBottom: Spacing.lg,
  },
  planBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 6,
    letterSpacing: 1,
  },
  planPrice: { fontSize: 32, fontWeight: '800', color: '#fff', marginBottom: 6 },
  planCycle: { fontSize: 14, fontWeight: '400', color: '#A5D6A7' },
  planDesc: { fontSize: 14, color: '#C8E6C9', lineHeight: 20 },

  /* Usage */
  usageCard: { marginBottom: Spacing.sm },
  usageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  usageBorder: { borderBottomWidth: 1, borderBottomColor: Colors[theme].divider },
  usageLabel: { fontSize: 14, color: Colors[theme].text, fontWeight: '500' },
  usageValue: { fontSize: 14, fontWeight: '700', color: Colors[theme].tint },

  /* Upgrade */
  upgradeCard: { marginBottom: Spacing.md },
  upgradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  upgradeName: { fontSize: 18, fontWeight: '800', color: Colors[theme].text },
  upgradePrice: { fontSize: 16, fontWeight: '700', color: Colors[theme].tint, marginTop: 2 },
  popularBadge: {
    backgroundColor: Colors[theme].tintLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors[theme].tintMuted,
  },
  popularText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors[theme].tint,
  },
  upgradeDesc: {
    fontSize: 13,
    color: Colors[theme].textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  upgradeBtn: { paddingVertical: 12 },
});
