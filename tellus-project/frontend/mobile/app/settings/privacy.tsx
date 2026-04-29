import { AccessibleText } from '@/components/ui/AccessibleText';
import { Colors, Spacing } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

/**
 * PrivacyScreen
 * Privacy policy — fully theme-aware.
 */
export default function PrivacyScreen() {
  const theme = useAppColorScheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <AccessibleText style={styles.updated}>Last updated: March 15, 2026</AccessibleText>

        <AccessibleText style={styles.heading}>1. Information We Collect</AccessibleText>
        <AccessibleText style={styles.body}>
          We collect personal information you provide during registration (name, email, phone),
          farm data (GPS coordinates, harvest photos, crop details), and device information
          (operating system, app version) to deliver and improve our services.
        </AccessibleText>

        <AccessibleText style={styles.heading}>2. How We Use Your Information</AccessibleText>
        <AccessibleText style={styles.body}>
          Your data is used to: provide harvest management services, connect you with buyers,
          generate analytics and market insights, sync your data across devices, and send
          notifications about orders and market updates.
        </AccessibleText>

        <AccessibleText style={styles.heading}>3. Location Data</AccessibleText>
        <AccessibleText style={styles.body}>
          The App collects precise GPS coordinates to map farm boundaries and verify harvest
          locations. Location data is only collected when you use farm mapping features and can
          be disabled in your device settings at any time.
        </AccessibleText>

        <AccessibleText style={styles.heading}>4. Data Storage & Security</AccessibleText>
        <AccessibleText style={styles.body}>
          Your data is stored on secure servers with industry-standard encryption. Offline data is
          stored locally on your device and encrypted at rest. We implement access controls,
          audit logging, and regular security reviews.
        </AccessibleText>

        <AccessibleText style={styles.heading}>5. Data Sharing</AccessibleText>
        <AccessibleText style={styles.body}>
          We do not sell your personal data. We may share anonymized, aggregated data with
          research partners to improve agricultural practices. Buyer-facing data (crop listings,
          quantities) is shared only with buyers you interact with through the marketplace.
        </AccessibleText>

        <AccessibleText style={styles.heading}>6. Your Rights</AccessibleText>
        <AccessibleText style={styles.body}>
          You have the right to: access and export your data, correct inaccurate information,
          delete your account and associated data, opt out of marketing communications, and
          restrict processing of your data.
        </AccessibleText>

        <AccessibleText style={styles.heading}>7. Cookies & Tracking</AccessibleText>
        <AccessibleText style={styles.body}>
          The App uses minimal analytics to understand usage patterns and improve performance.
          We do not use third-party advertising trackers. You can opt out of analytics in
          Notification Preferences.
        </AccessibleText>

        <AccessibleText style={styles.heading}>8. Children&apos;s Privacy</AccessibleText>
        <AccessibleText style={styles.body}>
          The App is not intended for users under 18. We do not knowingly collect data from
          minors. If we discover that a minor has created an account, we will promptly delete the
          associated data.
        </AccessibleText>

        <AccessibleText style={styles.heading}>9. Changes to This Policy</AccessibleText>
        <AccessibleText style={styles.body}>
          We may update this Privacy Policy periodically. We will notify you of significant changes
          through the App. Continued use after updates constitutes acceptance.
        </AccessibleText>

        <AccessibleText style={styles.heading}>10. Contact</AccessibleText>
        <AccessibleText style={styles.body}>
          For privacy-related inquiries, contact our Data Protection Officer at
          privacy@agridirect.farm.
        </AccessibleText>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors[theme].backgroundSoft },
  container: { padding: Spacing.xl, paddingBottom: Spacing['4xl'] },
  updated: {
    fontSize: 12,
    color: Colors[theme].textSecondary,
    marginBottom: Spacing.xl,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors[theme].text,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  body: {
    fontSize: 14,
    color: Colors[theme].textSecondary,
    lineHeight: 22,
  },
});
