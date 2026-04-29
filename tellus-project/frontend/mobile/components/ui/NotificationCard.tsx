import { Colors, Radius, Spacing } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { AccessibleText } from './AccessibleText';

interface NotificationCardProps {
  icon: string;
  title: string;
  description: string;
  time?: string;
  iconColor?: string;
  unread?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export function NotificationCard({
  icon,
  title,
  description,
  time,
  iconColor,
  unread = false,
  onPress,
  style,
}: NotificationCardProps) {
  const colorScheme = useAppColorScheme();
  const resolvedIconColor = iconColor || Colors[colorScheme].tint;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: unread ? Colors[colorScheme].tintLight : Colors[colorScheme].card, borderColor: unread ? Colors[colorScheme].tintMuted : Colors[colorScheme].cardBorder },
        pressed && styles.pressed,
        style,
      ]}
      onPress={onPress}
    >
      {/* Unread dot */}
      {unread && <View style={[styles.unreadDot, { backgroundColor: Colors[colorScheme].tint }]} />}

      {/* Icon */}
      <View style={[styles.iconCircle, { backgroundColor: `${resolvedIconColor}15` }]}>
        <Ionicons name={icon as any} size={22} color={resolvedIconColor} />
      </View>

      {/* Text content */}
      <View style={styles.content}>
        <AccessibleText style={[styles.title, { color: Colors[colorScheme].text }]} numberOfLines={1}>
          {title}
        </AccessibleText>
        <AccessibleText style={[styles.description, { color: Colors[colorScheme].icon }]} numberOfLines={2}>
          {description}
        </AccessibleText>
      </View>

      {/* Timestamp */}
      {time ? <AccessibleText style={[styles.time, { color: Colors[colorScheme].icon }]}>{time}</AccessibleText> : null}
    </Pressable>
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
  pressed: {
    opacity: 0.7,
  },
  unreadDot: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
    letterSpacing: 0.1,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
  time: {
    fontSize: 12,
    marginLeft: 8,
    fontWeight: '500',
  },
});
