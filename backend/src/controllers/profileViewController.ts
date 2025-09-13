import { Request, Response } from "express";
import ProfileView from "../models/ProfileView";
import User from "../models/user";
import Subscription from "../models/subscription";
import { Op } from "sequelize";

// Increment unique view count
export const incrementViewCount = async (req: Request, res: Response) => {
  const { ideaHolderId } = req.body;
  const viewerId = (req as any).user.id; // from protect middleware

  if (!ideaHolderId) {
    return res.status(400).json({ message: "Missing ideaHolderId" });
  }

  try {
    const ideaHolder = await User.findByPk(ideaHolderId);
    if (!ideaHolder) {
      return res.status(404).json({ message: "Idea holder not found" });
    }

    // 🔑 Subscription check
    const subscription = await Subscription.findOne({
      where: {
        userId: viewerId,
        status: "active",
        [Op.or]: [
          { endDate: null },                // no expiry
          { endDate: { [Op.gt]: new Date() } }, // or not expired
        ],
      },
    });

    if (!subscription) {
      return res.status(403).json({
        message: "You need an active subscription to view profiles",
      });
    }

    // check if this viewer already viewed
    const alreadyViewed = await ProfileView.findOne({
      where: { viewerId, ideaHolderId },
    });

    if (!alreadyViewed) {
      // create record
      await ProfileView.create({ viewerId, ideaHolderId });

      // increment count
      ideaHolder.viewCount = (ideaHolder.viewCount || 0) + 1;
      await ideaHolder.save();
    }

    return res.status(200).json({
      message: "View processed",
      viewCount: ideaHolder.viewCount,
    });
  } catch (error) {
    console.error("Error incrementing view count:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get profile view count
export const getViewCount = async (req: Request, res: Response) => {
  const ideaHolderId = parseInt(req.params.ideaHolderId, 10);
  if (!ideaHolderId) {
    return res.status(400).json({ message: "Invalid ideaHolderId" });
  }

  try {
    // count unique viewers
    const count = await ProfileView.count({ where: { ideaHolderId } });

    return res.status(200).json({ viewCount: count });
  } catch (error) {
    console.error("Error getting view count:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
