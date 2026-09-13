import { MoneyAmount, toMoneyAmount } from "../../shared/types/branded";

export type CurrencyCode = "USD" | "BDT" | "EUR" | "GBP";

export interface Money {
  readonly amount: MoneyAmount; // Minor unit integer (cents, poisha)
  readonly currency: CurrencyCode;
}

export const createMoney = (minorUnits: number, currency: CurrencyCode = "USD"): Money => ({
  amount: toMoneyAmount(minorUnits),
  currency,
});

export const fromMajorUnits = (majorUnits: number, currency: CurrencyCode = "USD"): Money => ({
  amount: toMoneyAmount(Math.round(majorUnits * 100)),
  currency,
});

export const toMajorUnits = (money: Money): number => {
  return money.amount / 100;
};

export const formatMoney = (money: Money): string => {
  const major = toMajorUnits(money);
  const symbols: Record<CurrencyCode, string> = {
    USD: "$",
    BDT: "৳",
    EUR: "€",
    GBP: "£",
  };
  const symbol = symbols[money.currency] ?? "$";
  return `${symbol}${major.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const addMoney = (a: Money, b: Money): Money => {
  if (a.currency !== b.currency) {
    throw new Error(`Cannot add different currencies: ${a.currency} and ${b.currency}`);
  }
  return createMoney(a.amount + b.amount, a.currency);
};

export const subtractMoney = (a: Money, b: Money): Money => {
  if (a.currency !== b.currency) {
    throw new Error(`Cannot subtract different currencies: ${a.currency} and ${b.currency}`);
  }
  return createMoney(Math.max(0, a.amount - b.amount), a.currency);
};

export const multiplyMoney = (money: Money, multiplier: number): Money => {
  return createMoney(Math.round(money.amount * multiplier), money.currency);
};
