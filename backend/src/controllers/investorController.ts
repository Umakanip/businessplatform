import { Request, Response } from "express";
import User from "../models/user";
import ConnectionRequest from "../models/connectionrequests";
import Connection from "../models/connection";
import "../models/associations";
import { Op, fn, col, where } from "sequelize";
import Subscription from "../models/subscription";
import Payment from "../models/payment";

// ========================== GET MATCHING IDEALOGISTS ==========================
export const getMatchingIdealogists = async (
  req: Request & { user?: any },
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🔹 Load investor with subscription + payments
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: Subscription,
          as: "subscription",
          include: [{ model: Payment, as: "payments" }],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "investor") {
      return res
        .status(403)
        .json({ message: "Only investors can view idealogists" });
    }

    if (!user.category) {
      return res
        .status(400)
        .json({ message: "Investor has no category selected" });
    }

    const investorId = user.id;

    // 🔑 Match categories
    const categoryCondition = {
      [Op.or]: user.category.map((cat: string) =>
        where(fn("JSON_CONTAINS", col("category"), JSON.stringify(cat)), 1)
      ),
    };

    // ✅ Fetch ALL idealogists with their subscription status
    const idealogists = await User.findAll({
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
          required: false,
          include: [
            {
              model: Payment,
              as: "payments",
              where: { status: "success" },
              required: false,
            },
          ],
        },
        {
          model: ConnectionRequest,
          as: "requestsReceived",
          where: { senderId: investorId },
          required: false,
          attributes: ["status"],
        },
        {
          model: ConnectionRequest,
          as: "requestsSent",
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

    // ✅ Format response
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

      // Idea holder subscription status
      const hasActiveSubscription =
        i.subscription &&
        i.subscription.status === "active" &&
        ["lite", "standard", "premium", "pro"].includes(i.subscription.plan) &&
        (!i.subscription.endDate || i.subscription.endDate >= new Date()) &&
        i.subscription.payments?.some((p: any) => p.status === "success");

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
        hasActiveSubscription, // ✅ Key data for the frontend
      };
    });

    // 🚩 Investor's subscription status
const investorHasPaidSubscription =
  user.subscription &&
  user.subscription.status === "active" &&
  ["lite", "standard", "premium", "pro"].includes(user.subscription.plan) &&
  (!user.subscription.endDate || user.subscription.endDate >= new Date()) &&
  user.subscription.payments?.some((p: any) => p.status === "success");

// 🚩 Final filtering logic
let filteredIdealogists = formatted;

// 1. Investor not subscribed => all idea holders visible but locked
if (!investorHasPaidSubscription) {
  // keep as it is
}

// 2. Investor subscribed but idea holder not subscribed => hide them
if (investorHasPaidSubscription) {
  filteredIdealogists = formatted.filter(
    (i: any) => i.hasActiveSubscription === true
  );
}

res.json({
  idealogists: filteredIdealogists,
  investorHasPaidSubscription,
});

  } catch (error) {
    console.error("Get Matching Idealogists error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};