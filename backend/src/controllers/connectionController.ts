
import { Request, Response } from "express";
import { Op } from "sequelize";
import ConnectionRequest from "../models/connectionrequests";
import User from "../models/user";
import "../models/associations";
import Connection from "../models/connection";

// Send a connection request
// Send a connection request
export const sendRequest = async (req: Request, res: Response) => {
  try {
    const senderId = (req as any).user.id;
    const { receiverId } = req.body;

    if (senderId === receiverId)
      return res.status(400).json({ message: "Cannot connect with yourself" });

    // 🔍 Check if request already exists (any status)
    const exists = await ConnectionRequest.findOne({
      where: { senderId, receiverId },
    });

    if (exists) {
      if (exists.status === "pending") {
        return res.status(400).json({ message: "Request already sent" });
      }
      if (exists.status === "accepted") {
        return res.status(400).json({ message: "You are already connected" });
      }
      if (exists.status === "rejected") {
        return res.status(400).json({ message: "Request was rejected" });
      }
    }

    // ✅ If no existing request → create new
    const request = await ConnectionRequest.create({ senderId, receiverId });
    res.json({ message: "Request sent", request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending request", error: err });
  }
};

// Get pending connection requests for notifications
export const getRequests = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    console.log("🔍 Logged-in userId:", userId);

    const requests = await ConnectionRequest.findAll({
      where: { receiverId: userId, status: "pending" },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "name", "profileImage"],
        },
      ],
    });

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching requests", error: err });
  }
};
export const respondRequest = async (req: Request, res: Response) => {
  try {
    const { requestId, action } = req.body;
    const request = await ConnectionRequest.findByPk(requestId);

    if (!request) return res.status(404).json({ message: "Request not found" });

    if (action === "accept") {
      request.status = "accepted";
      await request.save();

      // ✅ Store into connections table
      await Connection.create({
        user1Id: request.senderId,
        user2Id: request.receiverId,
      });

      // 🔹 Return the requestId and action
      return res.json({ message: "Request accepted successfully", requestId, action });
    } else if (action === "reject") { // 🔹 You are using "reject" in your frontend, but "ignore" in your backend. Let's make it consistent.
      // request.status = "rejected";
      // await request.save();
      await request.destroy();
      
      return res.json({ message: "Request ignored successfully", requestId, action });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error responding to request", error: err });
  }
};
// Get my connections
export const getMyConnections = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const connections = await Connection.findAll({
      where: {
        [Op.or]: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: [
        {
          model: User,
          as: "user1",
          attributes: ["id", "name", "profileImage", "category"],
        },
        {
          model: User,
          as: "user2",
          attributes: ["id", "name", "profileImage", "category"],
        },
      ],
    });

    // 🔹 Return the "other" user as the connection
    const formatted = connections.map((conn) => {
      const connJson = conn.toJSON() as any;
      const otherUser =
        connJson.user1.id === userId ? connJson.user2 : connJson.user1;

      return {
        id: otherUser.id,
        name: otherUser.name,
        category: otherUser.category,
        profileImage: otherUser.profileImage,
        status: "connected",
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching connections", error: err });
  }
};
