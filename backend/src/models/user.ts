import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

export type UserRole = "investor" | "idealogist";

interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  primaryPhone?: string;
  secondaryPhone?: string;
  category?: string;
  profileImage?: string; // we'll store filename or URL
  connect?: number;       // 0 = disconnected, 1 = connected
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
  public category?: string;
  public profileImage?: string;
  public connect?: number;  // 0 or 1

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(160),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("investor", "idealogist"),
      allowNull: false,
    },
    primaryPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    secondaryPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    profileImage: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    connect: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // disconnected by default
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
  }
);

export default User;
