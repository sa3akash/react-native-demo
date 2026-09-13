export interface AnalyticsEventMap {
  login_success: { method: string };
  register_success: { method: string };
  view_product: { productId: string; category: string };
  theme_changed: { mode: string };
}

export const analytics = {
  track: <K extends keyof AnalyticsEventMap>(event: K, properties: AnalyticsEventMap[K]): void => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Analytics Event] ${event}`, properties);
    }
  },

  identify: (userId: string, traits?: Record<string, unknown>): void => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Analytics Identify] User: ${userId}`, traits);
    }
  },

  screen: (name: string, properties?: Record<string, unknown>): void => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Analytics Screen] ${name}`, properties);
    }
  },

  reset: (): void => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Analytics Reset Session]');
    }
  },
};
