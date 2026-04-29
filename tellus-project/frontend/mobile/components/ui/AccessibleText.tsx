import React from 'react';
import { Text, TextProps } from 'react-native';

/**
 * AccessibleText
 * Drop-in replacement for React Native <Text> that ensures
 * `allowFontScaling` is always true for dynamic-type accessibility.
 */
export function AccessibleText({ style, children, ...props }: TextProps) {
  return (
    <Text allowFontScaling={true} {...props} style={style}>
      {children}
    </Text>
  );
}
