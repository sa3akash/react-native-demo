import React, { useState, memo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Typography, Card, SegmentedControl, Button } from '../../shared/components';
import { usePageStore, PageModel } from '../../store/usePageStore';

export interface PageAnalyticsScreenProps {
  pageId: string;
  onBack: () => void;
}

const TIME_RANGES = [
  { id: '7d', label: 'Last 7 Days' },
  { id: '30d', label: 'Last 30 Days' },
  { id: '90d', label: 'Last 90 Days' },
];

const PageAnalyticsScreenComponent: React.FC<PageAnalyticsScreenProps> = ({
  pageId,
  onBack,
}) => {
  const { colors, theme } = useTheme();
  const page = usePageStore((state) => state.pages.find((p) => p.id === pageId));
  const [timeRange, setTimeRange] = useState('7d');

  const isRTL = I18nManager.isRTL;

  if (!page) return null;

  const { analytics } = page;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.borderSubtle,
            flexDirection: isRTL ? 'row-reverse' : 'row',
          },
        ]}
      >
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Typography variant="h3" color={colors.text}>
            {isRTL ? '➡️' : '⬅️'}
          </Typography>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Typography variant="h3" color={colors.text} bold numberOfLines={1}>
            Page Insights & Analytics
          </Typography>
          <Typography variant="caption" color={colors.primary} bold>
            {page.name}
          </Typography>
        </View>
      </View>

      <View style={styles.content}>
        {/* Time Range Selector */}
        <SegmentedControl
          segments={TIME_RANGES}
          activeId={timeRange}
          onSelect={setTimeRange}
          size="sm"
        />

        {/* 1. Overview 4-Metric Grid */}
        <View style={styles.metricsGrid}>
          {/* Total Followers */}
          <Card variant="elevated" style={[styles.metricCard, { backgroundColor: colors.surface }]}>
            <Typography variant="caption" color={colors.textSecondary} bold>
              👥 TOTAL FOLLOWERS
            </Typography>
            <Typography variant="h2" color={colors.text} bold style={{ marginVertical: 4 }}>
              {formatNumber(analytics.followers.total)}
            </Typography>
            <Typography variant="caption" color={colors.success} bold>
              ↑ +{analytics.followers.growthRatePercent}% this week
            </Typography>
          </Card>

          {/* Total Reach */}
          <Card variant="elevated" style={[styles.metricCard, { backgroundColor: colors.surface }]}>
            <Typography variant="caption" color={colors.textSecondary} bold>
              🌐 TOTAL REACH
            </Typography>
            <Typography variant="h2" color={colors.text} bold style={{ marginVertical: 4 }}>
              {formatNumber(analytics.reach.totalReach)}
            </Typography>
            <Typography variant="caption" color={colors.success} bold>
              ↑ +{analytics.reach.reachGrowthPercent}% vs last period
            </Typography>
          </Card>

          {/* Engagement Rate */}
          <Card variant="elevated" style={[styles.metricCard, { backgroundColor: colors.surface }]}>
            <Typography variant="caption" color={colors.textSecondary} bold>
              ⚡ ENGAGEMENT RATE
            </Typography>
            <Typography variant="h2" color={colors.primary} bold style={{ marginVertical: 4 }}>
              {analytics.engagement.ratePercent}%
            </Typography>
            <Typography variant="caption" color={colors.textSecondary}>
              High audience interaction
            </Typography>
          </Card>

          {/* Profile Visits */}
          <Card variant="elevated" style={[styles.metricCard, { backgroundColor: colors.surface }]}>
            <Typography variant="caption" color={colors.textSecondary} bold>
              👁️ PROFILE VISITS
            </Typography>
            <Typography variant="h2" color={colors.text} bold style={{ marginVertical: 4 }}>
              {formatNumber(analytics.engagement.profileVisits)}
            </Typography>
            <Typography variant="caption" color={colors.textSecondary}>
              {formatNumber(analytics.engagement.linkClicks)} link clicks
            </Typography>
          </Card>
        </View>

        {/* 2. Weekly Performance Visual Chart */}
        <Card variant="elevated" style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
          <Typography variant="subtitle1" color={colors.text} bold style={{ marginBottom: 12 }}>
            📊 7-Day Performance Trend
          </Typography>

          <View style={styles.chartContainer}>
            {analytics.weeklyChart.map((item) => {
              const maxReach = 800000;
              const heightPct = Math.min(100, (item.reach / maxReach) * 100);

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

        {/* 3. Reach & Impressions Breakdown */}
        <Card variant="elevated" style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
          <Typography variant="subtitle1" color={colors.text} bold style={{ marginBottom: 12 }}>
            🎯 Reach & Impressions Breakdown
          </Typography>

          <View style={styles.breakdownRow}>
            <View style={styles.breakdownItem}>
              <Typography variant="caption" color={colors.textSecondary}>
                Organic Reach
              </Typography>
              <Typography variant="subtitle1" color={colors.text} bold>
                {formatNumber(analytics.reach.organicReach)}
              </Typography>
            </View>
            <View style={styles.breakdownItem}>
              <Typography variant="caption" color={colors.textSecondary}>
                Paid Boost Reach
              </Typography>
              <Typography variant="subtitle1" color={colors.text} bold>
                {formatNumber(analytics.reach.paidReach)}
              </Typography>
            </View>
            <View style={styles.breakdownItem}>
              <Typography variant="caption" color={colors.textSecondary}>
                Total Impressions
              </Typography>
              <Typography variant="subtitle1" color={colors.text} bold>
                {formatNumber(analytics.reach.impressions)}
              </Typography>
            </View>
          </View>
        </Card>

        {/* 4. Engagement Breakdown */}
        <Card variant="elevated" style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
          <Typography variant="subtitle1" color={colors.text} bold style={{ marginBottom: 12 }}>
            💬 Total Interactions Breakdown
          </Typography>

          <View style={styles.interactionGrid}>
            <View style={styles.interactionPill}>
              <Typography variant="caption">❤️ Likes</Typography>
              <Typography variant="subtitle2" color={colors.text} bold>
                {formatNumber(analytics.engagement.totalLikes)}
              </Typography>
            </View>
            <View style={styles.interactionPill}>
              <Typography variant="caption">💬 Comments</Typography>
              <Typography variant="subtitle2" color={colors.text} bold>
                {formatNumber(analytics.engagement.totalComments)}
              </Typography>
            </View>
            <View style={styles.interactionPill}>
              <Typography variant="caption">🔄 Shares</Typography>
              <Typography variant="subtitle2" color={colors.text} bold>
                {formatNumber(analytics.engagement.totalShares)}
              </Typography>
            </View>
            <View style={styles.interactionPill}>
              <Typography variant="caption">🔗 Link Clicks</Typography>
              <Typography variant="subtitle2" color={colors.text} bold>
                {formatNumber(analytics.engagement.linkClicks)}
              </Typography>
            </View>
          </View>
        </Card>

        {/* 5. Audience Demographics */}
        <Card variant="elevated" style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
          <Typography variant="subtitle1" color={colors.text} bold style={{ marginBottom: 12 }}>
            🌍 Top Audience Demographics
          </Typography>

          {analytics.followers.demographics.map((demo) => (
            <View key={demo.region} style={styles.demoRow}>
              <Typography variant="caption" color={colors.text} bold style={{ width: 140 }}>
                {demo.region}
              </Typography>
              <View style={styles.demoTrack}>
                <View style={[styles.demoFill, { width: `${demo.percentage}%`, backgroundColor: colors.primary }]} />
              </View>
              <Typography variant="caption" color={colors.textSecondary} style={{ width: 40, textAlign: 'right' }}>
                {demo.percentage}%
              </Typography>
            </View>
          ))}
        </Card>
      </View>
    </ScrollView>
  );
};

export const PageAnalyticsScreen = memo(PageAnalyticsScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    padding: 14,
  },
  sectionCard: {
    padding: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    paddingTop: 10,
  },
  chartBarCol: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    width: 24,
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownItem: {
    alignItems: 'center',
  },
  interactionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  interactionPill: {
    width: '48%',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 8,
    alignItems: 'center',
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
});
