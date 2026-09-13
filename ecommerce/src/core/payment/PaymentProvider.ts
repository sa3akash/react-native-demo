import { Money } from "../../domain/pricing/money";
import { OrderId, UserId } from "../../shared/types/branded";

export interface PaymentRequest {
  orderId: OrderId;
  userId: UserId;
  amount: Money;
  currency: string;
  description?: string;
  metadata?: Record<string, string>;
}

export type PaymentStatus = "pending" | "succeeded" | "failed" | "cancelled" | "requires_action";

export interface PaymentResult {
  paymentId: string;
  status: PaymentStatus;
  transactionReference?: string;
  errorMessage?: string;
}

/**
 * Enterprise Payment Provider Abstraction
 * Allows decoupling UI from payment gateways (Stripe, PayPal, Apple Pay, Google Pay, COD, bKash)
 */
export interface PaymentProvider {
  readonly providerId: string;
  readonly name: string;
  initialize(): Promise<void>;
  createPayment(request: PaymentRequest): Promise<PaymentResult>;
  confirmPayment(paymentId: string): Promise<PaymentResult>;
  cancelPayment(paymentId: string): Promise<void>;
}

// 1. Stripe Payment Adapter Implementation
export class StripePaymentProvider implements PaymentProvider {
  public readonly providerId = "stripe";
  public readonly name = "Credit / Debit Card (Stripe)";

  async initialize(): Promise<void> {
    // Initialize Stripe SDK natively
  }

  async createPayment(request: PaymentRequest): Promise<PaymentResult> {
    // Call server to create Stripe PaymentIntent
    return {
      paymentId: `pi_stripe_${Date.now()}`,
      status: "succeeded",
      transactionReference: `txn_stripe_${Math.floor(Math.random() * 1000000)}`,
    };
  }

  async confirmPayment(paymentId: string): Promise<PaymentResult> {
    return {
      paymentId,
      status: "succeeded",
    };
  }

  async cancelPayment(paymentId: string): Promise<void> {
    // Cancel PaymentIntent
  }
}

// 2. Cash on Delivery Adapter Implementation
export class CashOnDeliveryProvider implements PaymentProvider {
  public readonly providerId = "cod";
  public readonly name = "Cash on Delivery (Pay upon receipt)";

  async initialize(): Promise<void> {}

  async createPayment(request: PaymentRequest): Promise<PaymentResult> {
    return {
      paymentId: `cod_${Date.now()}`,
      status: "succeeded",
      transactionReference: `COD-${request.orderId}`,
    };
  }

  async confirmPayment(paymentId: string): Promise<PaymentResult> {
    return { paymentId, status: "succeeded" };
  }

  async cancelPayment(): Promise<void> {}
}

// Payment Registry for Dynamic Provider Resolution
export class PaymentProviderRegistry {
  private static providers = new Map<string, PaymentProvider>([
    ["stripe", new StripePaymentProvider()],
    ["cod", new CashOnDeliveryProvider()],
  ]);

  public static registerProvider(provider: PaymentProvider): void {
    this.providers.set(provider.providerId, provider);
  }

  public static getProvider(providerId: string): PaymentProvider {
    const provider = this.providers.get(providerId);
    if (!provider) {
      // Default to COD fallback
      return this.providers.get("cod")!;
    }
    return provider;
  }
}
