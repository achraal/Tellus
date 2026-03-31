import { AccessibleText } from '@/components/ui/AccessibleText';
import { CustomButton } from '@/components/ui/CustomButton';
import { CustomInput } from '@/components/ui/CustomInput';
import { Colors, GLOVE_HIT_SLOP, Radius, Shadows, Spacing } from '@/constants/theme';
import { useUser, UserRole } from '@/contexts/UserContext';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import { useTranslation } from '@/hooks/useTranslation';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as Location from 'expo-location';

WebBrowser.maybeCompleteAuthSession();

/**
 * SignupScreen
 * Account creation flow with full name, email, password,
 * farm boundaries, and SSO options. Features the Tellus logo.
 */
export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Agriculteur');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { updateProfile } = useUser();
  const colorScheme = useAppColorScheme();
  const styles = React.useMemo(() => getStyles(colorScheme), [colorScheme]);
  const { t } = useTranslation();

  const [farmCoords, setFarmCoords] = useState<{latitude: number; longitude: number} | null>(null);

  // Google OAuth Setup
  const [googleRequest, googleResponse, promptGoogleAsync] = Google.useAuthRequest({
    iosClientId: 'YOUR_GOOGLE_CLIENT_ID_IOS',
    androidClientId: 'YOUR_GOOGLE_CLIENT_ID_ANDROID',
    webClientId: 'YOUR_GOOGLE_CLIENT_ID_WEB',
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

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
    ]).start();
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { authentication } = googleResponse;
      if (authentication?.accessToken) {
        setIsLoading(true);
        fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: { Authorization: `Bearer ${authentication.accessToken}` },
        })
          .then(res => res.json())
          .then(user => {
            setEmail(user.email || '');
            setFullName(user.name || '');
            setIsLoading(false);
            handleSignupWithData({ email: user.email, fullName: user.name });
          })
          .catch(() => {
            setIsLoading(false);
            Alert.alert('Error', 'Failed to fetch Google profile.');
          });
      }
    }
  }, [googleResponse]);

  const handleSignupWithData = async (data: Record<string, string> = {}) => {
    setIsLoading(true);
    await updateProfile({
      fullName: data.fullName || fullName || 'New User',
      email: data.email || email || 'user@example.com',
      phone: phone,
      password: password,
      role: role,
      farmName: role === 'Agriculteur' ? 'My Farm' : 'N/A',
      farmLocation: farmCoords || undefined,
    });
    setIsLoading(false);
    router.replace('/(tabs)');
  };

  const handleSignup = () => handleSignupWithData({});

  const handleAppleAuth = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const name = credential.fullName
        ? `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim()
        : '';
        
      if (credential.email) setEmail(credential.email as string);
      if (name) setFullName(name);

      handleSignupWithData({ email: credential.email as string, fullName: name });
    } catch (e: any) {
      if (e.code !== 'ERR_REQUEST_CANCELED') {
        Alert.alert('Apple Sign-In Error', String(e));
      }
    }
  };

  const handleLocateFarm = async () => {
    try {
      setIsLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to find your farm.');
        setIsLoading(false);
        return;
      }
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setFarmCoords({ latitude: location.coords.latitude, longitude: location.coords.longitude });
      setIsLoading(false);
      Alert.alert('Location Found', `Farm boundaries marked at\nLat: ${location.coords.latitude.toFixed(4)}\nLng: ${location.coords.longitude.toFixed(4)}`);
    } catch (err) {
      setIsLoading(false);
      Alert.alert('Error', 'Could not fetch your location.');
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
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Brand header with Logo */}
          <View style={styles.headerRow}>
            <Image
              source={require('@/assets/images/tellus-logo.png')}
              style={styles.headerLogo}
              contentFit="contain"
              transition={300}
            />
          </View>

          {/* Title */}
          <AccessibleText style={styles.title}>{t('Join AgriDirect')}</AccessibleText>
          <AccessibleText style={styles.subtitle}>
            {t('Create your account to start managing your yield.')}
          </AccessibleText>

          {/* Input fields */}
          <CustomInput
            label={t('Full Name')}
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
          <CustomInput
            label={t('Email Address')}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <CustomInput
            label={t('Password')}
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <CustomInput
            label={t('Phone Number')}
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          {/* Role Selector */}
          <View style={styles.roleContainer}>
            <AccessibleText style={styles.roleTitle}>{t('Select Role')}</AccessibleText>
            <View style={styles.roleOptions}>
              {(['Agriculteur', 'Acheteur', 'Admin'] as const).map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.roleOption, role === r && styles.roleOptionActive]}
                  onPress={() => setRole(r)}
                  activeOpacity={0.7}
                  hitSlop={GLOVE_HIT_SLOP}
                >
                  <AccessibleText style={[styles.roleText, role === r && styles.roleTextActive]}>
                    {r}
                  </AccessibleText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Farm Boundaries section */}
          <View style={styles.farmSection}>
            <View style={styles.farmHeader}>
              <View style={styles.farmIconWrap}>
                <Ionicons name="map-outline" size={18} color={Colors[colorScheme].tint} />
              </View>
              <AccessibleText style={styles.farmLabel}>{t('Farm Boundaries')}</AccessibleText>
            </View>
            <AccessibleText style={styles.farmHint}>
              Let us locate your farm to enable geolocation features.
            </AccessibleText>
            <CustomButton
              title={farmCoords ? 'Location Saved ✓' : t('Locate My Farm')}
              onPress={handleLocateFarm}
              variant="secondary"
            />
          </View>

          {/* Create account button */}
          <CustomButton
            title={t('Create My Account →')}
            onPress={handleSignup}
            loading={isLoading}
            style={styles.createButton}
          />

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => router.back()} hitSlop={GLOVE_HIT_SLOP}>
              <AccessibleText style={styles.linkText}>
                {t('Already have an account?')}{' '}
                <AccessibleText style={styles.linkBold}>{t('Login')}</AccessibleText>
              </AccessibleText>
            </TouchableOpacity>

            {/* SSO divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <AccessibleText style={styles.dividerText}>or continue with</AccessibleText>
              <View style={styles.dividerLine} />
            </View>

            {/* SSO buttons */}
            <View style={styles.ssoRow}>
              <TouchableOpacity style={[styles.ssoButton, Shadows.sm]} onPress={() => promptGoogleAsync()} hitSlop={GLOVE_HIT_SLOP}>
                <FontAwesome name="google" size={20} color="#DB4437" />
                <AccessibleText style={styles.ssoLabel}>Google</AccessibleText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.ssoButton, Shadows.sm]} onPress={handleAppleAuth} hitSlop={GLOVE_HIT_SLOP}>
                <FontAwesome name="apple" size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                <AccessibleText style={styles.ssoLabel}>Apple</AccessibleText>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

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

  /* Header */
  headerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing['3xl'],
  },
  headerLogo: {
    width: 100,
    height: 50,
  },

  /* Title */
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

  /* Farm boundaries */
  farmSection: {
    padding: Spacing.lg,
    backgroundColor: Colors[theme].card,
    borderRadius: Radius.lg,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors[theme].cardBorder,
  },
  farmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  farmIconWrap: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    backgroundColor: Colors[theme].tintLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  farmLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors[theme].text,
  },
  farmHint: {
    fontSize: 13,
    color: Colors[theme].textSecondary,
    marginBottom: 14,
    lineHeight: 18,
  },

  /* Role Selector */
  roleContainer: {
    marginBottom: Spacing.xl,
  },
  roleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors[theme].textSecondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
  },
  roleOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: Radius.md,
    backgroundColor: Colors[theme].card,
    borderWidth: 1,
    borderColor: Colors[theme].cardBorder,
  },
  roleOptionActive: {
    backgroundColor: Colors[theme].tintLight,
    borderColor: Colors[theme].tint,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors[theme].textSecondary,
  },
  roleTextActive: {
    color: Colors[theme].tint,
  },

  /* Buttons */
  createButton: {
    marginTop: Spacing.xl,
  },

  /* Footer */
  footer: {
    marginTop: Spacing['3xl'],
    alignItems: 'center',
  },
  linkText: {
    color: Colors[theme].textSecondary,
    fontSize: 14,
  },
  linkBold: {
    color: Colors[theme].tint,
    fontWeight: '700',
  },

  /* Divider */
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing['2xl'],
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors[theme].divider,
  },
  dividerText: {
    marginHorizontal: 14,
    fontSize: 13,
    color: Colors[theme].textSecondary,
    fontWeight: '500',
  },

  /* SSO */
  ssoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  ssoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors[theme].cardBorder,
    borderRadius: Radius.md,
    backgroundColor: Colors[theme].background,
  },
  ssoLabel: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
    color: Colors[theme].text,
  },

  bottomAccent: {
    height: 4,
    backgroundColor: Colors[theme].tint,
  },
});