import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";
import Subscription from "./subscription";

type PaymentStatus = "success" | "failed";

interface PaymentAttributes {
  id: number;
  subscriptionId: number;
   userId: number; 
  amount: number;
  status: PaymentStatus;
  razorpayPaymentId?: string;  // 🔹 New
  razorpayOrderId?: string;    // 🔹 New
  createdAt?: Date;
  updatedAt?: Date;
}

// Fields not required when creating a new record
type PaymentCreation = Optional<
  PaymentAttributes,
  "id" | "status" | "razorpayPaymentId" | "razorpayOrderId"
>;

class Payment
  extends Model<PaymentAttributes, PaymentCreation>
  implements PaymentAttributes
{
  public id!: number;
  public subscriptionId!: number;
  public amount!: number;
  public status!: PaymentStatus;
 public userId!: number;
  public razorpayPaymentId?: string; // 🔹 New
  public razorpayOrderId?: string;   // 🔹 New

  // Sequelize adds timestamps automatically
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  
}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    subscriptionId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    // 🔹 Ithu inge add pannum
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("success", "failed"),
      allowNull: false,
      defaultValue: "success",
    },
    razorpayPaymentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    razorpayOrderId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Payment",
    tableName: "payments",
    timestamps: true,
    underscored: false,
  }
);



export default Payment;
