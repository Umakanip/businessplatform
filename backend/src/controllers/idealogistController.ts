import { Request, Response } from "express";
import User from "../models/user";

// Idealogists should NOT see other idealogists; they see investors
export const listInvestorsForIdealogist = async (_req: Request, res: Response) => {
  try {
    const investors = await User.findAll({
      where: { role: "investor" },
      attributes: ["id", "name", "email", "role", "createdAt"],
    });

    if (!investors || investors.length === 0) {
      return res.status(404).json({ message: "No investors found" });
    }

    return res.status(200).json(investors);
  } catch (error) {
    console.error("Error fetching investors:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getInvestorsByCategory = async (req: Request & { user?: any }, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role !== "idealogist") {
      return res.status(403).json({ message: "Only idealogists can access this resource" });
    }

    // Fetch fresh user from DB (because token doesn't have category always)
    const idealogist = await User.findByPk(req.user.id);

    if (!idealogist || !idealogist.category) {
      return res.status(400).json({ message: "Idealogist does not have a category set" });
    }

    const investors = await User.findAll({
      where: { role: "investor", category: idealogist.category },
      attributes: ["id", "name", "email", "category", "profileImage"],
    });

    return res.status(200).json({ investors });
  } catch (error) {
    console.error("Fetch investors error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
