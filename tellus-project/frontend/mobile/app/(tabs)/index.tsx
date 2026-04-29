import { AccessibleText } from '@/components/ui/AccessibleText';
import { AnalyticsCard } from '@/components/ui/AnalyticsCard';
import { HarvestCard } from '@/components/ui/HarvestCard';
import { NotificationCard } from '@/components/ui/NotificationCard';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { SkeletonNotificationCard } from '@/components/ui/SkeletonNotificationCard';
import { Colors, GLOVE_HIT_SLOP, Radius, Shadows, Spacing } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import { useHarvests } from '@/contexts/HarvestContext';
import { useUser } from '@/contexts/UserContext';
import { useTranslation } from '@/hooks/useTranslation';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  LayoutAnimation,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  UIManager,
  View,
} from 'react-native';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/* ──────────────────────────── Mock Data ──────────────────────────── */

const BUYER_ACTIVITY = [
  {
    id: '1',
    icon: 'pricetag-outline',
    title: 'New Bid Received',
    description: 'GreenLeaf Organics bid $5,200 for Highland Kale',
    time: '2h ago',
    unread: true,
  },
  {
    id: '2',
    icon: 'eye-outline',
    title: 'Profile Viewed',
    description: 'FreshMart Supply viewed your farm profile',
    time: '5h ago',
  },
  {
    id: '3',
    icon: 'checkmark-circle-outline',
    title: 'Audit Completed',
    description: 'Farm certification audit passed successfully',
    time: '1d ago',
  },
];

/* ──────────────────────────── Component ──────────────────────────── */

