import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { 
  createContent,
  getContentByUser,
  deleteContent
 } from "../controllers/Content.js";

const router = Router();

router.post("/createContent", auth, createContent);
router.get("/user", auth, getContentByUser);
router.delete("/:id", auth, deleteContent);

export default router;
