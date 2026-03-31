import { AccessibleText } from '@/components/ui/AccessibleText';
import { CustomButton } from '@/components/ui/CustomButton';
import { CustomInput } from '@/components/ui/CustomInput';
import { StepProgressBar } from '@/components/ui/StepProgressBar';
import { Colors, GLOVE_HIT_SLOP, Radius, Spacing } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import { useHarvests } from '@/contexts/HarvestContext';
import { useTranslation } from '@/hooks/useTranslation';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
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
 * AddHarvestStep1Screen
 * Step 1 of the New Harvest flow — product identification.
 * Uses expo-image for fast cached photo display,
 * haptic feedback on toggle, and optimistic UI on submit.
 */
export default function AddHarvestStep1Screen() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [cropCategory, setCropCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [availableDate, setAvailableDate] = useState('');
  const [saveOffline, setSaveOffline] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();
  const { addHarvestOptimistic } = useHarvests();
  const { t } = useTranslation();

  const theme = useAppColorScheme();
  const styles = React.useMemo(() => getStyles(theme), [theme]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission required',
        'Camera permission is needed to upload a photo.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleToggleOffline = (value: boolean) => {
    setSaveOffline(value);
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
      setAvailableDate(selectedDate.toLocaleDateString());
    }
  };

  const handleNext = () => {
    // Optimistic UI: immediately add harvest to context
    if (cropCategory.trim()) {
      addHarvestOptimistic({
        cropName: cropCategory || 'New Harvest',
        yieldPercent: 0,
        estimatedValue: quantity ? `$${(parseFloat(quantity) * 1000).toLocaleString()}` : '$0',
        progress: 0,
        icon: 'leaf-outline',
      });
    }
    router.push('/(tabs)/location');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <AccessibleText style={styles.header}>{t('New Harvest')}</AccessibleText>
        <AccessibleText style={styles.stepText}>{t('Product Identification')}</AccessibleText>

        {/* Step progress bar */}
        <StepProgressBar currentStep={1} totalSteps={2} style={styles.progressBar} />

        {/* Photo upload area */}
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={pickImage}
          activeOpacity={0.7}
          hitSlop={GLOVE_HIT_SLOP}
        >
          {photo ? (
            <Image
              source={{ uri: photo }}
              style={styles.image}
              cachePolicy="memory-disk"
              contentFit="cover"
              transition={300}
            />
          ) : (
            <>
              <View style={styles.uploadIconCircle}>
                <Ionicons name="camera-outline" size={32} color={Colors[theme].tint} />
              </View>
              <AccessibleText style={styles.uploadTitle}>{t('Upload Harvest Photo')}</AccessibleText>
              <AccessibleText style={styles.uploadHint}>{t('Tap to open camera')}</AccessibleText>
            </>
          )}
        </TouchableOpacity>

        {/* Input fields */}
        <CustomInput
          label={t('Select Crop Category')}
          placeholder="e.g., Leafy Greens"
          value={cropCategory}
          onChangeText={setCropCategory}
        />
        <CustomInput
          label={t('Quantity Estimated (Tonnes)')}
          placeholder="e.g., 5.5"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />
        <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
          <View pointerEvents="none">
            <CustomInput
              label={t('Availability Date')}
              placeholder={t('Select Date')}
              value={availableDate}
              onChangeText={() => {}}
            />
          </View>
        </TouchableOpacity>

        {showDatePicker && (
          <View style={Platform.OS === 'ios' ? { backgroundColor: Colors[theme].card, padding: 10, borderRadius: Radius.md, marginBottom: Spacing.md } : undefined}>
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
            {Platform.OS === 'ios' && (
              <CustomButton title="Done" onPress={() => setShowDatePicker(false)} style={{ marginTop: 10 }} />
            )}
          </View>
        )}

        {/* Save Offline toggle */}
        <View style={styles.toggleContainer}>
          <View style={styles.toggleInfo}>
            <View style={styles.toggleIconWrap}>
              <Ionicons name="cloud-offline-outline" size={18} color={Colors[theme].tint} />
            </View>
            <View>
              <AccessibleText style={styles.toggleLabel}>{t('Save Offline')}</AccessibleText>
              <AccessibleText style={styles.toggleHint}>{t('Store data locally if no network')}</AccessibleText>
            </View>
          </View>
          <Switch
            trackColor={{ false: '#D1D5DB', true: '#A5D6A7' }}
            thumbColor={saveOffline ? Colors[theme].tint : '#f4f3f4'}
            onValueChange={handleToggleOffline}
            value={saveOffline}
          />
        </View>

        {/* Next button */}
        <CustomButton
          title={t('Next: Location Details →')}
          onPress={handleNext}
          style={styles.nextButton}
        />

        {/* Bottom spacing for floating tab bar */}
        <View style={{ height: 80 }} />
      </ScrollView>
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
    padding: Spacing['2xl'],
    flexGrow: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors[theme].text,
    marginBottom: Spacing.xs,
    letterSpacing: -0.3,
  },
  stepText: {
    fontSize: 14,
    color: Colors[theme].textSecondary,
    marginBottom: Spacing.lg,
    fontWeight: '500',
  },
  progressBar: {
    marginBottom: Spacing['2xl'],
  },

  /* Upload box */
  uploadBox: {
    height: 200,
    borderWidth: 2,
    borderColor: Colors[theme].tintMuted,
    borderStyle: 'dashed',
    borderRadius: Radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
    backgroundColor: Colors[theme].tintLight,
    overflow: 'hidden',
  },
  uploadIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors[theme].tintLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: Colors[theme].tintMuted,
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors[theme].text,
  },
  uploadHint: {
    fontSize: 12,
    color: Colors[theme].textSecondary,
    marginTop: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },

  /* Toggle */
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors[theme].card,
    borderRadius: Radius.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors[theme].cardBorder,
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
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors[theme].text,
  },
  toggleHint: {
    fontSize: 12,
    color: Colors[theme].textSecondary,
    marginTop: 2,
  },

  /* Button */
  nextButton: {
    marginTop: Spacing.lg,
  },
});
