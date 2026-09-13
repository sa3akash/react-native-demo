import { useCreatorStore } from '../src/store/useCreatorStore';

describe('Enterprise Creator Studio Suite', () => {
  beforeEach(() => {
    // Reset state before each test
  });

  test('Calculates Revenue & Earnings metrics across 4 monetization streams', () => {
    const revenue = useCreatorStore.getState().revenue;
    expect(revenue.thisMonthEarnings).toBeGreaterThan(0);
    expect(revenue.availableBalance).toBeGreaterThan(0);

    const { breakdown } = revenue;
    expect(breakdown.subscriptions).toBeGreaterThan(0);
    expect(breakdown.virtualGifts).toBeGreaterThan(0);
    expect(breakdown.inStreamAds).toBeGreaterThan(0);
    expect(breakdown.brandSponsorships).toBeGreaterThan(0);
  });

  test('Executes Payout Request and updates available balance and transaction ledger', () => {
    const initialBalance = useCreatorStore.getState().revenue.availableBalance;
    const initialTxCount = useCreatorStore.getState().revenue.payoutHistory.length;

    const payoutTx = useCreatorStore.getState().requestPayout(1500);
    expect(payoutTx).toBeDefined();
    expect(payoutTx.amount).toBe(1500);
    expect(payoutTx.status).toBe('processing');

    const updatedRevenue = useCreatorStore.getState().revenue;
    expect(updatedRevenue.availableBalance).toBe(initialBalance - 1500);
    expect(updatedRevenue.payoutHistory.length).toBe(initialTxCount + 1);
  });

  test('Inspects Content Analytics: 30-day views, watch hours, retention rate, and top content leaderboard', () => {
    const { contentAnalytics } = useCreatorStore.getState();
    expect(contentAnalytics.totalViews30d).toBeGreaterThan(0);
    expect(contentAnalytics.totalWatchTimeHours).toBeGreaterThan(0);
    expect(contentAnalytics.retentionRatePercent).toBeGreaterThan(0);
    expect(contentAnalytics.topContent.length).toBeGreaterThan(0);

    const topItem = contentAnalytics.topContent[0];
    expect(topItem.viewsCount).toBeGreaterThan(0);
    expect(topItem.estimatedEarnings).toBeGreaterThan(0);
  });

  test('Inspects Audience Insights: Age distribution, top countries, and peak active hours', () => {
    const { audience } = useCreatorStore.getState();
    expect(audience.totalFollowers).toBeGreaterThan(0);
    expect(audience.peakActiveHours).toBeDefined();
    expect(audience.ageDistribution.length).toBeGreaterThan(0);
    expect(audience.topCountries.length).toBeGreaterThan(0);
  });

  test('Updates Monetization settings (Subscriptions, In-stream Ads, Virtual gifts)', () => {
    useCreatorStore.getState().updateMonetizationSettings({
      subscriptionsEnabled: false,
      subscriptionPriceMonthly: 14.99,
      inStreamAdsEnabled: true,
    });

    const { monetization } = useCreatorStore.getState();
    expect(monetization.subscriptionsEnabled).toBe(false);
    expect(monetization.subscriptionPriceMonthly).toBe(14.99);
    expect(monetization.inStreamAdsEnabled).toBe(true);
  });
});
