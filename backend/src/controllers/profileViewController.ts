import { Request, Response } from "express";
import User from "../models/user";

// Increment view count
export const incrementViewCount = async (req: Request, res: Response) => {
  const { ideaHolderId } = req.body;
  if (!ideaHolderId) {
    return res.status(400).json({ message: "Missing ideaHolderId" });
  }

  try {
    const ideaHolder = await User.findByPk(ideaHolderId);
    if (!ideaHolder) {
      return res.status(404).json({ message: "Idea holder not found" });
    }

    ideaHolder.viewCount = (ideaHolder.viewCount || 0) + 1;
    await ideaHolder.save();

    return res.status(200).json({ message: "View count incremented", viewCount: ideaHolder.viewCount });
  } catch (error) {
    console.error("Error incrementing view count:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const getViewCount = async (req: Request, res: Response) => {
  const ideaHolderId = parseInt(req.params.ideaHolderId, 10);
  if (!ideaHolderId) {
    return res.status(400).json({ message: "Invalid ideaHolderId" });
  }

  try {
    const ideaHolder = await User.findByPk(ideaHolderId, {
      attributes: ["viewCount"]
    });

    if (!ideaHolder) {
      return res.status(404).json({ message: "Idea holder not found" });
    }

    return res.status(200).json({ viewCount: ideaHolder.viewCount || 0 });
  } catch (error) {
    console.error("Error getting view count:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
