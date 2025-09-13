// models/profileview.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class ProfileView extends Model {
  public id!: number;
  public viewerId!: number;
  public ideaHolderId!: number;
}

ProfileView.init(
  {
    viewerId: { type: DataTypes.INTEGER, allowNull: false },
    ideaHolderId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { sequelize, modelName: "profileview" }
);

export default ProfileView;
