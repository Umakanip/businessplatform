import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Subscription, { PlanType } from "../models/subscription";
import User from "../models/user";
import Payment from "../models/payment";
import { PLAN_MONTHS, PLAN_PRICE } from "../utils/plan";
import { addMonths, isActive } from "../utils/dates";

interface AuthRequest extends Request {
  user: User;
}
export const subscribe = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (user.role !== "idealogist") {
      return res.status(403).json({ message: "Only idealogists can subscribe" });
    }

    const { plan } = req.body as { plan: PlanType };
    if (!plan || !PLAN_MONTHS[plan]) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    const now = new Date();
    let sub = await Subscription.findOne({ where: { userId: user.id } });

    const startDate = sub && isActive(sub.endDate) ? sub.endDate : now;
    const endDate = addMonths(new Date(startDate), PLAN_MONTHS[plan]);

    if (!sub) {
      sub = await Subscription.create({
        userId: user.id,
        plan,
        startDate,
        endDate,
        status: "active",
      });
    } else {
      sub.plan = plan;
      sub.startDate = startDate;
      sub.endDate = endDate;
      sub.status = "active";
      await sub.save();
    }

    await Payment.create({
      subscriptionId: sub.id,
      amount: PLAN_PRICE[plan],
      status: "success",
    });

    await sub.reload();
    return res.json({
      success: true,
      message: "Subscription active",
      subscriptionId: sub.id,
      amount: PLAN_PRICE[plan],
      status: "success",
      subscription: sub,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Public subscription: idealogist who cannot log in yet can subscribe
 */
export const subscribePublic = async (req: Request, res: Response) => {
  try {
    const { email, password, plan } = req.body as {
      email: string;
      password: string;
      plan: PlanType;
    };

    if (!email || !password || !plan) {
      return res.status(400).json({ message: "Missing fields" });
    }
    if (!PLAN_MONTHS[plan]) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || user.role !== "idealogist") {
      return res.status(403).json({ message: "Only idealogists can subscribe here" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const now = new Date();
    let sub = await Subscription.findOne({ where: { userId: user.id } });

    const startDate = sub && isActive(sub.endDate) ? sub.endDate : now;
    const endDate = addMonths(new Date(startDate), PLAN_MONTHS[plan]);

    if (!sub) {
      sub = await Subscription.create({
        userId: user.id,
        plan,
        startDate,
        endDate,
        status: "active",
      });
    } else {
      sub.plan = plan;
      sub.startDate = startDate;
      sub.endDate = endDate;
      sub.status = "active";
      await sub.save();
    }

    await Payment.create({
      subscriptionId: sub.id,
      amount: PLAN_PRICE[plan],
      status: "success",
    });

    await sub.reload();
    return res.json({
      success: true,
      message: "Subscription activated. You can now login.",
      subscriptionId: sub.id,
      amount: PLAN_PRICE[plan],
      status: "success",
      subscription: sub,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Check subscription status
 */
export const status = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const sub = await Subscription.findOne({ where: { userId: user.id } });

    if (!sub) return res.json({ active: false });

    return res.json({
      active: isActive(sub.endDate),
      plan: sub.plan,
      endDate: sub.endDate,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
};

