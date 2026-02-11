import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { shareBrain, getBrain } from "../controllers/Brain.js";

const router = Router();

// Protected route to enable sharing
router.post("/share", auth, shareBrain);

// Public route to view shared brain
router.get("/:shareId", getBrain);

export default router;
