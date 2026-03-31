import { Colors, Radius, Spacing } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { AccessibleText } from './AccessibleText';

interface StepProgressBarProps {
  currentStep: number;
  totalSteps: number;
  style?: ViewStyle;
}

/**
 * StepProgressBar
 * Connected circles with lines — active steps are filled,
 * upcoming steps are outlined.
 */
export function StepProgressBar({ currentStep, totalSteps, style }: StepProgressBarProps) {
  const colorScheme = useAppColorScheme();

  return (
    <View style={[styles.wrapper, style]}>
      <AccessibleText style={[styles.label, { color: Colors[colorScheme].icon }]}>
        Step {currentStep} of {totalSteps}
      </AccessibleText>
      <View style={styles.row}>
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isCompleted = i < currentStep;
          const isCurrent = i === currentStep - 1;

          return (
            <React.Fragment key={i}>
              {/* Connector line (before each dot except the first) */}
              {i > 0 && (
                <View
                  style={[
                    styles.connector,
                    i < currentStep 
                      ? { backgroundColor: Colors[colorScheme].tint }
                      : { backgroundColor: Colors[colorScheme].cardBorder },
                  ]}
                />
              )}

              {/* Step dot */}
              <View
                style={[
                  styles.dot,
                  isCompleted 
                    ? { backgroundColor: Colors[colorScheme].tint }
                    : { backgroundColor: Colors[colorScheme].card, borderWidth: 2, borderColor: Colors[colorScheme].cardBorder },
                  isCurrent && { borderWidth: 3, borderColor: Colors[colorScheme].tintMuted },
                ]}
              >
                <AccessibleText
                  style={[
                    styles.dotText,
                    isCompleted ? { color: '#fff' } : { color: Colors[colorScheme].icon },
                  ]}
                >
                  {i + 1}
                </AccessibleText>
              </View>
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const DOT_SIZE = 32;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: 13,
    marginBottom: Spacing.md,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connector: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
