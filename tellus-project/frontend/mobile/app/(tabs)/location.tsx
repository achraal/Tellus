import { AccessibleText } from '@/components/ui/AccessibleText';
import { Card } from '@/components/ui/Card';
import { CustomButton } from '@/components/ui/CustomButton';
import { StepProgressBar } from '@/components/ui/StepProgressBar';
import { Colors, GLOVE_HIT_SLOP, Radius, Shadows, Spacing } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import { useTranslation } from '@/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MapWrapper, MapMarker } from '@/components/ui/MapWrapper';
import { useUser } from '@/contexts/UserContext';

/**
 * AddHarvestStep2Screen
 * Step 2 — farm geolocation with map, signal status, and coordinates.
 */
export default function AddHarvestStep2Screen() {
  const router = useRouter();
  const colorScheme = useAppColorScheme();
  const styles = React.useMemo(() => getStyles(colorScheme), [colorScheme]);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const { t } = useTranslation();
  const { profile } = useUser();

  const initialRegion = profile.farmLocation
    ? {
        latitude: profile.farmLocation.latitude,
        longitude: profile.farmLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerArea}>
          <AccessibleText style={styles.header}>{t('Confirm Farm Location')}</AccessibleText>
          <StepProgressBar currentStep={2} totalSteps={2} />
        </View>

        {/* Map */}
        <View style={[styles.mapContainer, Shadows.md]}>
          <MapWrapper
            style={styles.map}
            initialRegion={initialRegion}
            mapType={mapType === 'satellite' ? 'satellite' : 'standard'}
          >
            <MapMarker
              coordinate={initialRegion}
              title="FARM CENTER"
              pinColor={Colors[colorScheme].tint}
            />
          </MapWrapper>

          {/* Map type toggle overlay */}
          <View style={[styles.mapToggle, Shadows.md]}>
            <TouchableOpacity
              style={[styles.toggleBtn, mapType === 'standard' && styles.activeToggle]}
              onPress={() => setMapType('standard')}
              hitSlop={GLOVE_HIT_SLOP}
            >
              <AccessibleText
                style={[
                  styles.toggleText,
                  mapType === 'standard' && styles.activeToggleText,
                ]}
              >
                Terrain
              </AccessibleText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, mapType === 'satellite' && styles.activeToggle]}
              onPress={() => setMapType('satellite')}
              hitSlop={GLOVE_HIT_SLOP}
            >
              <AccessibleText
                style={[
                  styles.toggleText,
                  mapType === 'satellite' && styles.activeToggleText,
                ]}
              >
                Satellite
              </AccessibleText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info card */}
        <Card elevated style={styles.infoCard}>
          {/* Signal status */}
          <View style={styles.signalRow}>
            <View style={styles.signalLeft}>
              <AccessibleText style={styles.signalTitle}>{t('Signal Status')}</AccessibleText>
            </View>
            <View style={styles.signalValue}>
              <View style={styles.signalDot} />
              <AccessibleText style={styles.signalPercent}>98.4%</AccessibleText>
              <AccessibleText style={styles.signalLabel}>{t('GPS Accuracy')}</AccessibleText>
            </View>
          </View>

          {/* Coordinates */}
          <View style={styles.coordContainer}>
            <View style={styles.coordItem}>
              <AccessibleText style={styles.coordLabel}>{t('Latitude')}</AccessibleText>
              <AccessibleText style={styles.coordValue}>{initialRegion.latitude.toFixed(5)}</AccessibleText>
            </View>
            <View style={styles.coordDivider} />
            <View style={styles.coordItem}>
              <AccessibleText style={styles.coordLabel}>{t('Longitude')}</AccessibleText>
              <AccessibleText style={styles.coordValue}>{initialRegion.longitude.toFixed(5)}</AccessibleText>
            </View>
          </View>

          {/* Region */}
          <View style={styles.regionRow}>
            <Ionicons name="location-outline" size={16} color={Colors[colorScheme].textSecondary} />
            <AccessibleText style={styles.regionText}>
              {profile.farmLocation ? 'Active Farm Location' : 'San Francisco, California'}
            </AccessibleText>
          </View>
        </Card>

        {/* Confirm button */}
        <CustomButton
          title={t('Confirm Farm Boundary →')}
          onPress={() => router.push('/')}
          style={styles.confirmButton}
        />
      </View>
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
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  headerArea: {
    paddingHorizontal: Spacing['2xl'],
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  header: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors[theme].text,
    marginBottom: Spacing.sm,
    letterSpacing: -0.3,
  },

  /* Map */
  mapContainer: {
    flex: 1,
    marginHorizontal: Spacing.xl,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors[theme].cardBorder,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapToggle: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    backgroundColor: Colors[theme].background,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  toggleBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  activeToggle: {
    backgroundColor: Colors[theme].tint,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors[theme].text,
  },
  activeToggleText: {
    color: '#fff',
  },

  /* Info card */
  infoCard: {
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
  },
  signalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  signalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors[theme].text,
  },
  signalValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  signalPercent: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors[theme].tint,
    marginRight: 6,
  },
  signalLabel: {
    fontSize: 12,
    color: Colors[theme].textSecondary,
  },
  coordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors[theme].divider,
    paddingTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  coordItem: {
    flex: 1,
    alignItems: 'center',
  },
  coordDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors[theme].divider,
  },
  coordLabel: {
    color: Colors[theme].textSecondary,
    fontSize: 13,
    marginBottom: 4,
    fontWeight: '500',
  },
  coordValue: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors[theme].text,
    letterSpacing: 0.2,
  },
  regionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs,
  },
  regionText: {
    fontSize: 13,
    color: Colors[theme].textSecondary,
    marginLeft: 6,
    fontWeight: '500',
  },

  /* Button */
  confirmButton: {
    marginHorizontal: Spacing.xl,
    marginVertical: Spacing.lg,
    width: 'auto',
  },
});