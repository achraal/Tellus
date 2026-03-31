import { Colors, Radius } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface SkeletonLoaderProps {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

/**
 * SkeletonLoader
 * Reusable animated shimmer placeholder.
 * Uses opacity animation with react-native-reanimated.
 */
export function SkeletonLoader({
  width,
  height,
  borderRadius = Radius.sm,
  style,
}: SkeletonLoaderProps) {
  const colorScheme = useAppColorScheme();
  const shimmer = useSharedValue(0.3);

  useEffect(() => {
    shimmer.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1
    );
  }, [shimmer]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: shimmer.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: Colors[colorScheme].cardBorder,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}
