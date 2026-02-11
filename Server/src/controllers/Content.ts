import { RequestHandler } from "express";
import { Content } from "../models/Content.js";
import { CreateContentDTO } from "../dto/content.dto.js";


// Create Content
export const createContent: RequestHandler = async (req, res, next) => {

  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      })
    }

    const { title, type, link, tags } = req.body as CreateContentDTO;

    if (!title || !link) {
      return res.status(400).json({
        success: false,
        message: "Title and Link are required",
      });
    }

    const content = await Content.create({
      title,
      type,
      link,
      tags: tags ?? [],
      userId,
    });

    return res.status(201).json({
      success: true,
      message: "Content created successfully",
      content: {
        id: content._id.toString(),
        title: content.title,
        type: content.type,
        link: content.link,
        tags: content.tags,
      },
    });
  } catch (error) {
    return next(error);
  }
}

// Get Content by User
export const getContentByUser: RequestHandler = async (req, res, next) => {

  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized"
      })
    }

    const contents = await Content.find({ userId })
      .populate("userId", "username")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: contents.length,
      contents,
    });
  } catch (error) {
    return next(error);
  }
}

// Delete Content
export const deleteContent: RequestHandler = async (req, res, next) => {

  try {
    const userId = req.userId;
    const { id: contentId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    if (!contentId) {
      return res.status(400).json({
        success: false,
        message: "Invalid contentId"
      });
    }

    const content = await Content.findById(contentId);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found"
      });
    }

    if (content.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this content"
      });
    }

    await content.deleteOne();

    res.status(200).json({
      success: true,
      message: "Content deleted successfully"
    });
  } catch (error) {
    return next(error);
  }
}