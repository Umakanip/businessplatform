import { Request, Response } from "express";
import Payment from "../models/payment";

// Create Payment
export const createPayment = async (req: Request, res: Response) => {
  try {
    const { subscriptionId, amount, status } = req.body;

    if (!subscriptionId || !amount || !status) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const payment = await Payment.create({ subscriptionId, amount, status });

    return res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: payment
    });
  } catch (error: any) {
    console.error("Error creating payment:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get all payments
export const getPayments = async (req: Request, res: Response) => {
  try {
    const payments = await Payment.findAll({ order: [["createdAt", "DESC"]] });
    res.json({ success: true, data: payments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get payment by ID
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

// Update payment status
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

    payment.status = status;
    await payment.save();

    res.json({ success: true, message: "Payment status updated", data: payment });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
