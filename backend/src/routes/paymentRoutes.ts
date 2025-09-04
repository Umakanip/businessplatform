import { Router } from "express";
import { createPayment, getPayments, getPaymentById, updatePaymentStatus } from "../controllers/paymentController";

const router = Router();

// POST /api/payments - create new payment
router.post("/", createPayment);

// GET /api/payments - list all payments
router.get("/", getPayments);

// GET /api/payments/:id - get payment by id
router.get("/:id", getPaymentById);

// PUT /api/payments/:id/status - update payment status
router.put("/:id/status", updatePaymentStatus);

export default router;
