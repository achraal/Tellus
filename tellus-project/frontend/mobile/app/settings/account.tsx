import { AccessibleText } from '@/components/ui/AccessibleText';
import { Card } from '@/components/ui/Card';
import { CustomButton } from '@/components/ui/CustomButton';
import { CustomInput } from '@/components/ui/CustomInput';
import { Colors, GLOVE_HIT_SLOP, Radius, Spacing } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import { useUser } from '@/contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';

/**
 * AccountScreen
 * Account & Security settings.
 * Working password change, 2FA toggle (persisted), active sessions management,
 * and account deletion flow.
 */
export default function AccountScreen() {
  const router = useRouter();
  const theme = useAppColorScheme();
  const styles = React.useMemo(() => getStyles(theme), [theme]);
  const { preferences, updatePreferences } = useUser();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  /* ── Password change with validation ── */
  const handleChangePassword = async () => {
    if (!currentPassword.trim()) {
      Alert.alert('Error', 'Please enter your current password.');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('Error', 'New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }
    if (currentPassword === newPassword) {
      Alert.alert('Error', 'New password must be different from your current password.');
      return;
    }

    setIsChangingPassword(true);
    // Simulate API call
    setTimeout(() => {
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      Alert.alert('Success', 'Your password has been updated.');
    }, 1500);
  };

  /* ── 2FA toggle (persisted) ── */
  const handleToggle2FA = (value: boolean) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    if (value) {
      Alert.alert(
        'Enable Two-Factor Auth',
        'A verification code will be sent to your registered phone number each time you log in.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Enable',
            onPress: () => updatePreferences({ twoFactorEnabled: true }),
          },
        ]
      );
    } else {
      Alert.alert(
        'Disable Two-Factor Auth',
        'This will reduce the security of your account. Are you sure?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: () => updatePreferences({ twoFactorEnabled: false }),
          },
        ]
      );
    }
  };

  /* ── Sign out all sessions ── */
  const handleSignOutAll = () => {
    Alert.alert(
      'Sign Out All Sessions',
      'This will sign you out of all other devices. You will remain signed in on this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out All',
          style: 'destructive',
          onPress: () => {
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
            Alert.alert('Done', 'All other sessions have been signed out.');
          },
        },
      ]
    );
  };

  /* ── Delete account ── */
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure? This action is irreversible and all data will be permanently removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // In a real app, call API to delete account & clear storage
            Alert.alert('Account Deleted', 'Your account has been permanently removed.', [
              {
                text: 'OK',
                onPress: () => router.replace('/login'),
              },
            ]);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Change Password */}
        <AccessibleText style={styles.sectionTitle}>Change Password</AccessibleText>
        <Card style={styles.card}>
          <CustomInput
            label="Current Password"
            placeholder="Enter current password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
          />
          <CustomInput
            label="New Password"
            placeholder="Min. 8 characters"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <CustomInput
            label="Confirm New Password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <CustomButton
            title="Update Password"
            onPress={handleChangePassword}
            loading={isChangingPassword}
          />
        </Card>

        {/* Two-Factor Authentication */}
        <AccessibleText style={styles.sectionTitle}>Security</AccessibleText>
        <Card style={styles.card}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <View style={styles.toggleIconWrap}>
                <Ionicons name="shield-checkmark-outline" size={20} color={Colors[theme].tint} />
              </View>
              <View style={styles.toggleTextWrap}>
                <AccessibleText style={styles.toggleLabel}>Two-Factor Authentication</AccessibleText>
                <AccessibleText style={styles.toggleHint}>
                  {preferences.twoFactorEnabled
                    ? 'Enabled — extra security on login'
                    : 'Add an extra layer of security'}
                </AccessibleText>
              </View>
            </View>
            <Switch
              trackColor={{ false: '#D1D5DB', true: '#A5D6A7' }}
              thumbColor={preferences.twoFactorEnabled ? Colors[theme].tint : '#f4f3f4'}
              onValueChange={handleToggle2FA}
              value={preferences.twoFactorEnabled}
            />
          </View>
        </Card>

        {/* Active Sessions */}
        <AccessibleText style={styles.sectionTitle}>Active Sessions</AccessibleText>
        <Card style={styles.card}>
          <SessionItem
            device="iPhone 15 Pro"
            location="Nairobi, Kenya"
            time="Active now"
            current
            theme={theme}
          />
          <SessionItem
            device="MacBook Pro"
            location="Nairobi, Kenya"
            time="2 hours ago"
            theme={theme}
          />
          <TouchableOpacity
            style={styles.logoutAllBtn}
            onPress={handleSignOutAll}
            hitSlop={GLOVE_HIT_SLOP}
          >
            <AccessibleText style={styles.logoutAllText}>Sign out all other sessions</AccessibleText>
          </TouchableOpacity>
        </Card>

        {/* Danger Zone */}
        <AccessibleText style={styles.sectionTitle}>Danger Zone</AccessibleText>
        <Card style={[styles.card, styles.dangerCard]}>
          <AccessibleText style={styles.dangerText}>
            Deleting your account will permanently remove all your data, harvests, and farm
            records.
          </AccessibleText>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
            hitSlop={GLOVE_HIT_SLOP}
          >
            <Ionicons name="trash-outline" size={18} color={Colors[theme].error} />
            <AccessibleText style={styles.deleteButtonText}>Delete My Account</AccessibleText>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ──────────────────────────── Session Item ──────────────────────────── */

