import { AccessibleText } from '@/components/ui/AccessibleText';
import { Card } from '@/components/ui/Card';
import { Colors, GLOVE_HIT_SLOP, Radius, Spacing } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import { useUser } from '@/contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

type ThemeOption = 'light' | 'dark' | 'system';

/**
 * AppearanceScreen
 * Theme selection — persisted to AsyncStorage via UserContext.
 */
export default function AppearanceScreen() {
  const colorScheme = useAppColorScheme();
  const styles = React.useMemo(() => getStyles(colorScheme), [colorScheme]);
  const { preferences, updatePreferences } = useUser();

  const options: { key: ThemeOption; label: string; icon: string; desc: string }[] = [
    { key: 'light', label: 'Light', icon: 'sunny-outline', desc: 'Always use the light theme' },
    { key: 'dark', label: 'Dark', icon: 'moon-outline', desc: 'Always use the dark theme' },
    { key: 'system', label: 'System', icon: 'phone-portrait-outline', desc: 'Follow your device settings' },
  ];

  const handleSelect = (key: ThemeOption) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    updatePreferences({ theme: key });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <AccessibleText style={styles.sectionTitle}>Theme</AccessibleText>
        <Card style={styles.card}>
          {options.map((opt, idx) => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.row, idx < options.length - 1 && styles.rowBorder]}
              onPress={() => handleSelect(opt.key)}
              activeOpacity={0.7}
              hitSlop={GLOVE_HIT_SLOP}
            >
              <View style={styles.iconWrap}>
                <Ionicons name={opt.icon as any} size={20} color={Colors[colorScheme].tint} />
              </View>
              <View style={styles.textWrap}>
                <AccessibleText style={styles.label}>{opt.label}</AccessibleText>
                <AccessibleText style={styles.hint}>{opt.desc}</AccessibleText>
              </View>
              <Ionicons
                name={preferences.theme === opt.key ? 'radio-button-on' : 'radio-button-off'}
                size={22}
                color={preferences.theme === opt.key ? Colors[colorScheme].tint : Colors[colorScheme].cardBorder}
              />
            </TouchableOpacity>
          ))}
        </Card>

        {/* High contrast toggle */}
        <AccessibleText style={styles.sectionTitle}>Accessibility</AccessibleText>
        <Card style={styles.card}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.selectionAsync();
              updatePreferences({ highContrast: !preferences.highContrast });
            }}
            activeOpacity={0.7}
            hitSlop={GLOVE_HIT_SLOP}
          >
            <View style={styles.iconWrap}>
              <Ionicons name="contrast-outline" size={20} color={Colors[colorScheme].tint} />
            </View>
            <View style={styles.textWrap}>
              <AccessibleText style={styles.label}>High Contrast Mode</AccessibleText>
              <AccessibleText style={styles.hint}>Optimized for outdoor sunlight readability</AccessibleText>
            </View>
            <Ionicons
              name={preferences.highContrast ? 'checkbox' : 'square-outline'}
              size={22}
              color={preferences.highContrast ? Colors[colorScheme].tint : Colors[colorScheme].cardBorder}
            />
          </TouchableOpacity>
        </Card>

        <AccessibleText style={styles.note}>
          Theme changes are applied instantly across the app.
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
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors[theme].divider },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors[theme].tintLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  textWrap: { flex: 1 },
  label: { fontSize: 15, fontWeight: '600', color: Colors[theme].text },
  hint: { fontSize: 12, color: Colors[theme].textSecondary, marginTop: 2 },
  note: {
    fontSize: 12,
    color: Colors[theme].textSecondary,
    textAlign: 'center',
    marginTop: Spacing['2xl'],
    lineHeight: 18,
    fontWeight: '500',
  },
});
