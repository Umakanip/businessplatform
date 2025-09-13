
import { Request, Response } from "express";
import User from "../models/user";
import ConnectionRequest from "../models/connectionrequests";
import Connection from "../models/connection";
import "../models/associations";
import { Op, fn, col, where } from "sequelize";
import Subscription from "../models/subscription";

// ========================== GET MATCHING IDEALOGISTS ==========================
export const getMatchingIdealogists = async (
  req: Request & { user?: any },
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("🔹 Logged in User:", req.user);

    const user = await User.findByPk(req.user.id, {
      include: [{ model: Subscription, as: "subscription" }],
    });

    console.log(
      "🔹 User with subscription include:",
      JSON.stringify(user, null, 2)
    );

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

    // ✅ Fix: allow premium (no endDate) and pro (with endDate)
    const isSubscribed =
      user.subscription &&
      user.subscription.status === "active" &&
      (user.subscription.plan === "premium" ||
        (user.subscription.endDate &&
          user.subscription.endDate >= new Date()));

    // 🔑 Match by categories
    const categoryCondition = {
      [Op.or]: user.category.map((cat: string) =>
        where(fn("JSON_CONTAINS", col("category"), JSON.stringify(cat)), 1)
      ),
    };

    let idealogists;

    if (isSubscribed) {
      // 🔥 Investor has active sub → show only subscribed idealogists
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
              [Op.or]: [
                { plan: "premium" }, // lifetime subs
                { endDate: { [Op.gte]: new Date() } }, // pro active subs
              ],
            },
            required: true, // 👈 only subscribed idealogists
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
    } else {
      // 🚫 Free investor → show all idealogists (even unsubscribed)
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
            required: false, // 👈 include unsubscribed too
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
    }

    // Format result
    const formatted = idealogists.map((i: any) => {
      let status: "none" | "pending" | "accepted" | "rejected" = "none";
      if (
        i.connectionsAsUser1?.length > 0 ||
        i.connectionsAsUser2?.length > 0
      ) {
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
        isSubscribed:
          i.subscription &&
          i.subscription.status === "active" &&
          (i.subscription.plan === "premium" ||
            (i.subscription.endDate &&
              i.subscription.endDate >= new Date())),
      };
    });

    res.json({ idealogists: formatted, isSubscribed });
  } catch (error) {
    console.error("Get Matching Idealogists error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
