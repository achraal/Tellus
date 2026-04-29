import { Colors, Radius, Shadows, Spacing } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { AccessibleText } from './AccessibleText';
import { ProgressBar } from './ProgressBar';

interface HarvestCardProps {
  cropName: string;
  yieldPercent: number;
  estimatedValue: string;
  progress: number;
  icon?: string;
  style?: ViewStyle;
}

/**
 * HarvestCard
 * Active harvest entry with crop icon, progress bar, yield,
 * and a green left accent bar.
 */
export function HarvestCard({
  cropName,
  yieldPercent,
  estimatedValue,
  progress,
  icon = 'leaf-outline',
  style,
}: HarvestCardProps) {
  const colorScheme = useAppColorScheme();

  return (
    <View style={[styles.card, Shadows.sm, { backgroundColor: Colors[colorScheme].card, borderColor: Colors[colorScheme].cardBorder }, style]}>
      {/* Left accent bar */}
      <View style={[styles.accent, { backgroundColor: Colors[colorScheme].tint }]} />

      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: Colors[colorScheme].tintLight }]}>
        <Ionicons name={icon as any} size={26} color={Colors[colorScheme].tint} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Top row */}
        <View style={styles.topRow}>
          <AccessibleText style={[styles.cropName, { color: Colors[colorScheme].text }]}>{cropName}</AccessibleText>
          <AccessibleText style={[styles.value, { color: Colors[colorScheme].tint }]}>{estimatedValue}</AccessibleText>
        </View>

        {/* Progress bar */}
        <ProgressBar progress={progress} color={Colors[colorScheme].tint} style={styles.progressBar} />

        {/* Bottom row */}
        <View style={styles.bottomRow}>
          <AccessibleText style={[styles.yield, { color: Colors[colorScheme].icon }]}>Yield: {yieldPercent}%</AccessibleText>
          <AccessibleText style={[styles.status, { color: Colors[colorScheme].success }]}>
            {yieldPercent >= 90 ? '● Ready' : yieldPercent >= 60 ? '● Growing' : '● Early'}
          </AccessibleText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  accent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: Radius.lg,
    borderBottomLeftRadius: Radius.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cropName: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  value: {
    fontSize: 15,
    fontWeight: '700',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 6,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  yield: {
    fontSize: 13,
    fontWeight: '500',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
  },
});
