
import { Request, Response } from "express";
import User from "../models/user";
import ConnectionRequest from "../models/connectionrequests";
import Connection from "../models/connection";
import "../models/associations";
import { Op, fn, col, where } from "sequelize";
import Subscription from "../models/subscription";

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

    const user = await User.findByPk(req.user.id, {
      include: [{ model: Subscription, as: "subscription" }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "investor") {
      return res.status(403).json({ message: "Only investors can view idealogists" });
    }

    if (!user.category) {
      return res.status(400).json({ message: "Investor has no category selected" });
    }

    const investorId = user.id;
    const isSubscribed =
      user.subscription &&
      user.subscription.status === "active" &&
      user.subscription.endDate >= new Date();

    // 🔑 Base where clause (match categories)
    const categoryCondition = {
      [Op.or]: user.category.map((cat: string) =>
        where(fn("JSON_CONTAINS", col("category"), JSON.stringify(cat)), 1)
      ),
    };

    let idealogists;
    if (isSubscribed) {
      // 🔥 Subscribed investor → show only subscribed idealogists
      idealogists = await User.findAll({
        where: { role: "idealogist", ...categoryCondition },
        attributes: [
          "id",
          "name",
          "email",
          "category",
          "profileImage",
          "primaryPhone",
          "secondaryPhone",
          "role",
          "bio",
        ],
        include: [
          {
            model: Subscription,
            as: "subscription",
            where: {
              status: "active",
              endDate: { [Op.gte]: new Date() },
            },
            required: true,
          },
          // ✅ fixed aliases
          { model: ConnectionRequest, as: "requestsReceived", where: { senderId: investorId }, required: false, attributes: ["status"] },
          { model: ConnectionRequest, as: "requestsSent", where: { receiverId: investorId }, required: false, attributes: ["status"] },
          { model: Connection, as: "connectionsAsUser1", where: { user2Id: investorId }, required: false },
          { model: Connection, as: "connectionsAsUser2", where: { user1Id: investorId }, required: false },
        ],
      });
    } else {
      // 🚫 Free investor → show all idealogists
      idealogists = await User.findAll({
        where: { role: "idealogist", ...categoryCondition },
        attributes: [
          "id",
          "name",
          "email",
          "category",
          "profileImage",
          "primaryPhone",
          "secondaryPhone",
          "role",
          "bio",
        ],
        include: [
          { model: Subscription, as: "subscription", required: false },
          // ✅ fixed aliases
          { model: ConnectionRequest, as: "requestsReceived", where: { senderId: investorId }, required: false, attributes: ["status"] },
          { model: ConnectionRequest, as: "requestsSent", where: { receiverId: investorId }, required: false, attributes: ["status"] },
          { model: Connection, as: "connectionsAsUser1", where: { user2Id: investorId }, required: false },
          { model: Connection, as: "connectionsAsUser2", where: { user1Id: investorId }, required: false },
        ],
      });
    }

    const formatted = idealogists.map((i: any) => {
      let status: "none" | "pending" | "accepted" | "rejected" = "none";
      if (i.connectionsAsUser1?.length > 0 || i.connectionsAsUser2?.length > 0) {
        status = "accepted";
      } else if (i.requestsReceived?.length > 0) {
        status = i.requestsReceived[0].status;
      } else if (i.requestsSent?.length > 0) {
        status = i.requestsSent[0].status;
      }

      const matchingCategories = i.category.filter((c: string) =>
        user.category.includes(c)
      );

      return {
        id: i.id,
        name: i.name,
        email: i.email,
        role: i.role,
        primaryPhone: i.primaryPhone,
        secondaryPhone: i.secondaryPhone,
        profileImage: i.profileImage,
        bio: i.bio,
        category: matchingCategories,
        status,
        isSubscribed: i.subscription && i.subscription.status === "active" && i.subscription.endDate >= new Date(),
      };
    });

    res.json({ idealogists: formatted, isSubscribed });
  } catch (error) {
    console.error("Get Matching Idealogists error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// ========================== MATCH IDEALOGISTS BY CATEGORY ==========================
// export const getMatchingIdealogists = async (req: Request & { user?: any }, res: Response) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const user = await User.findByPk(req.user.id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // only investors can fetch
//     if (user.role !== "investor") {
//       return res.status(403).json({ message: "Only investors can view matching idealogists" });
//     }

//     if (!user.category) {
//       return res.status(400).json({ message: "Investor has no category selected" });
//     }

//     const investorId = user.id;

//     // find idealogists in same category + join connections
//     const idealogists = await User.findAll({
//       where: {
//         role: "idealogist",
//         [Op.or]: user.category.map((cat: string) =>
//           where(fn("JSON_CONTAINS", col("category"), JSON.stringify(cat)), 1)
//         ),
//       },
//       attributes: ["id", "name", "email", "category", "profileImage", "primaryPhone"],
//       include: [
//         {
//           model: ConnectionRequest,
//           as: "receivedRequests",
//           where: { senderId: investorId },
//           required: false,
//           attributes: ["status"],
//         },
//         {
//           model: ConnectionRequest,
//           as: "sentRequests",
//           where: { receiverId: investorId },
//           required: false,
//           attributes: ["status"],
//         },
//         {
//           model: Connection,
//           as: "connectionsAsUser1",
//           where: { user2Id: investorId },
//           required: false,
//         },
//         {
//           model: Connection,
//           as: "connectionsAsUser2",
//           where: { user1Id: investorId },
//           required: false,
//         },
//       ],
//     });

//     // format output with status and first matching category
//     const formatted = idealogists.map((i: any) => {
//       let status: "none" | "pending" | "accepted" | "rejected" = "none";

//       if (i.connectionsAsUser1?.length > 0 || i.connectionsAsUser2?.length > 0) {
//         status = "accepted";
//       } else if (i.receivedRequests?.length > 0) {
//         status = i.receivedRequests[0].status;
//       } else if (i.sentRequests?.length > 0) {
//         status = i.sentRequests[0].status;
//       }

//       // Only include the first matching category
//       const matchingCategory = i.category.find((c: string) =>
//         user.category.includes(c)
//       );

//       return {
//         id: i.id,
//         name: i.name,
//         email: i.email,
//         category: matchingCategory ? [matchingCategory] : [], // only 1 category
//         profileImage: i.profileImage,
//         primaryPhone: i.primaryPhone,
//         status,
//       };
//     });

//     return res.status(200).json({
//       category: user.category,
//       count: formatted.length,
//       idealogists: formatted,
//     });
//   } catch (error) {
//     console.error("Get Matching Idealogists error:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
