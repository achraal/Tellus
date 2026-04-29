import { Colors, GLOVE_HIT_SLOP, Radius, Shadows } from '@/constants/theme';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { AccessibleText } from './AccessibleText';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CustomButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}: CustomButtonProps) {
  const colorScheme = useAppColorScheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.965, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    // Trigger haptic feedback on press
    if (Platform.OS !== 'web') {
      if (variant === 'primary') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.selectionAsync();
      }
    }
    onPress();
  };

  const isPrimary = variant === 'primary';

  return (
    <AnimatedPressable
      style={[
        styles.button,
        isPrimary
          ? { backgroundColor: Colors[colorScheme].tint }
          : { backgroundColor: Colors[colorScheme].tintLight, borderWidth: 1.5, borderColor: Colors[colorScheme].tintMuted },
        isPrimary && Shadows.green,
        (disabled || loading) && styles.disabled,
        animatedStyle,
        style,
      ]}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      hitSlop={GLOVE_HIT_SLOP}
    >
      {loading ? (
        <ActivityIndicator
          color={isPrimary ? '#fff' : Colors[colorScheme].tint}
          size="small"
        />
      ) : (
        <AccessibleText
          style={[
            styles.text,
            isPrimary ? { color: '#fff' } : { color: Colors[colorScheme].tint },
            textStyle,
          ]}
        >
          {title}
        </AccessibleText>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});