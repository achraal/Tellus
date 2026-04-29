import { Colors, Radius, Shadows } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  /** Use the elevated shadow preset */
  elevated?: boolean;
}

export function Card({ children, style, elevated = false, ...props }: CardProps) {
  const colorScheme = useAppColorScheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: Colors[colorScheme].card,
          borderColor: Colors[colorScheme].cardBorder,
        },
        elevated ? Shadows.md : Shadows.sm,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
  },
});