import { Colors, Radius, Shadows, Spacing } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { AccessibleText } from './AccessibleText';

interface AnalyticsCardProps {
  label: string;
  value: string;
  icon?: string;
  dark?: boolean;
  style?: ViewStyle;
}

export function AnalyticsCard({
  label,
  value,
  icon = 'analytics-outline',
  dark = false,
  style,
}: AnalyticsCardProps) {
  const colorScheme = useAppColorScheme();

  return (
    <View
      style={[
        styles.card,
        dark ? { backgroundColor: Colors[colorScheme].darkSurface } : { backgroundColor: Colors[colorScheme].card, borderWidth: 1, borderColor: Colors[colorScheme].cardBorder },
        dark ? Shadows.md : Shadows.sm,
        style,
      ]}
    >
      {/* Icon */}
      <View style={[styles.iconWrap, dark ? { backgroundColor: 'rgba(46, 125, 50, 0.2)' } : { backgroundColor: Colors[colorScheme].tintLight }]}>
        <Ionicons
          name={icon as any}
          size={22}
          color={dark ? '#A5D6A7' : Colors[colorScheme].tint}
        />
      </View>

      {/* Value */}
      <AccessibleText style={[styles.value, dark ? { color: '#fff' } : { color: Colors[colorScheme].text }]}>{value}</AccessibleText>

      {/* Label */}
      <AccessibleText style={[styles.label, dark ? { color: '#A5D6A7' } : { color: Colors[colorScheme].icon }]}>{label}</AccessibleText>
    </View>
  );
}

const CARD_WIDTH = 170;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginRight: Spacing.md,
    justifyContent: 'center',
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: Spacing.xs,
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
});
