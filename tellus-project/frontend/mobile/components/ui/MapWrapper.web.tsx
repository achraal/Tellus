/**
 * MapWrapper – Web fallback
 * On web, react-native-maps is not supported. This provides a styled placeholder.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AccessibleText } from '@/components/ui/AccessibleText';
import { Colors, Radius } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';

export function MapWrapper({ style, children, ...props }: any) {
  const theme = useAppColorScheme();
  return (
    <View style={[styles.placeholder, { backgroundColor: Colors[theme].card, borderColor: Colors[theme].cardBorder }, style]}>
      <Ionicons name="map-outline" size={48} color={Colors[theme].tintMuted} />
      <AccessibleText style={[styles.text, { color: Colors[theme].textSecondary }]}>
        Map not available on web
      </AccessibleText>
      {children}
    </View>
  );
}

export function MapMarker(props: any) {
  return null;
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.xl,
    borderWidth: 1,
    gap: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});
