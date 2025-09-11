

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

export type PlanType = "lite" | "standard" | "premium";
export type SubscriptionStatus = "active" | "expired";

interface SubscriptionAttributes {
  id: number;
  userId: number;
  plan: PlanType;
  startDate: Date;
  endDate: Date;
  status: SubscriptionStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

type SubscriptionCreation = Optional<SubscriptionAttributes, "id" | "status">;

class Subscription
  extends Model<SubscriptionAttributes, SubscriptionCreation>
  implements SubscriptionAttributes {
  public id!: number;
  public userId!: number;
  public plan!: PlanType;
  public startDate!: Date;
  public endDate!: Date;
  public status!: SubscriptionStatus;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
      type: DataTypes.ENUM("lite", "standard", "premium"),
      allowNull: false,
    },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: false },
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
