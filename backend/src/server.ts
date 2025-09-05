import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./models";
import authRoutes from "./routes/authRoutes";
import investorRoutes from "./routes/investorRoutes";
import idealogistRoutes from "./routes/idealogistRoutes";
import subscriptionRoutes from "./routes/subscriptionRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import connectionRoutes from "./routes/connectionRoutes";
import path from "path";

dotenv.config();

const app = express();

// Configure CORS to allow your React app to send credentials (like cookies)
const corsOptions = {
  // Replace with the exact URL of your React app
  origin: "http://localhost:3000",
  // This is required to allow cookies/credentials to be sent with requests
  credentials: true,
};
app.use(cors(corsOptions));

// This middleware parses the incoming JSON payload from the request body
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/investors", investorRoutes);
app.use("/api/idealogists", idealogistRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use ("/api/payments",paymentRoutes);
app.use("/api/connections", connectionRoutes);
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


