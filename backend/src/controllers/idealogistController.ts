
import { Request, Response } from "express";
import User from "../models/user";
import ConnectionRequest from "../models/connectionrequests";
import Connection from "../models/connection";
import "../models/associations";

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
// ========================== MATCH INVESTORS BY CATEGORY ==========================
export const getMatchingInvestors = async (req: Request & { user?: any }, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // only idealogists can fetch
    if (user.role !== "idealogist") {
      return res.status(403).json({ message: "Only idealogists can view matching investors" });
    }

    if (!user.category) {
      return res.status(400).json({ message: "Idealogist has no category selected" });
    }

    const idealogistId = user.id;

    // find investors in same category + join connections
    const investors = await User.findAll({
      where: { role: "investor", category: user.category },
      attributes: ["id", "name", "email", "category", "profileImage", "primaryPhone"],
      include: [
        {
          model: ConnectionRequest,
          as: "receivedRequests",
          where: { senderId: idealogistId },
          required: false,
          attributes: ["status"],
        },
        {
          model: ConnectionRequest,
          as: "sentRequests",
          where: { receiverId: idealogistId },
          required: false,
          attributes: ["status"],
        },
        {
          model: Connection,
          as: "connectionsAsUser1",
          where: { user2Id: idealogistId },
          required: false,
        },
        {
          model: Connection,
          as: "connectionsAsUser2",
          where: { user1Id: idealogistId },
          required: false,
        },
      ],
    });

    // format output with status
    const formatted = investors.map((i: any) => {
      let status: "none" | "pending" | "accepted" | "rejected" = "none";

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
      investors: formatted,
    });
  } catch (error) {
    console.error("Get Matching Investors error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
