import { Colors, Radius, Spacing } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';

interface SkeletonCardProps {
  style?: ViewStyle;
}

/**
 * SkeletonCard
 * Pre-composed skeleton resembling a HarvestCard layout.
 */
export function SkeletonCard({ style }: SkeletonCardProps) {
  const colorScheme = useAppColorScheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: Colors[colorScheme].card,
          borderColor: Colors[colorScheme].cardBorder,
        },
        style,
      ]}
    >
      {/* Left accent bar */}
      <View style={[styles.accent, { backgroundColor: Colors[colorScheme].cardBorder }]} />

      {/* Icon placeholder */}
      <SkeletonLoader width={48} height={48} borderRadius={Radius.md} />

      {/* Content area */}
      <View style={styles.content}>
        {/* Top row */}
        <View style={styles.topRow}>
          <SkeletonLoader width={120} height={16} borderRadius={4} />
          <SkeletonLoader width={60} height={16} borderRadius={4} />
        </View>

        {/* Progress bar */}
        <SkeletonLoader width={'100%' as any} height={6} borderRadius={3} style={styles.progressBar} />

        {/* Bottom row */}
        <View style={styles.bottomRow}>
          <SkeletonLoader width={80} height={12} borderRadius={4} />
          <SkeletonLoader width={60} height={12} borderRadius={4} />
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
  content: {
    flex: 1,
    marginLeft: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  progressBar: {
    marginBottom: 6,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
