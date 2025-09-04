import { Router } from "express";
import { login, me, register } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";
const router = Router();
import upload from "../middleware/uploads";

router.post("/register", upload.single("profileImage"), register);

router.post("/login", login);
router.get("/me", protect, me);

router.post("/test", (req, res) => {
  res.json({ message: "Route works!" });
});

export default router;
