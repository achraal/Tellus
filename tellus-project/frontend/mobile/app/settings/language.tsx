import { AccessibleText } from '@/components/ui/AccessibleText';
import { Card } from '@/components/ui/Card';
import { Colors, GLOVE_HIT_SLOP, Radius, Spacing } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import { useTranslation } from '@/hooks/useTranslation';
import { useUser } from '@/contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useRef } from 'react';
import {
  Animated,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'fr', label: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'sw', label: 'Swahili', native: 'Kiswahili', flag: '🇰🇪' },
  { code: 'ar', label: 'Arabic', native: 'العربية', flag: '🇸🇦' },
  { code: 'pt', label: 'Portuguese', native: 'Português', flag: '🇧🇷' },
  { code: 'es', label: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'zh', label: 'Chinese', native: '中文', flag: '🇨🇳' },
];

/**
 * LanguageScreen
 * Language selection — switches immediately on tap (no confirmation dialog).
 * Persisted to AsyncStorage via UserContext. Re-renders instantly through React context.
 */
export default function LanguageScreen() {
  const colorScheme = useAppColorScheme();
  const styles = React.useMemo(() => getStyles(colorScheme), [colorScheme]);
  const { preferences, updatePreferences } = useUser();
  const { t } = useTranslation();

  // Animated check scale for the selected language
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleSelect = (code: string) => {
    if (code === preferences.language) return;

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Animate the check icon
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Switch immediately — no confirmation dialog needed
    updatePreferences({ language: code });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <AccessibleText style={styles.sectionTitle}>{t('Select Language')}</AccessibleText>
        <Card style={styles.card}>
          {LANGUAGES.map((lang, idx) => {
            const isSelected = preferences.language === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.row,
                  idx < LANGUAGES.length - 1 && styles.rowBorder,
                  isSelected && styles.rowSelected,
                ]}
                onPress={() => handleSelect(lang.code)}
                activeOpacity={0.6}
                hitSlop={GLOVE_HIT_SLOP}
              >
                <AccessibleText style={styles.flag}>{lang.flag}</AccessibleText>
                <View style={styles.textWrap}>
                  <AccessibleText style={[styles.label, isSelected && styles.labelSelected]}>
                    {lang.label}
                  </AccessibleText>
                  <AccessibleText style={styles.native}>{lang.native}</AccessibleText>
                </View>
                {isSelected ? (
                  <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <View style={styles.checkCircle}>
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    </View>
                  </Animated.View>
                ) : (
                  <View style={styles.emptyCircle} />
                )}
              </TouchableOpacity>
            );
          })}
        </Card>
        <AccessibleText style={styles.note}>
          {t('Language preference is saved and applied instantly.')}
        </AccessibleText>
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
  card: { paddingHorizontal: 14, paddingVertical: Spacing.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderRadius: Radius.md,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors[theme].divider },
  rowSelected: {
    backgroundColor: Colors[theme].tintLight,
    marginHorizontal: -4,
    paddingHorizontal: 8,
    borderRadius: Radius.md,
  },
  flag: {
    fontSize: 24,
    marginRight: 14,
  },
  textWrap: { flex: 1 },
  label: { fontSize: 15, fontWeight: '600', color: Colors[theme].text },
  labelSelected: { color: Colors[theme].tint, fontWeight: '700' },
  native: { fontSize: 13, color: Colors[theme].textSecondary, marginTop: 2 },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors[theme].tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: Colors[theme].cardBorder,
  },
  note: {
    fontSize: 12,
    color: Colors[theme].textSecondary,
    textAlign: 'center',
    marginTop: Spacing['2xl'],
    lineHeight: 18,
    fontWeight: '500',
  },
});
