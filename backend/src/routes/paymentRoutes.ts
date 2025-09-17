import { Router } from "express";
import { createPayment, getPayments, getPaymentById, updatePaymentStatus,createOrder,verifyPayment,paymentWebhook } from "../controllers/paymentController";
import { protect } from "../middleware/authMiddleware"; // assume JWT middleware
const router = Router();

// POST /api/payments - create new payment
router.post("/", protect, createPayment);

// GET /api/payments - list all payments
router.get("/", getPayments);

// GET /api/payments/:id - get payment by id
router.get("/:id", getPaymentById);

// PUT /api/payments/:id/status - update payment status
router.put("/:id/status", updatePaymentStatus);
// 🔹 Razorpay routes
router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
// ✅ Webhook route (Razorpay will call this)
router.post("/webhook", paymentWebhook);
export default router;
