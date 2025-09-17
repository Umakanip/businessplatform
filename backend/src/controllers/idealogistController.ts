import { Request, Response } from "express";
import User from "../models/user";
import ConnectionRequest from "../models/connectionrequests";
import Connection from "../models/connection";
import "../models/associations";
import { Op, fn, col, where } from "sequelize";
import Subscription from "../models/subscription";
import Payment from "../models/payment";

// ========================== MATCH INVESTORS BY CATEGORY ==========================

export const getMatchingInvestors = async (
  req: Request & { user?: any },
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🔹 Fetch idealogist with subscription + payments
    const idealogist = await User.findByPk(req.user.id, {
      include: [
        {
          model: Subscription,
          as: "subscription",
          include: [{ model: Payment, as: "payments" }],
        },
      ],
    });

    if (!idealogist) {
      return res.status(404).json({ message: "User not found" });
    }

    if (idealogist.role !== "idealogist") {
      return res
        .status(403)
        .json({ message: "Only idealogists can view investors" });
    }

    if (!idealogist.category) {
      return res
        .status(400)
        .json({ message: "Idealogist has no category selected" });
    }

    const idealogistId = idealogist.id;

    // 🚩 Check if idealogist has active + paid subscription
    const idealogistHasPaidSubscription =
      idealogist.subscription &&
      idealogist.subscription.status === "active" &&
      ["lite", "standard", "premium"].includes(idealogist.subscription.plan) &&
      (!idealogist.subscription.endDate ||
        idealogist.subscription.endDate >= new Date()) &&
      idealogist.subscription.payments?.some((p: any) => p.status === "success");

    // 🔑 Match categories
    const categoryCondition = {
      [Op.or]: idealogist.category.map((cat: string) =>
        where(fn("JSON_CONTAINS", col("category"), JSON.stringify(cat)), 1)
      ),
    };

    // ✅ Fetch all investors
    let investors = await User.findAll({
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
          where: { senderId: idealogistId },
          required: false,
          attributes: ["status"],
        },
        {
          model: ConnectionRequest,
          as: "requestsSent",
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

    // ✅ Format response
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
        idealogist.category.includes(c)
      );

      // 🚩 Investor subscription rule → ONLY pro is valid
      const investorHasActiveSubscription =
        i.subscription &&
        i.subscription.status === "active" &&
        i.subscription.plan === "pro" &&
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
        hasActiveSubscription: investorHasActiveSubscription, // ✅ frontend will use this
      };
    });

    // 🚩 Apply lock/unlock filtering rules
    let filteredInvestors = formatted;

    // 1. If idealogist has no paid subscription → keep all, but locked
    if (!idealogistHasPaidSubscription) {
      // do nothing → frontend locks them
    }

    // 2. If idealogist subscribed + paid → show only paid investors (pro)
    if (idealogistHasPaidSubscription) {
      filteredInvestors = formatted.filter(
        (i: any) => i.hasActiveSubscription === true
      );
    }

    res.json({
      investors: filteredInvestors,
      idealogistHasPaidSubscription,
    });
  } catch (error) {
    console.error("Get Matching Investors error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
