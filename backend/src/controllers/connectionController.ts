
import { Request, Response } from "express";
import { Op } from "sequelize";
import ConnectionRequest from "../models/connectionrequests";
import User from "../models/user";
import "../models/associations";
import Connection from "../models/connection";
import { sendEmail } from "../utils/sendEmail";
import dotenv from "dotenv";
dotenv.config();

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
    await exists.destroy(); // delete old one
  }
}


    // ✅ Create request
    const request = await ConnectionRequest.create({ senderId, receiverId });

    // 🔹 Fetch sender & receiver details
    const sender = await User.findByPk(senderId);
    const receiver = await User.findByPk(receiverId);

    if (receiver && sender) {
 const baseUrl = process.env.BACKEND_URL; // example: http://192.168.18.173:5000

const acceptUrl = `${baseUrl}/api/connections/respond?requestId=${request.id}&action=accept`;
const rejectUrl = `${baseUrl}/api/connections/respond?requestId=${request.id}&action=reject`;

  await sendEmail(
    receiver.email,
    "New Connection Request",
    `${sender.name} has sent you a connection request.`,
    `
      <p>Hi ${receiver.name},</p>
      <p><b>${sender.name}</b> has sent you a connection request on Business Platform.</p>
      <p>Please respond below:</p>
      <a href="${acceptUrl}" 
         style="background-color: #4CAF50; color: white; padding: 10px 20px;
                text-decoration: none; border-radius: 5px; margin-right: 10px;">
         ✅ Accept
      </a>
      <a href="${rejectUrl}" 
         style="background-color: #f44336; color: white; padding: 10px 20px;
                text-decoration: none; border-radius: 5px;">
         ❌ Ignore
      </a>
      <br><br>
      <p>Regards,<br/>Business Platform Team</p>
    `
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
    console.log("req.query:", req.query);
    console.log("req.body:", req.body);

    const requestId = req.body?.requestId || req.query?.requestId;
    const action = req.body?.action || req.query?.action;

    if (!requestId || !action) {
      return res.send("<h2>⚠️ Missing requestId or action</h2>");
    }

    const request = await ConnectionRequest.findByPk(requestId);
    if (!request) return res.send("<h2>❌ Request not found</h2>");

    // Fetch sender & receiver
    const sender = await User.findByPk(request.senderId);
    const receiver = await User.findByPk(request.receiverId);
    if (!sender || !receiver) {
      return res.send("<h2>❌ Sender or Receiver not found</h2>");
    }

    if (action === "accept") {
      request.status = "accepted";
      await request.save();

      // ** New check to prevent duplicate connections **
      const existingConnection = await Connection.findOne({
        where: {
          [Op.or]: [
            { user1Id: request.senderId, user2Id: request.receiverId },
            { user1Id: request.receiverId, user2Id: request.senderId },
          ],
        },
      });

      if (!existingConnection) {
        await Connection.create({
          user1Id: request.senderId,
          user2Id: request.receiverId,
        });
      }

      // Notify sender via email
      await sendEmail(
        sender.email,
        "Connection Accepted 🎉",
        `${receiver.name} has accepted your connection request.`,
        `<p>Hi ${sender.name},</p>
         <p><b>${receiver.name}</b> has accepted your connection request.</p>
         <p>You are now connected on Business Platform 🚀</p>`
      );

      // 👇 HTML response instead of JSON
      return res.send(`
        <div style="text-align:center; margin-top:50px; font-family:sans-serif;">
          <h2 style="color:green;">✅ Connection Request Accepted</h2>
          <p>You are now connected with <b>${sender.name}</b> 🎉</p>
        </div>
      `);
    }

    if (action === "reject") {
      request.status = "rejected";
      await request.save();

      await sendEmail(
        sender.email,
        "Connection Request Rejected ❌",
        `${receiver.name} has rejected your connection request.`,
        `<p>Hi ${sender.name},</p>
         <p>Unfortunately, <b>${receiver.name}</b> has rejected your connection request.</p>`
      );

      return res.send(`
        <div style="text-align:center; margin-top:50px; font-family:sans-serif;">
          <h2 style="color:red;">❌ Connection Request Rejected</h2>
          <p>The request from <b>${sender.name}</b> was dismissed.</p>
        </div>
      `);
    }

    return res.send("<h2>⚠️ Invalid action</h2>");
  } catch (err) {
    console.error(err);
    res.send("<h2>❌ Something went wrong</h2>");
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
