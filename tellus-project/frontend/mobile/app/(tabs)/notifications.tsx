import { AccessibleText } from '@/components/ui/AccessibleText';
import { Card } from '@/components/ui/Card';
import { CustomButton } from '@/components/ui/CustomButton';
import { NotificationCard } from '@/components/ui/NotificationCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SkeletonNotificationCard } from '@/components/ui/SkeletonNotificationCard';
import { Colors, GLOVE_HIT_SLOP, Radius, Shadows, Spacing } from '@/constants/theme';
import { useAppColorScheme } from '@/hooks/use-color-scheme';
import { useTranslation } from '@/hooks/useTranslation';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

/* ──────────────────────────── Mock Data ──────────────────────────── */

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'order',
    icon: 'basket-outline',
    title: 'Organic Maize Order',
    description: 'New order from GreenLeaf Organics — 12 tonnes',
    time: '20 min',
    unread: true,
  },
  {
    id: '2',
    type: 'inquiry',
    icon: 'chatbubble-outline',
    title: 'Buyer Inquiry',
    description: 'Message from John D. regarding Highland Kale pricing',
    time: '1h ago',
    unread: true,
  },
  {
    id: '3',
    type: 'sync_pending',
    icon: 'cloud-upload-outline',
    title: 'Pending Sync: Lot #821',
    description: 'Will upload automatically when you are back online',
    time: '3h ago',
  },
  {
    id: '4',
    type: 'sync_error',
    icon: 'alert-circle',
    title: 'Sync Interrupted',
    description: 'Connection lost — please check your network',
    time: '5h ago',
    iconColor: '#EF4444',
  },
];

/* ──────────────────────────── Component ──────────────────────────── */

export default function NotificationsScreen() {
  const colorScheme = useAppColorScheme();
  const styles = React.useMemo(() => getStyles(colorScheme), [colorScheme]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    // Simulate initial data fetch
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const renderItem = ({ item }: { item: (typeof MOCK_NOTIFICATIONS)[0] }) => (
    <NotificationCard
      icon={item.icon}
      title={item.title}
      description={item.description}
      time={item.time}
      iconColor={item.iconColor}
      unread={item.unread}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Title */}
        <AccessibleText style={styles.screenTitle}>{t('Notifications')}</AccessibleText>

        {/* ── Sync Manager ──────────────────────────────── */}
        <Card elevated style={styles.syncCard}>
          <View style={styles.syncHeader}>
            <View style={styles.syncLeft}>
              <View style={styles.syncIconWrap}>
                <Ionicons name="cloud-outline" size={18} color={Colors[colorScheme].tint} />
              </View>
              <AccessibleText style={styles.syncTitle}>{t('Offline Resilience')}</AccessibleText>
            </View>
            <View style={styles.syncStatusBadge}>
              <View style={styles.syncDot} />
              <AccessibleText style={styles.syncStatusText}>{t('Active')}</AccessibleText>
            </View>
          </View>
          <AccessibleText style={styles.syncProgress}>Uploading Harvest Data... 68%</AccessibleText>
          <ProgressBar
            progress={0.68}
            color={Colors[colorScheme].tint}
            style={styles.progressBar}
          />
          <CustomButton
            title={t('Sync Now')}
            onPress={() => {}}
            style={styles.syncButton}
          />
        </Card>

        {/* ── Active Feed header ────────────────────────── */}
        <View style={styles.feedHeader}>
          <AccessibleText style={styles.feedTitle}>{t('Active Feed')}</AccessibleText>
          <TouchableOpacity hitSlop={GLOVE_HIT_SLOP}>
            <AccessibleText style={styles.markAll}>{t('Mark all as read')}</AccessibleText>
          </TouchableOpacity>
        </View>

        {/* ── Notification list ─────────────────────────── */}
        {isLoading ? (
          <View style={styles.skeletonContainer}>
            <SkeletonNotificationCard />
            <SkeletonNotificationCard />
            <SkeletonNotificationCard />
            <SkeletonNotificationCard />
          </View>
        ) : (
          <FlashList
            data={MOCK_NOTIFICATIONS}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
            ListFooterComponent={
              /* ── Market Watch card ────────────────────── */
              <View style={[styles.marketCard, Shadows.md]}>
                <View style={styles.marketIconWrap}>
                  <MaterialCommunityIcons name="finance" size={22} color="#fff" />
                </View>
                <View style={styles.marketText}>
                  <AccessibleText style={styles.marketTitle}>{t('Market Watch')}</AccessibleText>
                  <AccessibleText style={styles.marketDesc}>
                    Soybean prices rose by 3% this morning. Maize futures remain
                    stable at $182/tonne.
                  </AccessibleText>
                </View>
              </View>
            }
          />
        )}
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
    paddingHorizontal: Spacing.xl,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors[theme].text,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    letterSpacing: -0.3,
  },

  /* Sync manager */
  syncCard: {
    marginBottom: Spacing.xl,
  },
  syncHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  syncLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncIconWrap: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    backgroundColor: Colors[theme].tintLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  syncTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors[theme].text,
  },
  syncStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors[theme].tintLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  syncDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 5,
  },
  syncStatusText: {
    fontSize: 12,
    color: Colors[theme].tint,
    fontWeight: '600',
  },
  syncProgress: {
    fontSize: 13,
    color: Colors[theme].textSecondary,
    marginBottom: Spacing.sm,
    fontWeight: '500',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: Spacing.lg,
  },
  syncButton: {
    paddingVertical: 12,
  },

  /* Feed */
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  feedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors[theme].text,
  },
  markAll: {
    color: Colors[theme].tint,
    fontWeight: '600',
    fontSize: 13,
  },

  /* Skeleton container */
  skeletonContainer: {
    flex: 1,
    paddingBottom: 120,
  },

  /* Market Watch */
  marketCard: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
    backgroundColor: Colors[theme].darkSurface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  marketIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
  },
  marketText: {
    flex: 1,
  },
  marketTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  marketDesc: {
    color: '#C8E6C9',
    fontSize: 13,
    lineHeight: 18,
  },
});