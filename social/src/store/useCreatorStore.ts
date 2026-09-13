import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import { zustandMMKVStorage } from '../core/storage/StorageService';

export interface PayoutTransaction {
  id: string;
  amount: number;
  currency: string;
  date: string;
  status: 'completed' | 'processing' | 'failed';
  method: string;
  referenceId: string;
}

export interface CreatorContentPerformance {
  id: string;
  title: string;
  type: 'video' | 'reel' | 'post';
  thumbnailUrl: string;
  viewsCount: number;
  watchTimeHours: number;
  engagementRatePercent: number;
  estimatedEarnings: number;
  publishedAt: string;
}

export interface CreatorStudioState {
  // Revenue
  revenue: {
    totalEarnings: number;
    thisMonthEarnings: number;
    lastMonthEarnings: number;
    growthPercent: number;
    availableBalance: number;
    pendingBalance: number;
    breakdown: {
      subscriptions: number;
      virtualGifts: number;
      inStreamAds: number;
      brandSponsorships: number;
    };
    payoutHistory: PayoutTransaction[];
  };

  // Content Analytics
  contentAnalytics: {
    totalViews30d: number;
    totalWatchTimeHours: number;
    avgWatchDurationSec: number;
    retentionRatePercent: number;
    sharesCount: number;
    topContent: CreatorContentPerformance[];
    weeklyViewsTrend: Array<{ day: string; views: number; earnings: number }>;
  };

  // Audience Insights
  audience: {
    totalFollowers: number;
    followerGrowth30d: number;
    growthRatePercent: number;
    peakActiveHours: string;
    genderDistribution: { male: number; female: number; other: number };
    ageDistribution: Array<{ range: string; percentage: number }>;
    topCountries: Array<{ country: string; flag: string; percentage: number }>;
  };

  // Monetization Settings
  monetization: {
    subscriptionsEnabled: boolean;
    subscriptionPriceMonthly: number;
    inStreamAdsEnabled: boolean;
    virtualGiftsEnabled: boolean;
    payoutMethod: {
      provider: string;
      accountHolder: string;
      accountLast4: string;
      isVerified: boolean;
    };
  };

  // Actions
  requestPayout: (amount: number) => PayoutTransaction;
  updateMonetizationSettings: (partial: Partial<CreatorStudioState['monetization']>) => void;
}

const INITIAL_TOP_CONTENT: CreatorContentPerformance[] = [
  {
    id: 'c_1',
    title: 'Crazy Cyberpunk UI Animation in 30 Seconds! ⚡',
    type: 'reel',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600',
    viewsCount: 482000,
    watchTimeHours: 2410,
    engagementRatePercent: 8.9,
    estimatedEarnings: 1420.5,
    publishedAt: '3d ago',
  },
  {
    id: 'c_2',
    title: 'Building 120 FPS React Native Apps with New Architecture',
    type: 'video',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    viewsCount: 184000,
    watchTimeHours: 1890,
    engagementRatePercent: 9.4,
    estimatedEarnings: 2150.0,
    publishedAt: '1w ago',
  },
  {
    id: 'c_3',
    title: 'Zero-Copy ArrayBuffer JSI TurboModules Guide',
    type: 'post',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
    viewsCount: 92000,
    watchTimeHours: 460,
    engagementRatePercent: 7.8,
    estimatedEarnings: 480.0,
    publishedAt: '2w ago',
  },
];

const INITIAL_PAYOUTS: PayoutTransaction[] = [
  {
    id: 'po_101',
    amount: 6840.0,
    currency: '$',
    date: 'Aug 01, 2026',
    status: 'completed',
    method: 'Stripe Express (•••• 4829)',
    referenceId: 'ST-994827104',
  },
  {
    id: 'po_102',
    amount: 5120.5,
    currency: '$',
    date: 'Jul 01, 2026',
    status: 'completed',
    method: 'Stripe Express (•••• 4829)',
    referenceId: 'ST-882749102',
  },
];

export const useCreatorStore = create<CreatorStudioState>()(
  persist(
    (set, get) => ({
      revenue: {
        totalEarnings: 38450.0,
        thisMonthEarnings: 8420.5,
        lastMonthEarnings: 6840.0,
        growthPercent: 23.1,
        availableBalance: 4250.0,
        pendingBalance: 4170.5,
        breakdown: {
          subscriptions: 3450.0,
          virtualGifts: 1920.0,
          inStreamAds: 2180.5,
          brandSponsorships: 870.0,
        },
        payoutHistory: INITIAL_PAYOUTS,
      },

      contentAnalytics: {
        totalViews30d: 1240000,
        totalWatchTimeHours: 6420,
        avgWatchDurationSec: 48,
        retentionRatePercent: 74.2,
        sharesCount: 18400,
        topContent: INITIAL_TOP_CONTENT,
        weeklyViewsTrend: [
          { day: 'Mon', views: 140000, earnings: 920 },
          { day: 'Tue', views: 165000, earnings: 1150 },
          { day: 'Wed', views: 190000, earnings: 1420 },
          { day: 'Thu', views: 175000, earnings: 1280 },
          { day: 'Fri', views: 240000, earnings: 1840 },
          { day: 'Sat', views: 180000, earnings: 1310 },
          { day: 'Sun', views: 150000, earnings: 1050 },
        ],
      },

      audience: {
        totalFollowers: 84200,
        followerGrowth30d: 8400,
        growthRatePercent: 11.2,
        peakActiveHours: '06:00 PM - 10:00 PM PST',
        genderDistribution: { male: 58, female: 36, other: 6 },
        ageDistribution: [
          { range: '18 - 24', percentage: 28 },
          { range: '25 - 34', percentage: 48 },
          { range: '35 - 44', percentage: 16 },
          { range: '45+', percentage: 8 },
        ],
        topCountries: [
          { country: 'United States', flag: '🇺🇸', percentage: 42 },
          { country: 'United Kingdom', flag: '🇬🇧', percentage: 18 },
          { country: 'Germany', flag: '🇩🇪', percentage: 14 },
          { country: 'India', flag: '🇮🇳', percentage: 12 },
          { country: 'Other', flag: '🌐', percentage: 14 },
        ],
      },

      monetization: {
        subscriptionsEnabled: true,
        subscriptionPriceMonthly: 9.99,
        inStreamAdsEnabled: true,
        virtualGiftsEnabled: true,
        payoutMethod: {
          provider: 'Stripe Express',
          accountHolder: 'Alex Rivera',
          accountLast4: '4829',
          isVerified: true,
        },
      },

      requestPayout: (amount) => {
        const id = `po_${Date.now()}`;
        const newTx: PayoutTransaction = {
          id,
          amount,
          currency: '$',
          date: 'Today',
          status: 'processing',
          method: `${get().monetization.payoutMethod.provider} (•••• ${get().monetization.payoutMethod.accountLast4})`,
          referenceId: `TX-${Date.now()}`,
        };

        set(
          produce((state: CreatorStudioState) => {
            state.revenue.availableBalance = Math.max(0, state.revenue.availableBalance - amount);
            state.revenue.payoutHistory.unshift(newTx);
          })
        );

        return newTx;
      },

      updateMonetizationSettings: (partial) => {
        set(
          produce((state: CreatorStudioState) => {
            state.monetization = { ...state.monetization, ...partial };
          })
        );
      },
    }),
    {
      name: 'creator-studio-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: (state) => ({
        revenue: state.revenue,
        monetization: state.monetization,
      }),
    }
  )
);
