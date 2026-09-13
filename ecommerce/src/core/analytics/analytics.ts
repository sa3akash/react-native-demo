import { logger } from "../logger/logger";

export type AnalyticsEventName =
  | "app_opened"
  | "product_viewed"
  | "search_performed"
  | "filter_applied"
  | "add_to_cart"
  | "remove_from_cart"
  | "wishlist_added"
  | "checkout_started"
  | "payment_completed"
  | "order_created"
  | "review_submitted";

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  properties?: Record<string, unknown>;
}

class AnalyticsService {
  public track(event: AnalyticsEvent): void {
    logger.info(`[Analytics Track] ${event.name}`, event.properties);
  }

  public identify(userId: string, traits?: Record<string, unknown>): void {
    logger.info(`[Analytics Identify] User: ${userId}`, traits);
  }

  public reset(): void {
    logger.info("[Analytics Reset]");
  }
}

export const analytics = new AnalyticsService();
