import { Router } from "express";
import { protect, requireRole } from "../middleware/authMiddleware";
import { listIdealogistsForInvestor } from "../controllers/investorController";

const router = Router();

// investor can see all idealogists
router.get("/idealogists", protect, requireRole("investor"), listIdealogistsForInvestor);

export default router;
