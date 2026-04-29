import { Colors, Radius } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import React, { useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { AccessibleText } from './AccessibleText';

interface CustomInputProps extends TextInputProps {
  label: string;
}

export function CustomInput({ label, style, ...props }: CustomInputProps) {
  const colorScheme = useAppColorScheme();
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors[colorScheme].inputBorder, Colors[colorScheme].inputBorderFocus],
  });

  return (
    <View style={styles.container}>
      <AccessibleText
        style={[
          styles.label,
          { color: isFocused ? Colors[colorScheme].tint : Colors[colorScheme].text },
        ]}
      >
        {label}
      </AccessibleText>
      <Animated.View
        style={[
          styles.inputWrapper,
          {
            borderColor,
            backgroundColor: Colors[colorScheme].card,
          },
          isFocused && styles.inputFocused,
        ]}
      >
        <TextInput
          style={[
            styles.input,
            { color: Colors[colorScheme].text },
            style,
          ]}
          placeholderTextColor={Colors[colorScheme].icon}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 18,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  inputWrapper: {
    borderWidth: 1.5,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  inputFocused: {
    /* Focus relies purely on animated border color instead of width change */
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
});