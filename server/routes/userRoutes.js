import { Router } from "express";
import { registerUser, loginUser, userProfile } from "../controllers/userController.js";
import { protectedRoute } from "../middlewares/authMiddlewae.js";

const router = Router();

// ../api/v1/user
router.post("/create", registerUser);
router.post("/login", loginUser);
router.get("/profile", protectedRoute, userProfile);

export default router;
