import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import Subscription from "../models/subscription";
import { isActive } from "../utils/dates";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "investor" | "idealogist";
}

export interface AuthedRequest extends Request {
  user?: AuthUser;
}

export const protect = async (req: AuthedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token required" });
    }

    const token = authHeader.split(" ")[1];
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment");
      return res.status(500).json({ message: "Server misconfiguration" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: number; role: string };

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ Enforce: Idealogists must maintain active subscription
    if (user.role === "idealogist") {
      const sub = await Subscription.findOne({ where: { userId: user.id } });
      if (!sub || !isActive(sub.endDate)) {
        return res.status(403).json({ message: "Subscription required or expired" });
      }
    }

    // Attach minimal safe user info
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error("Protect middleware error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const requireRole =
  (role: "investor" | "idealogist") =>
  (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
