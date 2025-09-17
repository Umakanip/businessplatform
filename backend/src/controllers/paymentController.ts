import { Request, Response } from "express";
import Payment from "../models/payment";
import razorpay from "../utils/razorpay";
import crypto from "crypto";
import Subscription from "../models/subscription";
import { addMonths } from "../utils/dates";
import {
  INVESTOR_MONTHS,
  INVESTOR_TOTAL_PRICE,
  PLAN_TOTAL_PRICE,
  PLAN_PRICE,
  PLAN_MONTHS,
} from "../utils/plan";
import { AuthedRequest } from "../middleware/authMiddleware";

// ---------------- Create Payment
export const createPayment = async (req: AuthedRequest, res: Response) => {
  try {
    const { subscriptionId, amount, status } = req.body;

    // 🔹 Required fields check
    if (subscriptionId === undefined || amount === undefined || !status) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // 🔹 Ensure user is attached by protect middleware
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized: user not found" });
    }

    // 🔹 Create payment with logged-in userId
    const payment = await Payment.create({
      subscriptionId,
      amount,
      status,
      userId: req.user.id, // ✅ attach logged-in userId
    });

    return res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: payment,
    });
  } catch (error: any) {
    console.error("Error creating payment:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


// ---------------- Get all payments
export const getPayments = async (req: Request, res: Response) => {
  try {
    const payments = await Payment.findAll({ order: [["createdAt", "DESC"]] });
    res.json({ success: true, data: payments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Get payment by ID
export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id);

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    res.json({ success: true, data: payment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Update payment status
export const updatePaymentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["success", "failed"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    payment.status = status as any;
    await payment.save();

    res.json({ success: true, message: "Payment status updated", data: payment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Create Razorpay Order
// This creates an order with Razorpay and attaches `notes.subscriptionId` so webhook can map.
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount, currency = "INR", subscriptionId } = req.body;

    if (!amount || !subscriptionId) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const options = {
      amount: Math.round(Number(amount) * 100), // paisa
      currency,
      receipt: `receipt_${subscriptionId}_${Date.now()}`,
      notes: {
        subscriptionId: String(subscriptionId),
      },
    };

    const order = await razorpay.orders.create(options);

    return res.json({ success: true, order });
  } catch (error: any) {
    console.error("Order create error:", error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
};

// ---------------- Verify Razorpay Payment (called from frontend handler after checkout)
// This verifies signature, records payment row with razorpay ids, and marks subscription active.
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      subscriptionId,
      amount,
      role, // optional: 'investor'|'idealogist' (frontend can send for clarity)
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment data" });
    }

    // compute HMAC
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature !== razorpay_signature) {
      // store failed payment
      await Payment.create({
        subscriptionId: subscriptionId ?? null,
        amount: amount ?? 0,
        status: "failed",
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
      } as any);
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // success -> store payment with ids
    const payment = await Payment.create({
      subscriptionId: subscriptionId ?? null,
      amount: amount ?? 0,
      status: "success",
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
    } as any);

    // Update subscription if exists:
    if (subscriptionId) {
      const subscription = await Subscription.findByPk(subscriptionId);
      if (subscription) {
        // For investors: set endDate = now + INVESTOR_MONTHS
        // For idealogists: keep lifetime (null) or respect existing behavior
        // Determine by plan or by role param: safe approach is to inspect subscription.plan
        try {
          const plan = subscription.plan;
          if (plan === "pro") {
            // investor-like 3 months behavior: but if you use 'pro' for idealogists as well, confirm your app logic
            // We'll use INVESTOR_MONTHS if subscription endDate is null and plan indicates time-bound
            const newEnd = addMonths(new Date(), INVESTOR_MONTHS);
            subscription.endDate = newEnd;
            subscription.status = "active";
            await subscription.save();
          } else {
            // treat idealogist plans as lifetime (null endDate)
            subscription.status = "active";
            subscription.endDate = null;
            await subscription.save();
          }
        } catch (err) {
          console.warn("Could not update subscription dates:", err);
        }
      }
    }

    return res.json({ success: true, message: "Payment verified", data: payment });
  } catch (error: any) {
    console.error("Verify error:", error);
    res.status(500).json({ success: false, message: "Payment verification failed", error: error.message });
  }
};

// ---------------- Webhook endpoint (Razorpay will POST here) — most reliable source
export const paymentWebhook = async (req: Request, res: Response) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    const signature = req.headers["x-razorpay-signature"] as string || "";

    // verify webhook signature
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest !== signature) {
      console.warn("Webhook signature mismatch");
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    // handle captured / failed
    if (event === "payment.captured" || event === "payment.authorized") {
      const paymentEntity = payload.payment?.entity;
      if (!paymentEntity) return res.json({ success: true });

      const notes = paymentEntity.notes || {};
      const subscriptionId = notes.subscriptionId ? Number(notes.subscriptionId) : null;
      const amount = (paymentEntity.amount ? Number(paymentEntity.amount) / 100 : 0);
      const razorpayPaymentId = paymentEntity.id;
      const razorpayOrderId = paymentEntity.order_id;

      // create or update Payment record
      await Payment.create({
        subscriptionId,
        amount,
        status: "success",
        razorpayPaymentId,
        razorpayOrderId,
      } as any);

      // update subscription as active
      if (subscriptionId) {
        const subscription = await Subscription.findByPk(subscriptionId);
        if (subscription) {
          // For plans which are time-limited (investor pro), set expiry
          // If your plan mapping differs, adjust here
          if (subscription.plan === "pro") {
            subscription.endDate = addMonths(new Date(), INVESTOR_MONTHS);
            subscription.status = "active";
            await subscription.save();
          } else {
            // idealogist lifetime plan
            subscription.endDate = null;
            subscription.status = "active";
            await subscription.save();
          }
        }
      }
    }

    if (event === "payment.failed") {
      const paymentEntity = payload.payment?.entity;
      if (!paymentEntity) return res.json({ success: true });

      const notes = paymentEntity.notes || {};
      const subscriptionId = notes.subscriptionId ? Number(notes.subscriptionId) : null;
      const amount = (paymentEntity.amount ? Number(paymentEntity.amount) / 100 : 0);
      const razorpayPaymentId = paymentEntity.id;
      const razorpayOrderId = paymentEntity.order_id;

      await Payment.create({
        subscriptionId,
        amount,
        status: "failed",
        razorpayPaymentId,
        razorpayOrderId,
      } as any);

      // optionally mark subscription expired/failed — your choice
      if (subscriptionId) {
        const subscription = await Subscription.findByPk(subscriptionId);
        if (subscription) {
          subscription.status = "expired";
          await subscription.save();
        }
      }
    }

    return res.json({ success: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