export default function DashboardScreen() {
  const router = useRouter();
  const colorScheme = useAppColorScheme();
  const styles = React.useMemo(() => getStyles(colorScheme), [colorScheme]);
  const { harvests, isLoading, setLoaded } = useHarvests();
  const { profile } = useUser();
  const { t } = useTranslation();
  const prevHarvestCount = useRef(harvests.length);

  const [isSyncing, setIsSyncing] = React.useState(false);
  const [lastSync, setLastSync] = React.useState(new Date());

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setLastSync(new Date());
      setIsSyncing(false);
    }, 1000);
  };

  const firstName = profile.fullName.split(' ')[0];
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('Good Morning');
    if (hour < 17) return t('Good Afternoon');
    return t('Good Evening');
  };

  /* Stagger fade-in */
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Simulate initial data fetch
    const timer = setTimeout(() => {
      setLoaded();
    }, 1200);
    return () => clearTimeout(timer);
  }, [fadeAnim, slideAnim, setLoaded]);

  // Smooth LayoutAnimation when harvests list changes
  useEffect(() => {
    if (harvests.length !== prevHarvestCount.current) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      prevHarvestCount.current = harvests.length;
    }
  }, [harvests.length]);

  /* ── Calculate totals from current harvests ── */
  const totalValue = harvests.reduce((sum, h) => {
    const num = parseFloat(h.estimatedValue.replace(/[^0-9.]/g, ''));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  /* ── Role-based tailored UI ── */
  const isFarmer = profile.role === 'Agriculteur';
  const isBuyer = profile.role === 'Acheteur';
  const isAdmin = profile.role === 'Admin';

  const heroSubtext = isFarmer
    ? `${harvests.length} ${t('active harvests')} · $${totalValue.toLocaleString()} ${t('est. value')}`
    : isBuyer
    ? 'Looking for fresh produce? · Marketplace is active'
    : 'System healthy · Managing active network';

  const ctaTitle = isFarmer ? t('Add New Harvest') : isBuyer ? t('Browse Marketplace') : t('Manage Users');
  const ctaIcon = isFarmer ? 'add' : isBuyer ? 'cart-outline' : 'people-outline';

  const section1Title = isFarmer ? t('Active Harvests') : isBuyer ? t('Marketplace Deals') : t('System Overview');
  const section2Title = isFarmer ? t('Buyer Activity') : isBuyer ? t('Your Recent Bids') : t('Audit Logs');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* ── Hero Header Card ─────────────────────────── */}
          <View style={[styles.heroCard, Shadows.md]}>
            <View style={styles.heroContent}>
              <AccessibleText style={styles.greeting}>{getGreeting()},</AccessibleText>
              <AccessibleText style={styles.userName}>{firstName}.</AccessibleText>
              <AccessibleText style={styles.heroSubtext}>
                {heroSubtext}
              </AccessibleText>
            </View>
            <View style={styles.heroRight}>
              {/* Small logo in hero card */}
              <Image
                source={require('@/assets/images/tellus-logo.png')}
                style={styles.heroLogo}
                contentFit="contain"
              />
              <Pressable
                style={({ pressed }) => [styles.syncBadge, pressed && { opacity: 0.7 }]}
                onPress={handleSync}
                hitSlop={GLOVE_HIT_SLOP}
              >
                <View style={[styles.syncDot, isSyncing && { backgroundColor: Colors[colorScheme].warning }]} />
                <AccessibleText style={styles.syncText}>
                  {isSyncing ? t('Syncing...') : `${t('Synced')} ${lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                </AccessibleText>
              </Pressable>
            </View>
          </View>

          {/* ── Role-specific CTA ──────────────────────────── */}
          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              (isBuyer || isAdmin) && { backgroundColor: Colors[colorScheme].textSecondary, shadowColor: Colors[colorScheme].textSecondary },
              Shadows.green,
              pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
            ]}
            onPress={() => {
              if (isFarmer) {
                router.push('/(tabs)/add-harvest');
              }
            }}
            hitSlop={GLOVE_HIT_SLOP}
          >
            <Ionicons name={ctaIcon as any} size={20} color="#fff" />
            <AccessibleText style={styles.addButtonText}>{ctaTitle}</AccessibleText>
          </Pressable>

          {/* ── Section 1 : Dashboard Primary View ──────────────── */}
          <View style={styles.sectionHeader}>
            <AccessibleText style={styles.sectionTitle}>{section1Title}</AccessibleText>
            {isFarmer && <AccessibleText style={styles.sectionCount}>{harvests.length}</AccessibleText>}
          </View>

          {isLoading ? (
            /* Skeleton loaders while loading */
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <View style={styles.flashListContainer}>
              <FlashList
                data={harvests}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <View>
                    {item.pending && (
                      <View style={styles.pendingBadge}>
                        <Ionicons name="time-outline" size={12} color={Colors[colorScheme].warning} />
                        <AccessibleText style={styles.pendingText}>{t('Pending…')}</AccessibleText>
                      </View>
                    )}
                    <HarvestCard
                      cropName={item.cropName}
                      yieldPercent={item.yieldPercent}
                      estimatedValue={item.estimatedValue}
                      progress={item.progress}
                      icon={item.icon}
                    />
                  </View>
                )}
              />
            </View>
          )}

          {/* ── Section 2 : Secondary Activity ────────────────── */}
          <View style={styles.sectionHeader}>
            <AccessibleText style={styles.sectionTitle}>{section2Title}</AccessibleText>
            <Pressable hitSlop={GLOVE_HIT_SLOP}>
              <AccessibleText style={styles.seeAll}>{t('See All')}</AccessibleText>
            </Pressable>
          </View>

          <View style={styles.flashListContainer}>
            <FlashList
              data={BUYER_ACTIVITY}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <NotificationCard
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                  time={item.time}
                  unread={item.unread}
                />
              )}
            />
          </View>

          {/* ── Section 3 : Analytics ─────────────────────── */}
          <View style={styles.sectionHeader}>
            <AccessibleText style={styles.sectionTitle}>{t('Analytics')}</AccessibleText>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.analyticsRow}
            snapToInterval={182}
            decelerationRate="fast"
          >
            <AnalyticsCard
              label={t('Market Position')}
              value="+12.4%"
              icon="trending-up-outline"
              dark
            />
            <AnalyticsCard
              label={t('Soil Moisture')}
              value="42%"
              icon="water-outline"
            />
            <AnalyticsCard
              label={t('Solar Exposure')}
              value="8.2 hrs"
              icon="sunny-outline"
            />
          </ScrollView>
        </Animated.View>

        {/* Bottom spacing for floating tab bar */}
        <View style={styles.bottomSpacer} />
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
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing['4xl'],
  },
  /* Hero */
  heroCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: Colors[theme].darkSurface,
    borderRadius: Radius.xl,
    padding: Spacing['2xl'],
    marginBottom: Spacing['2xl'],
  },
  heroContent: {
    flex: 1,
  },
  heroRight: {
    alignItems: 'flex-end',
    gap: 10,
  },
  heroLogo: {
    width: 40,
    height: 20,
    opacity: 0.8,
  },
  greeting: {
    fontSize: 15,
    color: Colors[theme].tintMuted,
    fontWeight: '500',
  },
  userName: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
    marginBottom: Spacing.xs,
  },
  heroSubtext: {
    fontSize: 13,
    color: Colors[theme].tintMuted,
    fontWeight: '500',
    marginTop: Spacing.xs,
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  syncDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  syncText: {
    fontSize: 12,
    color: '#81C784',
    fontWeight: '600',
  },

  /* Add button */
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors[theme].tint,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: Radius.full,
    marginBottom: Spacing['3xl'],
  },
  addButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
    letterSpacing: 0.2,
  },

  /* Section headers */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors[theme].text,
    letterSpacing: 0.1,
  },
  sectionCount: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors[theme].tint,
    backgroundColor: Colors[theme].tintLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors[theme].tint,
  },

  /* FlashList container — FlashList needs a defined height or flex */
  flashListContainer: {
    minHeight: 2,
  },

  /* Pending badge */
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: `${Colors[theme].warning}20`,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
    marginBottom: 4,
    gap: 4,
  },
  pendingText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors[theme].warning,
  },

  /* Analytics horizontal scroll */
  analyticsRow: {
    paddingRight: Spacing.xl,
    paddingBottom: Spacing.sm,
  },

  /* Bottom spacer (replaces hardcoded inline height) */
  bottomSpacer: {
    height: 100,
  },
});