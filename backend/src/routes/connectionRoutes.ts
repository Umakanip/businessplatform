
import express from "express";
import { sendRequest, getRequests, respondRequest ,getMyConnections} from "../controllers/connectionController";
import { protect } from "../middleware/authMiddleware"; // assume JWT middleware

const router = express.Router();

router.post("/send", protect, sendRequest);
router.get("/requests", protect, getRequests);
router.post("/respond", protect, respondRequest);
router.get("/connections/my", protect, getMyConnections);

// router.post("/matching-idealogists", protect, getMatchingIdealogists);

export default router;

