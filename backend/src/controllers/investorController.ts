
import { Request, Response } from "express";
import User from "../models/user";
import ConnectionRequest from "../models/connectionrequests";
import Connection from "../models/connection";
import "../models/associations";
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

    // only investors can fetch
    if (user.role !== "investor") {
      return res.status(403).json({ message: "Only investors can view matching idealogists" });
    }

    if (!user.category) {
      return res.status(400).json({ message: "Investor has no category selected" });
    }

    const investorId = user.id;

    // find idealogists in same category + join connections
    const idealogists = await User.findAll({
      where: { role: "idealogist", category: user.category },
      attributes: ["id", "name", "email", "category", "profileImage", "primaryPhone"],
      include: [
        {
          model: ConnectionRequest,
          as: "receivedRequests",
          where: { senderId: investorId },
          required: false,
          attributes: ["status"],
        },
        {
          model: ConnectionRequest,
          as: "sentRequests",
          where: { receiverId: investorId },
          required: false,
          attributes: ["status"],
        },
        {
          model: Connection,
          as: "connectionsAsUser1",
          where: { user2Id: investorId },
          required: false,
        },
        {
          model: Connection,
          as: "connectionsAsUser2",
          where: { user1Id: investorId },
          required: false,
        },
      ],
    });

    // format output with status
    const formatted = idealogists.map((i: any) => {
      let status: "none" | "pending" | "accepted" | "rejected" = "none";

      // ✅ check connection first
      if (i.connectionsAsUser1?.length > 0 || i.connectionsAsUser2?.length > 0) {
        status = "accepted";
      } else if (i.receivedRequests?.length > 0) {
        status = i.receivedRequests[0].status;
      } else if (i.sentRequests?.length > 0) {
        status = i.sentRequests[0].status;
      }

      return {
        id: i.id,
        name: i.name,
        email: i.email,
        category: i.category,
        profileImage: i.profileImage,
        primaryPhone: i.primaryPhone,
        status,
      };
    });

    return res.status(200).json({
      category: user.category,
      count: formatted.length,
      idealogists: formatted,
    });
  } catch (error) {
    console.error("Get Matching Idealogists error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
