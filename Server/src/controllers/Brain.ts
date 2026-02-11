import { Request, Response } from "express";
import { User } from "../models/User.js";
import { Content } from "../models/Content.js";
import { nanoid } from "nanoid";

export const shareBrain = async (req: Request, res: Response) => {
  try {
    const userId = req.userId; // Provided by auth middleware

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Return existing shareId if already shared
    if (user.shareId) {
      return res.status(200).json({
        success: true,
        shareId: user.shareId,
        message: "Brain already shared"
      });
    }

    // Create new shareId
    const shareId = nanoid(10); // generate 10 char ID
    user.shareId = shareId;
    await user.save();

    return res.status(200).json({
      success: true,
      shareId: shareId,
      message: "Brain shared successfully"
    });

  } catch (error) {
    console.error("Share Brain Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}

export const getBrain = async (req: Request, res: Response) => {
  try {
    const { shareId } = req.params;

    if (!shareId) {
      return res.status(400).json({
        success: false,
        message: "Invalid share ID"
      });
    }

    // Find user by shareId
    const user = await User.findOne({ shareId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Brain not found"
      });
    }

    // Find content for this user
    const contents = await Content.find({ userId: user._id.toString() }) // Ensure string comparison
      .sort({ createdAt: -1 });
      
    return res.status(200).json({
      success: true,
      username: user.username,
      contents: contents,
      message: "Brain fetched successfully"
    });

  } catch (error) {
    console.error("Get Brain Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}
