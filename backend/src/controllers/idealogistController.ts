
import { Request, Response } from "express";
import User from "../models/user";
import ConnectionRequest from "../models/connectionrequests";
import Connection from "../models/connection";
import "../models/associations";
import { Op, fn, col, where } from "sequelize";

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



// ========================== MATCH INVESTORS BY CATEGORY ==========================

import Subscription from "../models/subscription";
import { isActive } from "../utils/dates";

// ========================== MATCH INVESTORS BY CATEGORY ==========================

export const getMatchingInvestors = async (req: Request & { user?: any }, res: Response) => {
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

    if (user.role !== "idealogist") {
      return res.status(403).json({ message: "Only idealogists can view investors" });
    }

    if (!user.category) {
      return res.status(400).json({ message: "Idealogist has no category selected" });
    }

    const idealogistId = user.id;
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

    let investors;
    if (isSubscribed) {
      // 🔥 Subscribed idealogist → show only subscribed investors
      investors = await User.findAll({
        where: { role: "investor", ...categoryCondition },
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
          // ✅ Fixed aliases
          { model: ConnectionRequest, as: "requestsReceived", where: { senderId: idealogistId }, required: false, attributes: ["status"] },
          { model: ConnectionRequest, as: "requestsSent", where: { receiverId: idealogistId }, required: false, attributes: ["status"] },
          { model: Connection, as: "connectionsAsUser1", where: { user2Id: idealogistId }, required: false },
          { model: Connection, as: "connectionsAsUser2", where: { user1Id: idealogistId }, required: false },
        ],
      });
    } else {
      // 🚫 Free idealogist → show all investors (even without subscription)
      investors = await User.findAll({
        where: { role: "investor", ...categoryCondition },
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
          // ✅ Fixed aliases
          { model: ConnectionRequest, as: "requestsReceived", where: { senderId: idealogistId }, required: false, attributes: ["status"] },
          { model: ConnectionRequest, as: "requestsSent", where: { receiverId: idealogistId }, required: false, attributes: ["status"] },
          { model: Connection, as: "connectionsAsUser1", where: { user2Id: idealogistId }, required: false },
          { model: Connection, as: "connectionsAsUser2", where: { user1Id: idealogistId }, required: false },
        ],
      });
    }

    const formatted = investors.map((i: any) => {
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

    res.json({ investors: formatted, isSubscribed });
  } catch (error) {
    console.error("Get Matching Investors error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



