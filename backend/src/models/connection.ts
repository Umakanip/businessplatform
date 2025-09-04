import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

interface ConnectionAttributes {
  id: number;
  user1Id: number;
  user2Id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ConnectionCreation extends Optional<ConnectionAttributes, "id"> {}

class Connection
  extends Model<ConnectionAttributes, ConnectionCreation>
  implements ConnectionAttributes
{
  public id!: number;
  public user1Id!: number;
  public user2Id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Connection.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user1Id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    user2Id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  },
  { sequelize, modelName: "connection" }
);

export default Connection;
