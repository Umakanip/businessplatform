import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

interface ConnectionRequestAttributes {
  id: number;
  senderId: number;
  receiverId: number;
  status: "pending" | "accepted" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
}

interface ConnectionRequestCreation
  extends Optional<ConnectionRequestAttributes, "id" | "status"> {}

class ConnectionRequest
  extends Model<ConnectionRequestAttributes, ConnectionRequestCreation>
  implements ConnectionRequestAttributes
{
  public id!: number;
  public senderId!: number;
  public receiverId!: number;
  public status!: "pending" | "accepted" | "rejected";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ConnectionRequest.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    senderId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    receiverId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      defaultValue: "pending",
    },
  },
  { sequelize, modelName: "connectionRequest" }
);

export default ConnectionRequest;
