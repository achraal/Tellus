import { AccessibleText } from '@/components/ui/AccessibleText';
import { CustomButton } from '@/components/ui/CustomButton';
import { CustomInput } from '@/components/ui/CustomInput';
import { Colors, GLOVE_HIT_SLOP, Radius, Spacing } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import { useUser } from '@/contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * ProfileScreen
 * View and edit personal information.
 * Data is persisted to AsyncStorage via UserContext.
 * Photo is picked from camera/library via expo-image-picker and cached via expo-image.
 */
export default function ProfileScreen() {
  const { profile, updateProfile } = useUser();
  const theme = useAppColorScheme();
  const styles = React.useMemo(() => getStyles(theme), [theme]);

  /* ── Local editing state (allows cancel without saving) ── */
  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [farmName, setFarmName] = useState(profile.farmName);
  const [avatarUri, setAvatarUri] = useState(profile.avatarUri);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  /* Sync local state if context reloads */
  useEffect(() => {
    setFullName(profile.fullName);
    setEmail(profile.email);
    setPhone(profile.phone);
    setFarmName(profile.farmName);
    setAvatarUri(profile.avatarUri);
  }, [profile]);

  /* ── Validation ── */
  const validate = (): boolean => {
    if (!fullName.trim()) {
      Alert.alert('Validation Error', 'Full name is required.');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return false;
    }
    if (!phone.trim()) {
      Alert.alert('Validation Error', 'Phone number is required.');
      return false;
    }
    return true;
  };

  /* ── Save handler ── */
  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);
    try {
      await updateProfile({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        farmName: farmName.trim(),
        avatarUri,
      });
      setIsEditing(false);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      Alert.alert('Profile Updated', 'Your profile has been saved successfully.');
    } catch {
      Alert.alert('Error', 'Something went wrong while saving your profile.');
    } finally {
      setIsSaving(false);
    }
  };

  /* ── Cancel — revert to context values ── */
  const handleCancel = () => {
    setFullName(profile.fullName);
    setEmail(profile.email);
    setPhone(profile.phone);
    setFarmName(profile.farmName);
    setAvatarUri(profile.avatarUri);
    setIsEditing(false);
  };

  /* ── Photo picker — camera or gallery ── */
  const handleChangePhoto = () => {
    Alert.alert('Change Photo', 'Choose a source', [
      {
        text: 'Camera',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission required', 'Camera access is needed to take a photo.');
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });
          if (!result.canceled) {
            const uri = result.assets[0].uri;
            setAvatarUri(uri);
            // Persist immediately (even outside edit mode)
            await updateProfile({ avatarUri: uri });
          }
        },
      },
      {
        text: 'Photo Library',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission required', 'Gallery access is needed to select a photo.');
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
          });
          if (!result.canceled) {
            const uri = result.assets[0].uri;
            setAvatarUri(uri);
            await updateProfile({ avatarUri: uri });
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  /* ── Remove photo ── */
  const handleRemovePhoto = () => {
    if (!avatarUri) return;
    Alert.alert('Remove Photo', 'Are you sure you want to remove your profile photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          setAvatarUri(null);
          await updateProfile({ avatarUri: null });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarRing}>
            {avatarUri ? (
              <Image
                source={{ uri: avatarUri }}
                style={styles.avatarImage}
                cachePolicy="memory-disk"
                contentFit="cover"
                transition={200}
              />
            ) : (
              <View style={styles.avatar}>
                <Ionicons name="person" size={36} color="#fff" />
              </View>
            )}
          </View>

          <View style={styles.photoActions}>
            <TouchableOpacity
              style={styles.changePhotoBtn}
              onPress={handleChangePhoto}
              hitSlop={GLOVE_HIT_SLOP}
            >
              <Ionicons name="camera-outline" size={16} color={Colors[theme].tint} />
              <AccessibleText style={styles.changePhotoText}>Change Photo</AccessibleText>
            </TouchableOpacity>

            {avatarUri && (
              <TouchableOpacity
                style={styles.removePhotoBtn}
                onPress={handleRemovePhoto}
                hitSlop={GLOVE_HIT_SLOP}
              >
                <Ionicons name="trash-outline" size={14} color={Colors[theme].error} />
                <AccessibleText style={styles.removePhotoText}>Remove</AccessibleText>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Form fields */}
        <CustomInput
          label="Full Name"
          placeholder="Enter your name"
          value={fullName}
          onChangeText={setFullName}
          editable={isEditing}
        />
        <CustomInput
          label="Email Address"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={isEditing}
        />
        <CustomInput
          label="Phone Number"
          placeholder="Enter your phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          editable={isEditing}
        />
        <CustomInput
          label="Farm Name"
          placeholder="Enter your farm name"
          value={farmName}
          onChangeText={setFarmName}
          editable={isEditing}
        />

        {/* Member since (read-only info) */}
        <View style={styles.infoRow}>
          <AccessibleText style={styles.infoLabel}>Member Since</AccessibleText>
          <AccessibleText style={styles.infoValue}>{profile.memberSince}</AccessibleText>
        </View>

        {/* Action buttons */}
        {isEditing ? (
          <>
            <CustomButton
              title="Save Changes"
              onPress={handleSave}
              loading={isSaving}
              style={styles.actionBtn}
            />
            <CustomButton
              title="Cancel"
              onPress={handleCancel}
              variant="secondary"
              style={styles.cancelBtn}
            />
          </>
        ) : (
          <CustomButton
            title="Edit Profile"
            onPress={() => setIsEditing(true)}
            style={styles.actionBtn}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ──────────────────────────── Styles ──────────────────────────── */

const getStyles = (theme: 'light' | 'dark') => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors[theme].backgroundSoft },
  container: { padding: Spacing['2xl'], paddingBottom: Spacing['4xl'] },

  /* Avatar */
  avatarSection: { alignItems: 'center', marginBottom: Spacing['3xl'] },
  avatarRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors[theme].tintMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors[theme].tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  photoActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors[theme].tintLight,
    borderWidth: 1,
    borderColor: Colors[theme].tintMuted,
  },
  changePhotoText: {
    color: Colors[theme].tint,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  removePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors[theme].errorLight,
    borderWidth: 1,
    borderColor: theme === 'dark' ? '#5C2020' : '#FECACA',
  },
  removePhotoText: {
    color: Colors[theme].error,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },

  /* Info row */
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors[theme].divider,
    marginBottom: Spacing['2xl'],
  },
  infoLabel: { fontSize: 14, color: Colors[theme].textSecondary, fontWeight: '500' },
  infoValue: { fontSize: 14, fontWeight: '700', color: Colors[theme].text },

  /* Buttons */
  actionBtn: { marginTop: Spacing.sm },
  cancelBtn: { marginTop: Spacing.md },
});
