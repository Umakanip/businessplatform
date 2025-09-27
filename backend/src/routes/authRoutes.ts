import { Router } from "express";
import { login, me, register,getProfile,updateProfile } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";
const router = Router();
import upload from "../middleware/uploads";

router.post("/register", upload.single("profileImage"), register);

router.post("/login", login);
router.get("/me", protect, me);
router.get("/profile/:id", protect, getProfile);
router.put("/profile/:id", protect, upload.single("profileImage"), updateProfile);
router.post("/test", (req, res) => {
  res.json({ message: "Route works!" });
});

export default router;


