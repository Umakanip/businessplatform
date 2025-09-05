
import { Request, Response } from "express";
import User from "../models/user";

// Investors should NOT see other investors; they see only idealogists
export const listIdealogistsForInvestor = async (_req: Request, res: Response) => {
  try {
    const idealogists = await User.findAll({
      where: { role: "idealogist" },
      attributes: ["id", "name", "email", "role", "createdAt"],
    });

    return res.status(200).json({
      success: true,
      data: idealogists,
    });
  } catch (error) {
    console.error("Error fetching idealogists:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch idealogists",
    });
  }
};
// ========================== MATCH IDEALOGISTS BY CATEGORY ==========================
export const getMatchingIdealogists = async (req: Request & { user?: any }, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // get logged-in user
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // only investors should fetch idealogists
    if (user.role !== "investor") {
      return res.status(403).json({ message: "Only investors can view matching idealogists" });
    }

    if (!user.category) {
      return res.status(400).json({ message: "Investor has no category selected" });
    }

    // find all idealogists in same category
    const idealogists = await User.findAll({
      where: { role: "idealogist", category: user.category },
      attributes: ["id", "name", "email", "category", "profileImage", "primaryPhone"], // safe fields only
    });

    return res.status(200).json({
      category: user.category,
      count: idealogists.length,
      idealogists,
    });
  } catch (error) {
    console.error("Get Matching Idealogists error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
