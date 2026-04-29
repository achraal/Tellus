/**
 * Tellus Design System
 * Comprehensive theme with colors, spacing, shadows, typography,
 * and high-contrast mode for outdoor / sunlight readability.
 */

import { Platform } from 'react-native';

/* ─── Primary Palette ──────────────────────────────────────────── */

const palette = {
  /** Forest greens */
  green50: '#E8F5E9',
  green100: '#C8E6C9',
  green200: '#A5D6A7',
  green300: '#81C784',
  green400: '#66BB6A',
  green500: '#4CAF50',
  green600: '#43A047',
  green700: '#388E3C',
  green800: '#2E7D32',
  green900: '#1B5E20',
  greenDeep: '#1B3A20',

  /** Neutrals */
  white: '#FFFFFF',
  gray50: '#F8FAF8',
  gray100: '#F1F3F1',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  black: '#000000',

  /** Accents */
  red50: '#FEF2F2',
  red100: '#FEE2E2',
  red400: '#F87171',
  red500: '#EF4444',
  amber50: '#FFFBEB',
  amber400: '#FBBF24',
  amber500: '#F59E0B',
  blue50: '#EFF6FF',
  blue400: '#60A5FA',
  blue500: '#3B82F6',
};

/* ─── Color Tokens ─────────────────────────────────────────────── */

export const Colors = {
  light: {
    text: palette.gray900,
    textSecondary: palette.gray500,
    background: palette.white,
    backgroundSoft: palette.gray50,
    card: palette.gray50,
    cardBorder: palette.gray200,
    tint: palette.green900,
    tintLight: palette.green50,
    tintMuted: palette.green200,
    icon: palette.gray500,
    tabIconDefault: palette.gray400,
    tabIconSelected: palette.green900,
    divider: palette.gray200,
    inputBorder: palette.gray300,
    inputBorderFocus: palette.green700,
    success: palette.green600,
    warning: palette.amber500,
    error: palette.red500,
    errorLight: palette.red100,

    /** Gradient pairs */
    gradientStart: palette.green800,
    gradientEnd: palette.green600,
    gradientSoft: palette.green50,

    /** Dark card surfaces */
    darkSurface: palette.greenDeep,
    darkSurfaceText: palette.white,
    darkSurfaceMuted: palette.green100,
  },
  dark: {
    text: '#E5E7EB',
    textSecondary: '#9CA3AF',
    background: '#0F1210',
    backgroundSoft: '#151A16',
    card: '#1A201C',
    cardBorder: '#2A332C',
    tint: palette.green400,
    tintLight: '#1A2E1D',
    tintMuted: palette.green800,
    icon: '#9BA1A6',
    tabIconDefault: '#6B7280',
    tabIconSelected: palette.green400,
    divider: '#2A332C',
    inputBorder: '#374151',
    inputBorderFocus: palette.green600,
    success: palette.green400,
    warning: palette.amber400,
    error: palette.red400,
    errorLight: '#2D1B1B',
    gradientStart: palette.green800,
    gradientEnd: palette.green600,
    gradientSoft: palette.green900,
    darkSurface: '#0D1A10',
    darkSurfaceText: palette.white,
    darkSurfaceMuted: palette.green200,
  },

  /**
   * High-Contrast mode — optimized for harsh outdoor sunlight.
   * Boosted text/background contrast ratios (WCAG AAA 7:1+).
   * Can be layered on top of light or dark.
   */
  highContrast: {
    light: {
      text: '#000000',
      textSecondary: '#1F2937',
      background: '#FFFFFF',
      backgroundSoft: '#FFFFFF',
      card: '#F3F4F6',
      cardBorder: '#9CA3AF',
      tint: '#14532D',
      tintLight: '#D1FAE5',
      tintMuted: '#6EE7B7',
      icon: '#374151',
      tabIconDefault: '#4B5563',
      tabIconSelected: '#14532D',
      divider: '#9CA3AF',
      inputBorder: '#6B7280',
      inputBorderFocus: '#14532D',
      success: '#15803D',
      warning: '#D97706',
      error: '#DC2626',
      errorLight: '#FEE2E2',
      gradientStart: '#14532D',
      gradientEnd: '#15803D',
      gradientSoft: '#D1FAE5',
      darkSurface: '#052E16',
      darkSurfaceText: '#FFFFFF',
      darkSurfaceMuted: '#BBF7D0',
    },
    dark: {
      text: '#FFFFFF',
      textSecondary: '#D1D5DB',
      background: '#000000',
      backgroundSoft: '#0A0A0A',
      card: '#1A1A1A',
      cardBorder: '#525252',
      tint: '#4ADE80',
      tintLight: '#14532D',
      tintMuted: '#166534',
      icon: '#D1D5DB',
      tabIconDefault: '#9CA3AF',
      tabIconSelected: '#4ADE80',
      divider: '#525252',
      inputBorder: '#6B7280',
      inputBorderFocus: '#4ADE80',
      success: '#4ADE80',
      warning: '#FBBF24',
      error: '#F87171',
      errorLight: '#450A0A',
      gradientStart: '#166534',
      gradientEnd: '#22C55E',
      gradientSoft: '#14532D',
      darkSurface: '#052E16',
      darkSurfaceText: '#FFFFFF',
      darkSurfaceMuted: '#BBF7D0',
    },
  },
};

/**
 * Helper to resolve the correct color set based on scheme and high-contrast flag.
 */
export function getColors(scheme: 'light' | 'dark', highContrast = false) {
  if (highContrast) {
    return Colors.highContrast[scheme];
  }
  return Colors[scheme];
}

/* ─── Spacing Scale ────────────────────────────────────────────── */

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

/* ─── Border Radius ────────────────────────────────────────────── */

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
} as const;

/* ─── Shadows ──────────────────────────────────────────────────── */

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  green: {
    shadowColor: palette.green800,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

/* ─── Hit Slop ─────────────────────────────────────────────────── */

/** Standard hit slop for small interactive elements (glove-friendly) */
export const GLOVE_HIT_SLOP = { top: 15, bottom: 15, left: 15, right: 15 } as const;

/* ─── Fonts ────────────────────────────────────────────────────── */

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
