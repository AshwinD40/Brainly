import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { Content } from "../models/Content.js";

const router = Router();
const buildOwnerQuery = (userId: string) => ({
  $or: [{ userId }, { clerkUserId: userId }],
});

router.post("/createContent", requireAuth, async (req, res) => {
  const authUserId = req.clerkUserId;
  const { title, type, link, tags } = req.body as {
    title?: string;
    type?: string;
    link?: string;
    tags?: unknown;
  };

  if (!authUserId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (!title || !type || !link) {
    res.status(400).json({ message: "title, type, and link are required" });
    return;
  }

  const normalizedTags = Array.isArray(tags)
    ? tags.map((tag) => String(tag).trim()).filter(Boolean)
    : [];

  try {
    const content = await Content.create({
      userId: authUserId,
      clerkUserId: authUserId,
      title: title.trim(),
      type,
      link: link.trim(),
      tags: normalizedTags,
    });

    res.status(201).json({ content });
  } catch (err) {
    res.status(400).json({ message: "Failed to create content", error: err });
  }
});

router.get("/user", requireAuth, async (req, res) => {
  const authUserId = req.clerkUserId;

  if (!authUserId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const contents = await Content.find(buildOwnerQuery(authUserId)).sort({ createdAt: -1 });
    res.json({ contents });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch content", error: err });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  const authUserId = req.clerkUserId;
  const contentId = req.params["id"];

  if (!authUserId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (!contentId) {
    res.status(400).json({ message: "Content id is required" });
    return;
  }

  try {
    const deleted = await Content.findOneAndDelete({
      _id: contentId,
      ...buildOwnerQuery(authUserId),
    });

    if (!deleted) {
      res.status(404).json({ message: "Content not found or not yours" });
      return;
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err });
  }
});

export default router;
