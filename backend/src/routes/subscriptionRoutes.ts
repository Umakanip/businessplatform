import { Router } from "express";
import { protect, requireRole } from "../middleware/authMiddleware";
import { status, subscribe, subscribePublic } from "../controllers/subscriptionController";

const router = Router();

// authenticated idealogist subscribe/renew
router.post("/subscribe", protect, requireRole("idealogist"), subscribe as any);
router.get("/status", protect, requireRole("idealogist"), status as any);

// public endpoint so newly registered idealogists without token can pay & activate
router.post("/subscribe-public",protect, subscribePublic);

export default router;
