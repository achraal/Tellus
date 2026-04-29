import { AccessibleText } from '@/components/ui/AccessibleText';
import { Card } from '@/components/ui/Card';
import { Colors, GLOVE_HIT_SLOP, Radius, Spacing } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const FAQ_ITEMS = [
  {
    q: 'How do I add a new harvest?',
    a: 'Go to the "New Harvest" tab, fill in the crop details, upload a photo, and confirm the farm location on the map.',
  },
  {
    q: 'Can I use the app offline?',
    a: 'Yes! Toggle "Save Offline" when creating a harvest and your data will sync automatically when you reconnect.',
  },
  {
    q: 'How do I verify my farm boundaries?',
    a: 'In Step 2 of the harvest flow, the app will use your GPS to locate your farm. You can adjust the pin to confirm your exact boundary.',
  },
  {
    q: 'How do I contact a buyer?',
    a: 'When you receive a bid from a buyer, tap the notification to view their profile and send a message.',
  },
];

/**
 * HelpScreen
 * FAQ and contact information with working links.
 */
export default function HelpScreen() {
  const colorScheme = useAppColorScheme();
  const styles = React.useMemo(() => getStyles(colorScheme), [colorScheme]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* FAQ */}
        <AccessibleText style={styles.sectionTitle}>Frequently Asked Questions</AccessibleText>
        {FAQ_ITEMS.map((item, idx) => (
          <Card key={idx} style={styles.faqCard}>
            <View style={styles.faqHeader}>
              <View style={styles.faqIconWrap}>
                <Ionicons name="help-outline" size={16} color={Colors[colorScheme].tint} />
              </View>
              <AccessibleText style={styles.question}>{item.q}</AccessibleText>
            </View>
            <AccessibleText style={styles.answer}>{item.a}</AccessibleText>
          </Card>
        ))}

        {/* Contact */}
        <AccessibleText style={styles.sectionTitle}>Contact Us</AccessibleText>
        <Card style={styles.contactCard}>
          <ContactRow
            icon="mail-outline"
            label="Email Support"
            value="support@agridirect.farm"
            onPress={() => Linking.openURL('mailto:support@agridirect.farm')}
            theme={colorScheme}
          />
          <ContactRow
            icon="call-outline"
            label="Phone Support"
            value="+254 800 123 456"
            onPress={() => Linking.openURL('tel:+254800123456')}
            theme={colorScheme}
          />
          <ContactRow
            icon="logo-whatsapp"
            label="WhatsApp"
            value="+254 700 123 456"
            onPress={() => Linking.openURL('https://wa.me/254700123456')}
            theme={colorScheme}
            last
          />
        </Card>

        <AccessibleText style={styles.note}>
          Support hours: Mon–Fri, 8:00 AM – 6:00 PM (EAT)
        </AccessibleText>
      </ScrollView>
    </SafeAreaView>
  );
}

function ContactRow({
  icon,
  label,
  value,
  onPress,
  theme,
  last = false,
}: {
  icon: string;
  label: string;
  value: string;
  onPress: () => void;
  theme: 'light' | 'dark';
  last?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[contactStyles.contactRow, !last && { borderBottomWidth: 1, borderBottomColor: Colors[theme].divider }]}
      onPress={onPress}
      hitSlop={GLOVE_HIT_SLOP}
    >
      <View style={[contactStyles.iconWrap, { backgroundColor: Colors[theme].tintLight }]}>
        <Ionicons name={icon as any} size={20} color={Colors[theme].tint} />
      </View>
      <View style={contactStyles.contactInfo}>
        <AccessibleText style={[contactStyles.contactLabel, { color: Colors[theme].text }]}>
          {label}
        </AccessibleText>
        <AccessibleText style={[contactStyles.contactValue, { color: Colors[theme].textSecondary }]}>
          {value}
        </AccessibleText>
      </View>
      <Ionicons name="open-outline" size={16} color={Colors[theme].textSecondary} />
    </TouchableOpacity>
  );
}

const contactStyles = StyleSheet.create({
  contactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  contactInfo: { flex: 1 },
  contactLabel: { fontSize: 14, fontWeight: '600' },
  contactValue: { fontSize: 12, marginTop: 2 },
});

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
    marginTop: Spacing.lg,
    marginLeft: Spacing.xs,
  },
  faqCard: { marginBottom: Spacing.md },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  faqIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors[theme].tintLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  question: { fontSize: 15, fontWeight: '700', color: Colors[theme].text, flex: 1 },
  answer: { fontSize: 13, color: Colors[theme].textSecondary, lineHeight: 20, paddingLeft: 36 },
  contactCard: { paddingHorizontal: 14, paddingVertical: Spacing.xs },
  note: {
    fontSize: 12,
    color: Colors[theme].textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xl,
    lineHeight: 18,
    fontWeight: '500',
  },
});
