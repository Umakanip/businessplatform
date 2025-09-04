import { Router } from "express";
import { sendRequest, getRequests, respondRequest, getConnections } from "../controllers/connectionController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/send", protect, sendRequest);
router.get("/requests", protect, getRequests);
router.post("/respond", protect, respondRequest);
router.get("/list", protect, getConnections);

export default router;
