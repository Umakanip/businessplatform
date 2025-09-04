import { Request, Response } from "express";
import ConnectionRequest from "../models/connectionrequests";
import Connection from "../models/connection";
import User from "../models/user";

export const sendRequest = async (req: Request, res: Response) => {
  try {
    const senderId = (req as any).user.id;
    const { receiverId } = req.body;

    if (senderId === receiverId) {
      return res.status(400).json({ message: "Cannot connect with yourself" });
    }

    const exists = await ConnectionRequest.findOne({
      where: { senderId, receiverId, status: "pending" },
    });
    if (exists) return res.status(400).json({ message: "Request already sent" });

    const request = await ConnectionRequest.create({ senderId, receiverId });
    return res.json({ message: "Request sent", request });
  } catch (err) {
    return res.status(500).json({ message: "Error sending request", error: err });
  }
};

export const getRequests = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const requests = await ConnectionRequest.findAll({
      where: { receiverId: userId, status: "pending" },
      include: [{ model: User, as: "sender", attributes: ["id", "name", "email"] }],
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Error fetching requests", error: err });
  }
};

export const respondRequest = async (req: Request, res: Response) => {
  try {
    const { requestId, action } = req.body; // action = "accept" or "reject"
    const request = await ConnectionRequest.findByPk(requestId);

    if (!request) return res.status(404).json({ message: "Request not found" });

    if (action === "accept") {
      request.status = "accepted";
      await request.save();
      await Connection.create({
        user1Id: request.senderId,
        user2Id: request.receiverId,
      });
    } else {
      request.status = "rejected";
      await request.save();
    }

    res.json({ message: `Request ${action}ed` });
  } catch (err) {
    res.status(500).json({ message: "Error responding to request", error: err });
  }
};

export const getConnections = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const connections = await Connection.findAll({
      where: { user1Id: userId },
    });
    res.json(connections);
  } catch (err) {
    res.status(500).json({ message: "Error fetching connections", error: err });
  }
};
