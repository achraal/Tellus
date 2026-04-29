import { AccessibleText } from '@/components/ui/AccessibleText';
import { CustomButton } from '@/components/ui/CustomButton';
import { CustomInput } from '@/components/ui/CustomInput';
import { Colors, GLOVE_HIT_SLOP, Spacing } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import { useTranslation } from '@/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

/**
 * LoginScreen
 * Auth flow entry point — email / password login with
 * "Remember this device", "Forgot Password?" options,
 * and biometric (Face ID / Fingerprint) authentication.
 * Features the Tellus logo with pulsing animation.
 */
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('Biometric');
  const router = useRouter();
  const colorScheme = useAppColorScheme();
  const styles = React.useMemo(() => getStyles(colorScheme), [colorScheme]);
  const { t } = useTranslation();

  /* ── Intro fade animation ── */
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Staggered field animations
  const field1Anim = useRef(new Animated.Value(0)).current;
  const field2Anim = useRef(new Animated.Value(0)).current;
  const field3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Stagger field entrance
      Animated.stagger(100, [
        Animated.timing(field1Anim, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(field2Anim, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(field3Anim, { toValue: 1, duration: 350, useNativeDriver: true }),
      ]).start();
    });

    // Pulse the logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim, pulseAnim, slideAnim, field1Anim, field2Anim, field3Anim]);

  /* ── Biometric check on mount ── */
  useEffect(() => {
    const checkBiometric = async () => {
      if (Platform.OS === 'web') return;
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (hasHardware && isEnrolled) {
          setBiometricAvailable(true);
          const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
          if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
            setBiometricType('Face ID');
          } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
            setBiometricType('Fingerprint');
          } else {
            setBiometricType('Biometric');
          }
        }
      } catch {
        // Biometric not available — fall back to password
      }
    };
    checkBiometric();
  }, []);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  const handleBiometricLogin = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Login with ${biometricType}`,
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });
      if (result.success) {
        router.replace('/(tabs)');
      }
    } catch {
      // Authentication failed — user stays on login screen
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Brand header */}
          <AccessibleText style={styles.header}>THE DIGITAL AGRONOMIST</AccessibleText>

          {/* Logo */}
          <Animated.View
            style={[styles.logoWrap, { transform: [{ scale: pulseAnim }] }]}
          >
            <Image
              source={require('@/assets/images/tellus-logo.png')}
              style={styles.logo}
              contentFit="contain"
              transition={300}
            />
          </Animated.View>

          {/* Welcome text */}
          <AccessibleText style={styles.title}>{t('Welcome Back')}</AccessibleText>
          <AccessibleText style={styles.subtitle}>
            {t('Please enter your details to access your dashboard.')}
          </AccessibleText>

          {/* Biometric login button */}
          {biometricAvailable && (
            <TouchableOpacity
              style={styles.biometricButton}
              onPress={handleBiometricLogin}
              activeOpacity={0.7}
              hitSlop={GLOVE_HIT_SLOP}
            >
              <Ionicons
                name={biometricType === 'Face ID' ? 'scan-outline' : 'finger-print-outline'}
                size={24}
                color={Colors[colorScheme].tint}
              />
              <AccessibleText style={styles.biometricText}>
                Login with {biometricType}
              </AccessibleText>
            </TouchableOpacity>
          )}

          {/* Email */}
          <Animated.View style={{ opacity: field1Anim }}>
            <CustomInput
              label={t('Email Address')}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Animated.View>

          {/* Password */}
          <Animated.View style={{ opacity: field2Anim }}>
            <CustomInput
              label={t('Password')}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </Animated.View>

          {/* Remember + Forgot row */}
          <Animated.View style={[styles.optionsRow, { opacity: field3Anim }]}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setRemember(!remember)}
              activeOpacity={0.7}
              hitSlop={GLOVE_HIT_SLOP}
            >
              <Ionicons
                name={remember ? 'checkbox' : 'square-outline'}
                size={22}
                color={Colors[colorScheme].tint}
              />
              <AccessibleText style={styles.checkboxLabel}>{t('Remember me')}</AccessibleText>
            </TouchableOpacity>

            <TouchableOpacity hitSlop={GLOVE_HIT_SLOP}>
              <AccessibleText style={styles.forgotText}>{t('Forgot Password?')}</AccessibleText>
            </TouchableOpacity>
          </Animated.View>

          {/* Login button */}
          <CustomButton
            title={t('Login to Dashboard →')}
            onPress={handleLogin}
            loading={isLoading}
            style={styles.loginButton}
          />

          {/* Create account */}
          <CustomButton
            title={t('Create an Account')}
            onPress={() => router.push('/signup')}
            variant="secondary"
            style={styles.signupButton}
          />
        </Animated.View>
      </ScrollView>

      {/* Bottom gradient accent line */}
      <View style={styles.bottomAccent} />
    </SafeAreaView>
  );
}

/* ──────────────────────────── Styles ──────────────────────────── */

const getStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors[theme].backgroundSoft,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing['3xl'],
  },
  content: {
    /* animated wrapper */
  },
  header: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors[theme].icon,
    textAlign: 'center',
    letterSpacing: 3,
    marginBottom: Spacing.xl,
  },
  logoWrap: {
    alignSelf: 'center',
    width: 150,
    height: 75,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing['3xl'],
  },
  logo: {
    width: 150,
    height: 75,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors[theme].text,
    marginBottom: Spacing.sm,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: Colors[theme].textSecondary,
    marginBottom: Spacing['3xl'],
    lineHeight: 22,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors[theme].tintMuted,
    backgroundColor: Colors[theme].tintLight,
    marginBottom: Spacing['2xl'],
    gap: 10,
  },
  biometricText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors[theme].tint,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    marginTop: -Spacing.sm,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: 8,
    color: Colors[theme].text,
    fontSize: 14,
    fontWeight: '500',
  },
  forgotText: {
    color: Colors[theme].tint,
    fontSize: 13,
    fontWeight: '600',
  },
  loginButton: {
    marginTop: Spacing.xl,
  },
  signupButton: {
    marginTop: Spacing.md,
  },
  bottomAccent: {
    height: 4,
    backgroundColor: Colors[theme].tint,
  },
});