import { Router } from "express";
import { protect, requireRole } from "../middleware/authMiddleware";
import { listInvestorsForIdealogist, getInvestorsByCategory, toggleConnect, getConnectedInvestorsByCategory,getMatchingInvestors } from "../controllers/idealogistController";

const router = Router();

// idealogist can see all investors (protect also checks active subscription)
router.get("/investors", protect, requireRole("idealogist"), listInvestorsForIdealogist);
router.get("/matching-investors", protect, getMatchingInvestors);

router.get("/investors/category", protect, getInvestorsByCategory);
router.post("/investors/:investorId/toggle-connect", protect, toggleConnect);
router.get("/category/connected", protect, getConnectedInvestorsByCategory);
export default router;
