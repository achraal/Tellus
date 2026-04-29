import { AccessibleText } from '@/components/ui/AccessibleText';
import { Colors, Spacing } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

/**
 * TermsScreen
 * Terms of Service — fully theme-aware.
 */
export default function TermsScreen() {
  const theme = useAppColorScheme();
  const styles = useMemo(() => getStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <AccessibleText style={styles.updated}>Last updated: March 15, 2026</AccessibleText>

        <AccessibleText style={styles.heading}>1. Acceptance of Terms</AccessibleText>
        <AccessibleText style={styles.body}>
          By accessing or using the Tellus / AgriDirect mobile application (&quot;App&quot;), you agree to be
          bound by these Terms of Service. If you do not agree, please discontinue use of the App
          immediately.
        </AccessibleText>

        <AccessibleText style={styles.heading}>2. Eligibility</AccessibleText>
        <AccessibleText style={styles.body}>
          You must be at least 18 years of age and legally capable of entering into a binding
          agreement to use the App. By registering, you confirm that the information you provide is
          accurate and complete.
        </AccessibleText>

        <AccessibleText style={styles.heading}>3. User Accounts</AccessibleText>
        <AccessibleText style={styles.body}>
          You are responsible for maintaining the confidentiality of your account credentials.
          Notify us immediately if you suspect any unauthorized access. We reserve the right to
          suspend accounts that violate these terms.
        </AccessibleText>

        <AccessibleText style={styles.heading}>4. Harvest Data & Content</AccessibleText>
        <AccessibleText style={styles.body}>
          You retain ownership of all harvest data, photographs, and farm information you submit.
          By uploading content, you grant AgriDirect a non-exclusive, royalty-free license to use
          this data to provide and improve our services.
        </AccessibleText>

        <AccessibleText style={styles.heading}>5. Marketplace Conduct</AccessibleText>
        <AccessibleText style={styles.body}>
          All transactions between farmers and buyers are facilitated through the App. AgriDirect
          does not guarantee the quality, quantity, or delivery of goods. Users are responsible for
          fulfilling their obligations under any agreed-upon transactions.
        </AccessibleText>

        <AccessibleText style={styles.heading}>6. Offline Functionality</AccessibleText>
        <AccessibleText style={styles.body}>
          The App may store data locally on your device for offline use. This data will be synced to
          our servers when a network connection is available. We are not liable for data loss due to
          device failure before synchronization.
        </AccessibleText>

        <AccessibleText style={styles.heading}>7. Limitation of Liability</AccessibleText>
        <AccessibleText style={styles.body}>
          AgriDirect shall not be liable for any indirect, incidental, or consequential damages
          arising from the use of the App, including but not limited to loss of crops, revenue, or
          data.
        </AccessibleText>

        <AccessibleText style={styles.heading}>8. Changes to Terms</AccessibleText>
        <AccessibleText style={styles.body}>
          We may update these terms from time to time. Continued use of the App after changes
          constitutes acceptance. We will notify users of material changes through the App or via
          email.
        </AccessibleText>

        <AccessibleText style={styles.heading}>9. Contact</AccessibleText>
        <AccessibleText style={styles.body}>
          For questions regarding these terms, contact us at legal@agridirect.farm.
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
