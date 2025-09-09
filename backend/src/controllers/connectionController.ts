
import { Request, Response } from "express";
import { Op } from "sequelize";
import ConnectionRequest from "../models/connectionrequests";
import User from "../models/user";
import "../models/associations";
import Connection from "../models/connection";
import { sendEmail } from "../utils/sendEmail";

// Send a connection request
export const sendRequest = async (req: Request, res: Response) => {
  try {
    const senderId = (req as any).user.id;
    const { receiverId } = req.body;

    if (senderId === receiverId)
      return res.status(400).json({ message: "Cannot connect with yourself" });

    // 🔍 Check if request already exists
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

    // ✅ Create request
    const request = await ConnectionRequest.create({ senderId, receiverId });

    // 🔹 Fetch sender & receiver details
    const sender = await User.findByPk(senderId);
    const receiver = await User.findByPk(receiverId);

    if (receiver && sender) {
      // Send email to receiver
      await sendEmail(
        receiver.email,
        "New Connection Request",
        `${sender.name} has sent you a connection request.`,
        `<p>Hi ${receiver.name},</p>
         <p><b>${sender.name}</b> has sent you a connection request on Business Platform.</p>
         <p>Login to your account to accept or reject the request.</p>
         <br>
         <p>Regards,<br/>Business Platform Team</p>`
      );
    }

    res.json({ message: "Request sent & email delivered", request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending request", error: err });
  }
};

export const respondRequest = async (req: Request, res: Response) => {
  try {
    const { requestId, action } = req.body;
    const request = await ConnectionRequest.findByPk(requestId);

    if (!request) return res.status(404).json({ message: "Request not found" });

    // Fetch sender & receiver
    const sender = await User.findByPk(request.senderId);
    const receiver = await User.findByPk(request.receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "Sender or receiver not found" });
    }

    if (action === "accept") {
      request.status = "accepted";
      await request.save();

      // ✅ Add to connections table
      await Connection.create({
        user1Id: request.senderId,
        user2Id: request.receiverId,
      });

      // ✅ Send email to sender that request was accepted
      await sendEmail(
        sender.email,
        "Connection Accepted 🎉",
        `${receiver.name} has accepted your connection request.`,
        `<p>Hi ${sender.name},</p>
         <p><b>${receiver.name}</b> has accepted your connection request.</p>
         <p>You are now connected on Business Platform 🚀</p>
         <br>
         <p>Regards,<br/>Business Platform Team</p>`
      );

      return res.json({ message: "Request accepted successfully", requestId, action });
    } 
    
    else if (action === "reject") {
      // ❌ either mark as rejected or delete
      await request.destroy();

      // ✅ Send email to sender that request was rejected
      await sendEmail(
        sender.email,
        "Connection Request Rejected ❌",
        `${receiver.name} has rejected your connection request.`,
        `<p>Hi ${sender.name},</p>
         <p>Unfortunately, <b>${receiver.name}</b> has rejected your connection request.</p>
         <p>You can try connecting with other people on the platform.</p>
         <br>
         <p>Regards,<br/>Business Platform Team</p>`
      );

      return res.json({ message: "Request rejected successfully", requestId, action });
    }

    return res.status(400).json({ message: "Invalid action" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error responding to request", error: err });
  }
};
// Get pending connection requests for notifications
export const getRequests = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
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
