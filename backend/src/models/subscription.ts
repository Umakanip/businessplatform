

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";
import Payment from "./payment"; // 🔹 add this line
export type PlanType = "lite" | "standard" | "premium" | "pro";
export type SubscriptionStatus = "active" | "expired";

interface SubscriptionAttributes {
  id: number;
  userId: number;
  plan: PlanType;
  startDate: Date;
  endDate: Date | null;       // allow null
  status: SubscriptionStatus; // put on a new line
  createdAt?: Date;
  updatedAt?: Date;
}

type SubscriptionCreation = Optional<SubscriptionAttributes, "id" | "status" | "endDate">;


class Subscription
  extends Model<SubscriptionAttributes, SubscriptionCreation>
  implements SubscriptionAttributes 
{
  public id!: number;
  public userId!: number;
  public plan!: PlanType;
  public startDate!: Date;
  public endDate!: Date | null;
  public status!: SubscriptionStatus;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // 👇 put it here
  public payments?: Payment[];
}



Subscription.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    plan: {
      type: DataTypes.ENUM("lite", "standard", "premium", "pro"),
      allowNull: false,
    },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: true },  // ✅ allow null
    status: {
      type: DataTypes.ENUM("active", "expired"),
      allowNull: false,
      defaultValue: "active",
    },
  },
  {
    sequelize,
    modelName: "Subscription",
    tableName: "subscriptions",
    timestamps: true,
  }
);

export default Subscription;
