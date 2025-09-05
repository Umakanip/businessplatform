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
      attributes: ["id", "name", "email", "category", "profileImage", "connect"],
    });

    return res.status(200).json({ investors });
  } catch (error) {
    console.error("Fetch investors error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Toggle connect/unconnect
export const toggleConnect = async (req: Request & { user?: any }, res: Response) => {
  try {
    const { investorId } = req.params;

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const investor = await User.findByPk(investorId);
    if (!investor) return res.status(404).json({ message: "Investor not found" });

    // Toggle connect (0 -> 1, 1 -> 0)
    investor.connect = investor.connect === 1 ? 0 : 1;
    await investor.save();

    return res.status(200).json({ id: investor.id, connect: investor.connect });
  } catch (error) {
    console.error("Toggle connect error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get only connected investors by category
export const getConnectedInvestorsByCategory = async (req: Request & { user?: any }, res: Response) => {
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

    const connectedInvestors = await User.findAll({
      where: { role: "investor", category: idealogist.category, connect: 1 },
      attributes: ["id", "name", "email", "category", "profileImage", "connect"],
    });

    if (!connectedInvestors || connectedInvestors.length === 0) {
      return res.status(404).json({ message: "No connected investors found" });
    }

    return res.status(200).json({ investors: connectedInvestors });
  } catch (error) {
    console.error("Fetch connected investors error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
