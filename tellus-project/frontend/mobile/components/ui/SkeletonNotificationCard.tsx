import { Colors, Radius, Spacing } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { SkeletonLoader } from './SkeletonLoader';

interface SkeletonNotificationCardProps {
  style?: ViewStyle;
}

/**
 * SkeletonNotificationCard
 * Pre-composed skeleton resembling a NotificationCard layout.
 */
export function SkeletonNotificationCard({ style }: SkeletonNotificationCardProps) {
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
      {/* Icon circle placeholder */}
      <SkeletonLoader width={44} height={44} borderRadius={22} />

      {/* Text content */}
      <View style={styles.content}>
        <SkeletonLoader width={140} height={14} borderRadius={4} style={styles.titleSkeleton} />
        <SkeletonLoader width={200} height={12} borderRadius={4} />
      </View>

      {/* Timestamp */}
      <SkeletonLoader width={40} height={12} borderRadius={4} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.lg,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  titleSkeleton: {
    marginBottom: 6,
  },
});
