// utils/plan.ts
import { PlanType } from "../models/subscription";


export const PLAN_MONTHS: Record<PlanType, number> = {
  lite: 0,
  standard: 0,
  premium: 0,
  pro: 3,
};

export const PLAN_PRICE: Record<PlanType, number> = {
  lite: 730,
  standard: 1000,
  premium: 1300,
  pro: 600,
};

export const GST_RATE = 0.18;

export const PLAN_TOTAL_PRICE: Record<PlanType, number> = {
  lite: PLAN_PRICE.lite + PLAN_PRICE.lite * GST_RATE,        // 861.4
  standard: PLAN_PRICE.standard + PLAN_PRICE.standard * GST_RATE, // 1180
  premium: PLAN_PRICE.premium + PLAN_PRICE.premium * GST_RATE,   // 1534
  pro: PLAN_PRICE.pro + PLAN_PRICE.pro * GST_RATE,             // 708
};

// Investor special fixed plan
export const INVESTOR_MONTHS = 3;
export const INVESTOR_BASE_PRICE = 600;
export const INVESTOR_GST_RATE = 0.18;
export const INVESTOR_TOTAL_PRICE =
  INVESTOR_BASE_PRICE + INVESTOR_BASE_PRICE * INVESTOR_GST_RATE; // 708
