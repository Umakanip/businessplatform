// utils/plan.ts
import { PlanType } from "../models/subscription";

// Only idealogist plans
export const PLAN_MONTHS: Record<PlanType, number> = {
  lite: 3,
  standard: 6,
  premium: 12,
};

export const PLAN_PRICE: Record<PlanType, number> = {
  lite: 730,
  standard: 1000,
  premium: 1300,
};

export const GST_RATE = 0.18;

export const PLAN_TOTAL_PRICE: Record<PlanType, number> = {
  lite: PLAN_PRICE.lite + PLAN_PRICE.lite * GST_RATE,        // 861.4
  standard: PLAN_PRICE.standard + PLAN_PRICE.standard * GST_RATE, // 1180
  premium: PLAN_PRICE.premium + PLAN_PRICE.premium * GST_RATE,   // 1534
};

// Investor special fixed plan
export const INVESTOR_MONTHS = 3;
export const INVESTOR_BASE_PRICE = 600;
export const INVESTOR_GST_RATE = 0.18;
export const INVESTOR_TOTAL_PRICE =
  INVESTOR_BASE_PRICE + INVESTOR_BASE_PRICE * INVESTOR_GST_RATE; // 708
