import { Router } from "express";
import { protect, requireRole } from "../middleware/authMiddleware";
import { listInvestorsForIdealogist, getInvestorsByCategory } from "../controllers/idealogistController";

const router = Router();

// idealogist can see all investors (protect also checks active subscription)
router.get("/investors", protect, requireRole("idealogist"), listInvestorsForIdealogist);

router.get("investors/category", protect, getInvestorsByCategory);

export default router;