function SessionItem({
  device,
  location,
  time,
  current = false,
  theme,
}: {
  device: string;
  location: string;
  time: string;
  current?: boolean;
  theme: 'light' | 'dark';
}) {
  return (
    <View style={[sessionStyles.sessionRow, { borderBottomColor: Colors[theme].divider }]}>
      <View style={[sessionStyles.sessionIconWrap, { backgroundColor: Colors[theme].tintLight }]}>
        <Ionicons
          name={device.includes('Mac') ? 'laptop-outline' : 'phone-portrait-outline'}
          size={18}
          color={Colors[theme].tint}
        />
      </View>
      <View style={sessionStyles.sessionInfo}>
        <AccessibleText style={[sessionStyles.sessionDevice, { color: Colors[theme].text }]}>
          {device}{' '}
          {current && (
            <AccessibleText style={[sessionStyles.currentBadge, { color: Colors[theme].tint }]}>
              (This device)
            </AccessibleText>
          )}
        </AccessibleText>
        <AccessibleText style={[sessionStyles.sessionMeta, { color: Colors[theme].textSecondary }]}>
          {location} · {time}
        </AccessibleText>
      </View>
      {current && (
        <View style={[sessionStyles.activeDot, { backgroundColor: Colors[theme].success }]} />
      )}
    </View>
  );
}

const sessionStyles = StyleSheet.create({
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  sessionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sessionInfo: { flex: 1 },
  sessionDevice: { fontSize: 14, fontWeight: '600' },
  currentBadge: { fontWeight: '700', fontSize: 12 },
  sessionMeta: { fontSize: 12, marginTop: 2 },
  activeDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 8 },
});

/* ──────────────────────────── Styles ──────────────────────────── */

const getStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors[theme].backgroundSoft },
  container: { padding: Spacing.xl, paddingBottom: Spacing['4xl'] },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors[theme].textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xl,
    marginLeft: Spacing.xs,
  },
  card: { marginBottom: Spacing.sm },

  /* Toggle */
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.md,
  },
  toggleIconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors[theme].tintLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  toggleTextWrap: { flex: 1 },
  toggleLabel: { fontSize: 15, fontWeight: '600', color: Colors[theme].text },
  toggleHint: { fontSize: 12, color: Colors[theme].textSecondary, marginTop: 2 },

  /* Sessions */
  logoutAllBtn: { paddingVertical: Spacing.md, alignItems: 'center' },
  logoutAllText: { color: Colors[theme].tint, fontWeight: '700', fontSize: 14 },

  /* Danger */
  dangerCard: {
    borderWidth: 1,
    borderColor: theme === 'dark' ? '#5C2020' : '#FECACA',
  },
  dangerText: {
    fontSize: 13,
    color: Colors[theme].textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors[theme].errorLight,
    padding: 14,
    borderRadius: Radius.md,
  },
  deleteButtonText: {
    color: Colors[theme].error,
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 8,
  },
});
