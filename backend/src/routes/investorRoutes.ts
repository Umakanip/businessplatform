import { Router } from "express";
import { protect, requireRole } from "../middleware/authMiddleware";
import { listIdealogistsForInvestor,getMatchingIdealogists } from "../controllers/investorController";

const router = Router();

// investor can see all idealogists
router.get("/idealogists", protect, requireRole("investor"), listIdealogistsForInvestor);
router.get("/matching-idealogists", protect, getMatchingIdealogists);
export default router;
