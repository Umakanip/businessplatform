import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";
import ConnectionRequest from "../models/connectionrequests";
import Subscription from "../models/subscription";

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
  bio?: string;
  connect?: number;
  createdAt?: Date;
  updatedAt?: Date;
  viewCount?: number;
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
  public bio?: string;
  public connect?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
public viewCount?: number;
  // 👇 Only type hint, not real association
  public subscription?: Subscription;
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
    category: { type: DataTypes.JSON, allowNull: true },
    profileImage: { type: DataTypes.STRING(200), allowNull: true },
    bio: { type: DataTypes.STRING(250), allowNull: true },
    connect: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    viewCount: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  },
  { sequelize, modelName: "User", tableName: "users", timestamps: true }
);

// ❌ DO NOT add associations here
export default User;
