/**
 * Branded Nominal Types for Strict Type Safety across Domain Models
 */

export type ProductId = string & { readonly __brand: "ProductId" };
export type UserId = string & { readonly __brand: "UserId" };
export type OrderId = string & { readonly __brand: "OrderId" };
export type CategoryId = string & { readonly __brand: "CategoryId" };
export type CartItemId = string & { readonly __brand: "CartItemId" };
export type AddressId = string & { readonly __brand: "AddressId" };
export type ReviewId = string & { readonly __brand: "ReviewId" };
export type SellerId = string & { readonly __brand: "SellerId" };
export type CouponId = string & { readonly __brand: "CouponId" };

/** Minor-unit integer financial amount (e.g. 12999 = $129.99 or ৳129.99) */
export type MoneyAmount = number & { readonly __brand: "MoneyAmount" };

// Helper constructor functions for nominal branding
export const toProductId = (id: string): ProductId => id as ProductId;
export const toUserId = (id: string): UserId => id as UserId;
export const toOrderId = (id: string): OrderId => id as OrderId;
export const toCategoryId = (id: string): CategoryId => id as CategoryId;
export const toCartItemId = (id: string): CartItemId => id as CartItemId;
export const toAddressId = (id: string): AddressId => id as AddressId;
export const toReviewId = (id: string): ReviewId => id as ReviewId;
export const toSellerId = (id: string): SellerId => id as SellerId;
export const toCouponId = (id: string): CouponId => id as CouponId;
export const toMoneyAmount = (amount: number): MoneyAmount => Math.round(amount) as MoneyAmount;
