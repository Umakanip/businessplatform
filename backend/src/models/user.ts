import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";
import ConnectionRequest from "../models/connectionrequests"; // import connection request model

export type UserRole = "investor" | "idealogist";

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  primaryPhone?: string;
  secondaryPhone?: string;
  category?: string[];
  profileImage?: string;
  bio?: string;        // ✅ add this
  connect?: number;
  createdAt?: Date;
  updatedAt?: Date;
}


type UserCreation = Optional<UserAttributes, "id" | "connect">;

class User extends Model<UserAttributes, UserCreation> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: UserRole;
  public primaryPhone?: string;
  public secondaryPhone?: string;
  public category!: string[]; 
  public profileImage?: string;
  public connect?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(160), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(200), allowNull: false },
    role: { type: DataTypes.ENUM("investor", "idealogist"), allowNull: false },
    primaryPhone: { type: DataTypes.STRING(20), allowNull: true },
    secondaryPhone: { type: DataTypes.STRING(20), allowNull: true },
    // category: { type: DataTypes.STRING(100), allowNull: true },
    category: {
  type: DataTypes.JSON, // 👈 instead of STRING
  allowNull: true,
  
},

    profileImage: { type: DataTypes.STRING(200), allowNull: true },
     bio: {                                    // 👈 NEW FIELD
      type: DataTypes.STRING(250),            // max 250 characters
      allowNull: true,                        // optional
    },
    connect: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  { sequelize, modelName: "User", tableName: "users", timestamps: true }
);

// 🔹 Add these reverse associations
User.hasMany(ConnectionRequest, { foreignKey: "senderId", as: "sentRequests" });
User.hasMany(ConnectionRequest, { foreignKey: "receiverId", as: "receivedRequests" });

export default User;

