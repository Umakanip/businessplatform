import { PlanType } from "../models/subscription";

export const PLAN_MONTHS: Record<PlanType, number> = {
  lite: 3,
  standard: 6,
  premium: 12
};

export const PLAN_PRICE: Record<PlanType, number> = {
  lite: 49.0,
  standard: 89.0,
  premium: 149.0
};
