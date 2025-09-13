import { Router } from "express";
import { protect, requireRole } from "../middleware/authMiddleware";
import { getMatchingInvestors } from "../controllers/idealogistController";

const router = Router();

// idealogist can see all investors (protect also checks active subscription)
router.get("/matching-investors", protect, getMatchingInvestors);
export default router;
