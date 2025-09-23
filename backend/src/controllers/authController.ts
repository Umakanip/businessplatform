import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user";
import generateToken from "../utils/generateToken";

// ========================== REGISTER ==========================
// export const register = async (req: Request, res: Response) => {
//   try {
//     const { 
//       name, 
//       email, 
//       password, 
//       role, 
//       primaryPhone, 
//       secondaryPhone,
//       categories,
//       bio   // ✅ include bio from request
//     } = req.body;

//     const profileImage = req.file ? req.file.filename : "";

//     if (!name || !email || !password || !role) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Normalize role
//     const normalizedRole = role === "ideaholder" ? "idealogist" : role;

//     // ✅ Bio required only for investors
//     if (normalizedRole === "investor" && (!bio || bio.trim() === "")) {
//       return res.status(400).json({ message: "Investor must provide a bio" });
//     }

//     // Parse categories
//     let parsedCategories: string[] = [];
//     if (categories) {
//       try {
//         parsedCategories = JSON.parse(categories);
//         if (!Array.isArray(parsedCategories)) {
//           return res.status(400).json({ message: "Categories must be an array" });
//         }
//       } catch (err) {
//         return res.status(400).json({ message: "Invalid categories format" });
//       }
//     }

//     const exists = await User.findOne({ where: { email } });
//     if (exists) {
//       return res.status(409).json({ message: "Email already registered" });
//     }

//     const hash = await bcrypt.hash(password, 10);

//     const user = await User.create({ 
//       name, 
//       email, 
//       password: hash, 
//       role: normalizedRole, 
//       primaryPhone, 
//       secondaryPhone, 
//       category: parsedCategories, 
//       profileImage,
//       bio: normalizedRole === "investor" ? bio : null  // ✅ only store for investors
//     });

//     return res.status(201).json({
//       message: "Registered successfully",
//       user
//     });
//   } catch (error) {
//     console.error("Register error:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };
export const register = async (req: Request, res: Response) => {
  try {
    const { 
      name, email, password, role, primaryPhone, secondaryPhone,
      categories, bio, state, city   // ✅ include state & city
    } = req.body;

    const profileImage = req.file ? req.file.filename : "";

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Normalize role
    const normalizedRole = role === "ideaholder" ? "idealogist" : role;

    // Bio required only for investors
    if (normalizedRole === "investor" && (!bio || bio.trim() === "")) {
      return res.status(400).json({ message: "Investor must provide a bio" });
    }

    // Parse categories
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
      profileImage,
      bio: normalizedRole === "investor" ? bio : null,
      state,  // ✅ store state
      city    // ✅ store city
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

    // ✅ Removed subscription check for idealogists

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
export const updateProfile = async (req: Request & { user?: any }, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { name, email, primaryPhone, secondaryPhone, category, bio, password,state,city } = req.body;
    const profileImage = req.file ? req.file.filename : undefined;

    // ✅ Parse categories if it's a JSON string
    let parsedCategories: string[] = [];
    if (category) {
      if (typeof category === "string") {
        try {
          parsedCategories = JSON.parse(category);
          if (!Array.isArray(parsedCategories)) {
            return res.status(400).json({ message: "Categories must be an array" });
          }
        } catch (err) {
          return res.status(400).json({ message: "Invalid categories format" });
        }
      } else if (Array.isArray(category)) {
        parsedCategories = category;
      }
    }

    const updates: any = {
      name,
      email,
      primaryPhone,
      secondaryPhone,
      category: parsedCategories, // ✅ Correctly store as array
      bio,
      state,
      city
    };

    if (password) {
      const hash = await bcrypt.hash(password, 10);
      updates.password = hash;
    }
    if (profileImage) updates.profileImage = profileImage;

    await User.update(updates, { where: { id: req.user.id } });

    const updatedUser = await User.findByPk(req.user.id);
    res.json(updatedUser);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


