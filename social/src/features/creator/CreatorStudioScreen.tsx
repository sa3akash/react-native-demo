import React, { useState, memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Card, Button, SegmentedControl, Input } from '../../shared/components';
import { useCreatorStore } from '../../store/useCreatorStore';
import { useToast } from '../../shared/components/molecules/Toast';
import { RequestPayoutModal } from './RequestPayoutModal';

const STUDIO_TABS = [
  { id: 'revenue', label: 'Revenue 💰' },
  { id: 'analytics', label: 'Analytics 📊' },
  { id: 'audience', label: 'Audience 👥' },
  { id: 'monetization', label: 'Monetization ⚡' },
];

export const CreatorStudioScreenComponent: React.FC = () => {
  const { colors, theme } = useTheme();
  const revenue = useCreatorStore((state) => state.revenue);
  const contentAnalytics = useCreatorStore((state) => state.contentAnalytics);
  const audience = useCreatorStore((state) => state.audience);
  const monetization = useCreatorStore((state) => state.monetization);
  const updateMonetization = useCreatorStore((state) => state.updateMonetizationSettings);
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('revenue');
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const isRTL = I18nManager.isRTL;

  const formatCurrency = (val: number) => `$${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  const formatNumber = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return val.toString();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}>
        <View style={styles.headerTitleRow}>
          <Typography variant="h2" color={colors.text} bold>
            Creator Studio
          </Typography>
          <View style={[styles.creatorBadge, { backgroundColor: colors.primaryLight }]}>
            <Typography variant="caption" color={colors.primary} bold style={{ fontSize: 10 }}>
              ⭐ PRO CREATOR
            </Typography>
          </View>
        </View>

        {/* Tab Switcher */}
        <View style={{ marginTop: 8 }}>
          <SegmentedControl
            segments={STUDIO_TABS}
            activeId={activeTab}
            onSelect={setActiveTab}
            size="sm"
          />
        </View>
      </View>

      {/* Main Content Area */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* TAB 1: REVENUE & PAYOUTS */}
        {activeTab === 'revenue' && (
          <View style={styles.tabSection}>
            {/* Monthly Highlight Card */}
            <Card variant="elevated" style={[styles.revHighlightCard, { backgroundColor: colors.surface }]}>
              <Typography variant="caption" color={colors.textSecondary} bold>
                ESTIMATED EARNINGS (THIS MONTH)
              </Typography>
              <Typography variant="h1" color={colors.primary} bold style={{ marginVertical: 6, fontSize: 32 }}>
                {formatCurrency(revenue.thisMonthEarnings)}
              </Typography>
              <Typography variant="body2" color={colors.success} bold>
                ▲ +{revenue.growthPercent}% vs last period
              </Typography>

              <View style={[styles.balanceBar, { backgroundColor: colors.surfaceElevated, borderRadius: theme.radius.md }]}>
                <View>
                  <Typography variant="caption" color={colors.textSecondary}>
                    Available for Payout
                  </Typography>
                  <Typography variant="subtitle1" color={colors.text} bold>
                    {formatCurrency(revenue.availableBalance)}
                  </Typography>
                </View>
                <Button
                  label="Request Payout 💸"
                  variant="primary"
                  size="sm"
                  onPress={() => setIsPayoutModalOpen(true)}
                />
              </View>
            </Card>

            {/* 4 Revenue Streams Grid */}
            <Typography variant="subtitle1" color={colors.text} bold style={{ marginTop: 8 }}>
              Revenue Streams Breakdown
            </Typography>
            <View style={styles.streamGrid}>
              <Card variant="elevated" style={[styles.streamCard, { backgroundColor: colors.surface }]}>
                <Typography variant="caption" color={colors.textSecondary} bold>
                  ⭐ SUBSCRIPTIONS
                </Typography>
                <Typography variant="h3" color={colors.text} bold style={{ marginVertical: 4 }}>
                  {formatCurrency(revenue.breakdown.subscriptions)}
                </Typography>
                <Typography variant="caption" color={colors.textMuted}>
                  Monthly recurring
                </Typography>
              </Card>

              <Card variant="elevated" style={[styles.streamCard, { backgroundColor: colors.surface }]}>
                <Typography variant="caption" color={colors.textSecondary} bold>
                  🎁 LIVE GIFTS & TIPS
                </Typography>
                <Typography variant="h3" color={colors.text} bold style={{ marginVertical: 4 }}>
                  {formatCurrency(revenue.breakdown.virtualGifts)}
                </Typography>
                <Typography variant="caption" color={colors.textMuted}>
                  Stream viewers
                </Typography>
              </Card>

              <Card variant="elevated" style={[styles.streamCard, { backgroundColor: colors.surface }]}>
                <Typography variant="caption" color={colors.textSecondary} bold>
                  🎥 IN-STREAM ADS
                </Typography>
                <Typography variant="h3" color={colors.text} bold style={{ marginVertical: 4 }}>
                  {formatCurrency(revenue.breakdown.inStreamAds)}
                </Typography>
                <Typography variant="caption" color={colors.textMuted}>
                  Video monetization
                </Typography>
              </Card>

              <Card variant="elevated" style={[styles.streamCard, { backgroundColor: colors.surface }]}>
                <Typography variant="caption" color={colors.textSecondary} bold>
                  🏷️ BRAND DEALS
                </Typography>
                <Typography variant="h3" color={colors.text} bold style={{ marginVertical: 4 }}>
                  {formatCurrency(revenue.breakdown.brandSponsorships)}
                </Typography>
                <Typography variant="caption" color={colors.textMuted}>
                  Sponsorships
                </Typography>
              </Card>
            </View>

            {/* Payout History */}
            <Typography variant="subtitle1" color={colors.text} bold style={{ marginTop: 8 }}>
              Payout History Ledger
            </Typography>
            <View style={[styles.historyContainer, { backgroundColor: colors.surface, borderRadius: theme.radius.lg }]}>
              {revenue.payoutHistory.map((tx) => (
                <View key={tx.id} style={[styles.historyRow, { borderBottomColor: colors.borderSubtle }]}>
                  <View style={{ flex: 1 }}>
                    <Typography variant="subtitle2" color={colors.text} bold>
                      {formatCurrency(tx.amount)}
                    </Typography>
                    <Typography variant="caption" color={colors.textSecondary}>
                      {tx.method} • {tx.date}
                    </Typography>
                  </View>
                  <View style={[styles.statusTag, { backgroundColor: tx.status === 'completed' ? '#34C75920' : '#FF950020' }]}>
                    <Typography variant="caption" color={tx.status === 'completed' ? '#34C759' : '#FF9500'} bold style={{ fontSize: 10 }}>
                      {tx.status.toUpperCase()}
                    </Typography>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* TAB 2: CONTENT ANALYTICS */}
        {activeTab === 'analytics' && (
          <View style={styles.tabSection}>
            {/* 4 Summary Metric Cards */}
            <View style={styles.streamGrid}>
              <Card variant="elevated" style={[styles.streamCard, { backgroundColor: colors.surface }]}>
                <Typography variant="caption" color={colors.textSecondary} bold>
                  TOTAL VIEWS (30D)
                </Typography>
                <Typography variant="h2" color={colors.text} bold style={{ marginVertical: 4 }}>
                  {formatNumber(contentAnalytics.totalViews30d)}
                </Typography>
                <Typography variant="caption" color={colors.success} bold>
                  ↑ +18.4%
                </Typography>
              </Card>

              <Card variant="elevated" style={[styles.streamCard, { backgroundColor: colors.surface }]}>
                <Typography variant="caption" color={colors.textSecondary} bold>
                  WATCH TIME (HRS)
                </Typography>
                <Typography variant="h2" color={colors.text} bold style={{ marginVertical: 4 }}>
                  {formatNumber(contentAnalytics.totalWatchTimeHours)}h
                </Typography>
                <Typography variant="caption" color={colors.success} bold>
                  ↑ +22.1%
                </Typography>
              </Card>

              <Card variant="elevated" style={[styles.streamCard, { backgroundColor: colors.surface }]}>
                <Typography variant="caption" color={colors.textSecondary} bold>
                  RETENTION RATE
                </Typography>
                <Typography variant="h2" color={colors.primary} bold style={{ marginVertical: 4 }}>
                  {contentAnalytics.retentionRatePercent}%
                </Typography>
                <Typography variant="caption" color={colors.textSecondary}>
                  Avg {contentAnalytics.avgWatchDurationSec}s per reel
                </Typography>
              </Card>

              <Card variant="elevated" style={[styles.streamCard, { backgroundColor: colors.surface }]}>
                <Typography variant="caption" color={colors.textSecondary} bold>
                  CONTENT SHARES
                </Typography>
                <Typography variant="h2" color={colors.text} bold style={{ marginVertical: 4 }}>
                  {formatNumber(contentAnalytics.sharesCount)}
                </Typography>
                <Typography variant="caption" color={colors.textSecondary}>
                  Viral multiplier 1.4x
                </Typography>
              </Card>
            </View>

            {/* Weekly Views Trend Bar Chart */}
            <Card variant="elevated" style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
              <Typography variant="subtitle1" color={colors.text} bold style={{ marginBottom: 12 }}>
                📊 Daily Views & Traffic
              </Typography>
              <View style={styles.chartContainer}>
                {contentAnalytics.weeklyViewsTrend.map((item) => {
                  const maxVal = 250000;
                  const heightPct = Math.min(100, (item.views / maxVal) * 100);

                  return (
                    <View key={item.day} style={styles.chartBarCol}>
                      <View style={styles.barTrack}>
                        <View style={[styles.barFill, { height: `${heightPct}%`, backgroundColor: colors.primary }]} />
                      </View>
                      <Typography variant="caption" color={colors.textSecondary} style={{ marginTop: 6, fontSize: 10 }}>
                        {item.day}
                      </Typography>
                    </View>
                  );
                })}
              </View>
            </Card>

            {/* Top Performing Content Leaderboard */}
            <Typography variant="subtitle1" color={colors.text} bold style={{ marginTop: 8 }}>
              Top Performing Content
            </Typography>
            {contentAnalytics.topContent.map((item) => (
              <View
                key={item.id}
                style={[styles.contentPerfRow, { backgroundColor: colors.surface, borderRadius: theme.radius.md }]}
              >
                <Image source={{ uri: item.thumbnailUrl }} style={styles.contentThumb} resizeMode="cover" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Typography variant="subtitle2" color={colors.text} bold numberOfLines={1}>
                    {item.title}
                  </Typography>
                  <Typography variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
                    👁️ {formatNumber(item.viewsCount)} views • ⏱️ {item.watchTimeHours}h watch • {item.engagementRatePercent}% ER
                  </Typography>
                  <Typography variant="caption" color={colors.primary} bold style={{ marginTop: 2 }}>
                    Est. Revenue: {formatCurrency(item.estimatedEarnings)}
                  </Typography>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* TAB 3: AUDIENCE INSIGHTS */}
        {activeTab === 'audience' && (
          <View style={styles.tabSection}>
            {/* Follower Stats Card */}
            <Card variant="elevated" style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
              <Typography variant="caption" color={colors.textSecondary} bold>
                TOTAL NETWORK AUDIENCE
              </Typography>
              <Typography variant="h1" color={colors.text} bold style={{ marginVertical: 4 }}>
                {formatNumber(audience.totalFollowers)}
              </Typography>
              <Typography variant="caption" color={colors.success} bold>
                ↑ +{formatNumber(audience.followerGrowth30d)} ({audience.growthRatePercent}%) new this month
              </Typography>
              <Typography variant="caption" color={colors.textSecondary} style={{ marginTop: 8 }}>
                🔥 Peak Audience Active Hours: {audience.peakActiveHours}
              </Typography>
            </Card>

            {/* Age Distribution */}
            <Card variant="elevated" style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
              <Typography variant="subtitle1" color={colors.text} bold style={{ marginBottom: 10 }}>
                🎂 Age Demographics
              </Typography>
              {audience.ageDistribution.map((item) => (
                <View key={item.range} style={styles.demoRow}>
                  <Typography variant="caption" color={colors.text} bold style={{ width: 70 }}>
                    {item.range}
                  </Typography>
                  <View style={styles.demoTrack}>
                    <View style={[styles.demoFill, { width: `${item.percentage}%`, backgroundColor: colors.primary }]} />
                  </View>
                  <Typography variant="caption" color={colors.textSecondary} style={{ width: 40, textAlign: 'right' }}>
                    {item.percentage}%
                  </Typography>
                </View>
              ))}
            </Card>

            {/* Top Countries */}
            <Card variant="elevated" style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
              <Typography variant="subtitle1" color={colors.text} bold style={{ marginBottom: 10 }}>
                🌍 Top Countries
              </Typography>
              {audience.topCountries.map((item) => (
                <View key={item.country} style={styles.demoRow}>
                  <Typography variant="caption" color={colors.text} bold style={{ width: 140 }}>
                    {item.flag} {item.country}
                  </Typography>
                  <View style={styles.demoTrack}>
                    <View style={[styles.demoFill, { width: `${item.percentage}%`, backgroundColor: colors.primary }]} />
                  </View>
                  <Typography variant="caption" color={colors.textSecondary} style={{ width: 40, textAlign: 'right' }}>
                    {item.percentage}%
                  </Typography>
                </View>
              ))}
            </Card>
          </View>
        )}

        {/* TAB 4: MONETIZATION HUB */}
        {activeTab === 'monetization' && (
          <View style={styles.tabSection}>
            {/* Subscriptions */}
            <Card variant="elevated" style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
              <View style={styles.switchRow}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Typography variant="subtitle1" color={colors.text} bold>
                    Guild Subscriptions ⭐
                  </Typography>
                  <Typography variant="caption" color={colors.textSecondary}>
                    Allow followers to support you with monthly memberships and exclusive badges
                  </Typography>
                </View>
                <Switch
                  value={monetization.subscriptionsEnabled}
                  onValueChange={(val) => {
                    updateMonetization({ subscriptionsEnabled: val });
                    showToast({ message: 'Subscription settings updated', type: 'info' });
                  }}
                  trackColor={{ false: colors.borderSubtle, true: colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </Card>

            {/* In-Stream Ads */}
            <Card variant="elevated" style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
              <View style={styles.switchRow}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Typography variant="subtitle1" color={colors.text} bold>
                    In-Stream Video Ads 🎥
                  </Typography>
                  <Typography variant="caption" color={colors.textSecondary}>
                    Earn revenue from non-intrusive short pre-roll and mid-roll video advertisements
                  </Typography>
                </View>
                <Switch
                  value={monetization.inStreamAdsEnabled}
                  onValueChange={(val) => {
                    updateMonetization({ inStreamAdsEnabled: val });
                    showToast({ message: 'In-Stream Ads updated', type: 'info' });
                  }}
                  trackColor={{ false: colors.borderSubtle, true: colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </Card>

            {/* Virtual Gifts */}
            <Card variant="elevated" style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
              <View style={styles.switchRow}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Typography variant="subtitle1" color={colors.text} bold>
                    Live Virtual Gifts & Tips 🎁
                  </Typography>
                  <Typography variant="caption" color={colors.textSecondary}>
                    Receive animated gift tokens from viewers during live streams and reels
                  </Typography>
                </View>
                <Switch
                  value={monetization.virtualGiftsEnabled}
                  onValueChange={(val) => {
                    updateMonetization({ virtualGiftsEnabled: val });
                    showToast({ message: 'Gifts settings updated', type: 'info' });
                  }}
                  trackColor={{ false: colors.borderSubtle, true: colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </Card>
          </View>
        )}
      </ScrollView>

      {/* Payout Request Modal */}
      <RequestPayoutModal
        visible={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
      />
    </View>
  );
};

export const CreatorStudioScreen = memo(CreatorStudioScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  creatorBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  tabSection: {
    gap: 14,
  },
  revHighlightCard: {
    padding: 16,
  },
  balanceBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginTop: 14,
  },
  streamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  streamCard: {
    width: '48%',
    padding: 14,
  },
  sectionCard: {
    padding: 16,
  },
  historyContainer: {
    overflow: 'hidden',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
  },
  chartBarCol: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    width: 20,
    height: 90,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 4,
  },
  contentPerfRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 4,
  },
  contentThumb: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  demoTrack: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  demoFill: {
    height: '100%',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
