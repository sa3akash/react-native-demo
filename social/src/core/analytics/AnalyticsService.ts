export interface AnalyticsEvent {
  name: string;
  params?: Record<string, any>;
  timestamp: number;
}

class AnalyticsService {
  private userId: string | null = null;
  private userProperties: Record<string, any> = {};

  public identify(userId: string, properties?: Record<string, any>): void {
    this.userId = userId;
    if (properties) {
      this.userProperties = { ...this.userProperties, ...properties };
    }
  }

  public track(eventName: string, params?: Record<string, any>): void {
    const payload: AnalyticsEvent = {
      name: eventName,
      params: {
        ...params,
        userId: this.userId,
      },
      timestamp: Date.now(),
    };
    // Telemetry output in dev
    if (__DEV__) {
      console.log(`[Analytics] Track: ${eventName}`, payload);
    }
  }

  public screen(screenName: string, params?: Record<string, any>): void {
    this.track('screen_view', { screen_name: screenName, ...params });
  }

  public reset(): void {
    this.userId = null;
    this.userProperties = {};
  }
}

export const analyticsService = new AnalyticsService();
