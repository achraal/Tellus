import { Colors, Radius, Spacing } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { AccessibleText } from './AccessibleText';

type SyncStatus = 'synced' | 'syncing' | 'offline';

interface SyncStatusIndicatorProps {
  status?: SyncStatus;
}

/**
 * SyncStatusIndicator
 * A subtle, persistent sync status icon (cloud) for the global header.
 * Pulses gently when syncing; static when synced or offline.
 */
export function SyncStatusIndicator({ status = 'synced' }: SyncStatusIndicatorProps) {
  const colorScheme = useAppColorScheme();
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (status === 'syncing') {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.4, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1 /* infinite */
      );
    } else {
      cancelAnimation(opacity);
      opacity.value = withTiming(1, { duration: 200 });
    }
  }, [status, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const iconName =
    status === 'synced'
      ? 'cloud-done-outline'
      : status === 'syncing'
        ? 'cloud-upload-outline'
        : 'cloud-offline-outline';

  const iconColor =
    status === 'synced'
      ? Colors[colorScheme].success
      : status === 'syncing'
        ? Colors[colorScheme].warning
        : Colors[colorScheme].error;

  const label =
    status === 'synced' ? 'Synced' : status === 'syncing' ? 'Syncing…' : 'Offline';

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View
        style={[
          styles.badge,
          {
            backgroundColor:
              status === 'synced'
                ? Colors[colorScheme].tintLight
                : status === 'syncing'
                  ? `${Colors[colorScheme].warning}20`
                  : `${Colors[colorScheme].error}20`,
          },
        ]}
      >
        <Ionicons name={iconName as any} size={16} color={iconColor} />
        <AccessibleText
          style={[
            styles.label,
            { color: iconColor },
          ]}
        >
          {label}
        </AccessibleText>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
