import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
  typescript: true,
});

/**
 * Calculate the platform fee amount in smallest currency unit (paise / cents).
 * platformFeeRate is a decimal e.g. 0.02 = 2%
 */
export function calculatePlatformFee(
  totalAmountInSmallestUnit: number,
  platformFeeRate: number
): number {
  if (!platformFeeRate || platformFeeRate <= 0) return 0;
  return Math.round(totalAmountInSmallestUnit * platformFeeRate);
}

/**
 * Convert display amount (e.g. ₹499) to smallest unit (49900 paise).
 */
export function toSmallestUnit(amount: number, currency: string): number {
  const zeroDecimalCurrencies = ["JPY", "KRW", "VND"];
  if (zeroDecimalCurrencies.includes(currency.toUpperCase())) {
    return Math.round(amount);
  }
  return Math.round(amount * 100);
}

/**
 * Convert smallest unit back to display amount.
 */
export function fromSmallestUnit(amount: number, currency: string): number {
  const zeroDecimalCurrencies = ["JPY", "KRW", "VND"];
  if (zeroDecimalCurrencies.includes(currency.toUpperCase())) {
    return amount;
  }
  return amount / 100;
}

export function formatCurrency(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
