import { Colors, Radius } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface ProgressBarProps {
  progress: number;
  color?: string;
  trackColor?: string;
  style?: StyleProp<ViewStyle>;
  /** Whether to animate the fill on mount */
  animated?: boolean;
}

export function ProgressBar({
  progress,
  color,
  trackColor,
  style,
  animated = true,
}: ProgressBarProps) {
  const colorScheme = useAppColorScheme();
  const resolvedColor = color ?? Colors[colorScheme].tint;
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const width = useSharedValue(animated ? 0 : clampedProgress);

  useEffect(() => {
    if (animated) {
      width.value = withTiming(clampedProgress, { duration: 800 });
    } else {
      width.value = clampedProgress;
    }
  }, [animated, clampedProgress, width]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View
      style={[
        styles.container,
        trackColor ? { backgroundColor: trackColor } : null,
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.bar,
          { backgroundColor: resolvedColor },
          animatedStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 8,
    width: '100%',
    backgroundColor: '#D1D5DB',
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: Radius.sm,
  },
});