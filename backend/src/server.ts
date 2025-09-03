import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./models";
import authRoutes from "./routes/authRoutes";
import investorRoutes from "./routes/investorRoutes";
import idealogistRoutes from "./routes/idealogistRoutes";
import subscriptionRoutes from "./routes/subscriptionRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/investors", investorRoutes);
app.use("/api/idealogists", idealogistRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

// DB sync & start
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // in dev you can use { alter: true }
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
  } catch (e) {
    console.error("DB connection error:", e);
    process.exit(1);
  }
})();
