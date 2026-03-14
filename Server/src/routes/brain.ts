import { type Response, Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { Brain } from "../models/Brain.js";
import { Content } from "../models/Content.js";

const router = Router();
const buildOwnerQuery = (userId: string) => ({
  $or: [{ userId }, { clerkUserId: userId }],
});
const setNoStoreHeaders = (res: Response) => {
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    "Surrogate-Control": "no-store",
  });
};

router.post("/share", requireAuth, async (req, res) => {
  const clerkUserId = req.clerkUserId;

  if (!clerkUserId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const brain = await Brain.findOneAndUpdate(
      { clerkUserId },
      { clerkUserId, isShared: true },
      { upsert: true, new: true }
    );

    if (!brain) {
      res.status(500).json({ message: "Failed to create share link" });
      return;
    }

    res.json({ shareId: brain.shareId });
  } catch (err) {
    res.status(500).json({ message: "Failed to share brain", error: err });
  }
});

router.post("/unshare", requireAuth, async (req, res) => {
  const clerkUserId = req.clerkUserId;

  if (!clerkUserId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    await Brain.findOneAndUpdate({ clerkUserId }, { isShared: false });
    res.json({ message: "Brain is now private" });
  } catch (err) {
    res.status(500).json({ message: "Failed to unshare brain", error: err });
  }
});

router.get("/:shareId", async (req, res) => {
  try {
    setNoStoreHeaders(res);

    const brain = await Brain.findOne({
      shareId: req.params.shareId?.trim(),
      isShared: true,
    });

    if (!brain) {
      res.status(404).json({ message: "Shared brain not found or no longer public" });
      return;
    }

    const contents = await Content.find(buildOwnerQuery(brain.clerkUserId))
      .sort({
        createdAt: -1,
      })
      .lean();

    res.json({
      shareId: brain.shareId,
      contentCount: contents.length,
      contents,
      updatedAt: brain.updatedAt,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load shared brain", error: err });
  }
});

export default router;
