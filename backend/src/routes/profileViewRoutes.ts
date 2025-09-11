import { Router } from "express";
import { incrementViewCount, getViewCount } from "../controllers/profileViewController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/increment", protect, incrementViewCount);
router.get("/:ideaHolderId", protect, getViewCount);

export default router;
