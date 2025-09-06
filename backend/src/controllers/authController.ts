import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user";
import Subscription from "../models/subscription";
import generateToken from "../utils/generateToken";
import { isActive } from "../utils/dates";

// ========================== REGISTER ==========================
export const register = async (req: Request, res: Response) => {
  try {
    const { 
      name, 
      email, 
      password, 
      role, 
      primaryPhone, 
      secondaryPhone,
      categories 
    } = req.body;

    const profileImage = req.file ? req.file.filename : "";

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Normalize role
    const normalizedRole = role === "ideaholder" ? "idealogist" : role;

    // Parse categories (array sent as JSON string from frontend)
    let parsedCategories: string[] = [];
    if (categories) {
      try {
        parsedCategories = JSON.parse(categories); 
        if (!Array.isArray(parsedCategories)) {
          return res.status(400).json({ message: "Categories must be an array" });
        }
      } catch (err) {
        return res.status(400).json({ message: "Invalid categories format" });
      }
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({ 
      name, 
      email, 
      password: hash, 
      role: normalizedRole, 
      primaryPhone, 
      secondaryPhone, 
      category: parsedCategories, 
      profileImage 
    });

    return res.status(201).json({
      message: "Registered successfully",
      user
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ========================== LOGIN ==========================
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Idealogists must have an ACTIVE subscription
    if (user.role === "idealogist") {
      const sub = await Subscription.findOne({ where: { userId: user.id } });
      if (!sub || !isActive(sub.endDate)) {
        return res.status(403).json({
          message: "Active subscription required to login",
          hint: "Use /api/subscriptions/subscribe-public to activate.",
        });
      }
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    let investors: any[] = [];
    if (user.role === "idealogist") {
      if (!user.category) {
        return res.status(400).json({ message: "Idealogist does not have a category set" });
      }

      // Fetch investors with same category
      investors = await User.findAll({
        where: { role: "investor", category: user.category },
        attributes: ["id", "name", "email", "category", "profileImage"]
      });
    }

    return res.status(200).json({
      token,
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        category: user.category || null 
      },
      investors // empty if role != idealogist
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ========================== ME ==========================
export const me = async (req: Request & { user?: any }, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id, name, email, role } = req.user;
    return res.status(200).json({ id, name, email, role });
  } catch (error) {
    console.error("Me error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// ========================== GET PROFILE ==========================
export const getProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Never send hashed password
    const { password, ...userData } = user.get({ plain: true });

    return res.status(200).json(userData);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ========================== UPDATE PROFILE ==========================
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // New values from frontend
    const { name, primaryPhone, secondaryPhone, category, email, password } = req.body;
    const profileImage = req.file ? req.file.filename : user.profileImage;

    // Check if email already exists (if updated)
    if (email && email !== user.email) {
      const exists = await User.findOne({ where: { email } });
      if (exists) {
        return res.status(409).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    // Update basic fields
    user.name = name || user.name;
    user.primaryPhone = primaryPhone || user.primaryPhone;
    user.secondaryPhone = secondaryPhone || user.secondaryPhone;
    user.profileImage = profileImage;

    // Parse categories if sent
    if (category) {
      try {
        const parsedCategories = JSON.parse(category);
        if (!Array.isArray(parsedCategories)) {
          return res.status(400).json({ message: "Categories must be an array" });
        }
        user.category = parsedCategories;
      } catch (err) {
        return res.status(400).json({ message: "Invalid categories format" });
      }
    }

    // Password update (hash)
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      user.password = hash;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        primaryPhone: user.primaryPhone,
        secondaryPhone: user.secondaryPhone,
        category: user.category,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
