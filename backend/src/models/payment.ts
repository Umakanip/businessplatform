import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";
import Subscription from "./subscription";

type PaymentStatus = "success" | "failed";

interface PaymentAttributes {
  id: number;
  subscriptionId: number;
  amount: number;
  status: PaymentStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

// Fields not required when creating a new record
type PaymentCreation = Optional<PaymentAttributes, "id" | "status">;

class Payment
  extends Model<PaymentAttributes, PaymentCreation>
  implements PaymentAttributes 
{
  public id!: number;
  public subscriptionId!: number;
  public amount!: number;
  public status!: PaymentStatus;

  // Sequelize adds timestamps automatically
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED, // MySQL unsigned integer
      autoIncrement: true,
      primaryKey: true,
    },
    subscriptionId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2), // precise money values
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("success", "failed"),
      allowNull: false,
      defaultValue: "success",
    },
  },
  {
    sequelize,
    modelName: "Payment",
    tableName: "payments",
    timestamps: true, // ensures createdAt/updatedAt
    underscored: false, // keep camelCase in DB if you want
  }
);

// Associations
Payment.belongsTo(Subscription, { foreignKey: "subscriptionId", as: "subscription" });
Subscription.hasMany(Payment, { foreignKey: "subscriptionId", as: "payments" });

export default Payment;
