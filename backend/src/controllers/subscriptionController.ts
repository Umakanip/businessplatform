import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Subscription, { PlanType } from "../models/subscription";
import User from "../models/user";
import Payment from "../models/payment";
import { addMonths, isActive } from "../utils/dates";
import {
  PLAN_PRICE,
  PLAN_TOTAL_PRICE,
  PLAN_MONTHS,
  INVESTOR_BASE_PRICE,
  INVESTOR_GST_RATE,
  INVESTOR_TOTAL_PRICE,
  INVESTOR_MONTHS,
} from "../utils/plan";



interface AuthRequest extends Request {
  user: User;
}

// ------------------ Idealogist Subscription ------------------
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

    const months = PLAN_MONTHS[plan];
    const amount = PLAN_PRICE[plan];

    const startDate = sub && isActive(sub.endDate) ? sub.endDate : now;
    const endDate = addMonths(new Date(startDate), months);

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
      amount,
      status: "success",
    });

    await sub.reload();
    return res.json({
      success: true,
      message: "Subscription active",
      subscriptionId: sub.id,
      amount,
      status: "success",
      subscription: sub,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
};

export const subscribePublic = async (req: Request, res: Response) => {
  try {
const { email, password, plan, role } = req.body as {
  email: string;
  password: string;
  plan?: PlanType;
  role: "investor" | "idealogist";
};

    // 1️⃣ User check
    let user = await User.findOne({ where: { email } });
    if (!user) {
   user = await User.create({
  email,
  password,
  role,
} as any);

    }

    // 2️⃣ Plan check & amount/months set
    let amount = 0;
    let months = 0;

    if (role === "investor") {
      amount = INVESTOR_TOTAL_PRICE;
      months = INVESTOR_MONTHS;
    } else if (role === "idealogist") {
      if (!plan || !PLAN_TOTAL_PRICE[plan]) {
        return res.status(400).json({ message: "Invalid plan selected" });
      }
      amount = PLAN_TOTAL_PRICE[plan];
      months = PLAN_MONTHS[plan];
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

  // 3️⃣ Subscription create
const subscription = await Subscription.create({
  userId: user.id,
  plan: role === "investor" ? ("pro" as PlanType) : (plan as PlanType), // ✅ change lite → pro
  status: "active",
  startDate: new Date(),
  endDate: new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000),
});



    // 4️⃣ Response
    res.status(200).json({
      message: "Subscription successful",
      subscriptionId: subscription.id,
      role,
      plan,
      amount,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Subscription failed", error: error.message });
  }
};







// ------------------ Check Subscription Status ------------------
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





