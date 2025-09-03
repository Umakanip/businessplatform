// controllers/userController.ts
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
