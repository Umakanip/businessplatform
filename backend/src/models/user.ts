// import { DataTypes, Model, Optional } from "sequelize";
// import sequelize from "../config/db";

// export type UserRole = "investor" | "idealogist";

// interface UserAttributes {
//   id: number;
//   name: string;
//   email: string;
//   password: string;
//   role: UserRole;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// type UserCreation = Optional<UserAttributes, "id">;

// class User
//   extends Model<UserAttributes, UserCreation>
//   implements UserAttributes
// {
//   public id!: number;
//   public name!: string;
//   public email!: string;
//   public password!: string;
//   public role!: UserRole;

//   public readonly createdAt!: Date;
//   public readonly updatedAt!: Date;
// }

// User.init(
//   {
//     id: {
//       type: DataTypes.INTEGER.UNSIGNED,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     name: {
//       type: DataTypes.STRING(120),
//       allowNull: false,
//     },
//     email: {
//       type: DataTypes.STRING(160),
//       allowNull: false,
//       unique: true,
//     },
//     password: {
//       type: DataTypes.STRING(200),
//       allowNull: false,
//     },
//     role: {
//       type: DataTypes.ENUM("investor", "idealogist"),
//       allowNull: false,
//     },
//   },
//   {
//     sequelize,
//     modelName: "User",
//     tableName: "users",
//     timestamps: true,   // ✅ ensures createdAt / updatedAt
//     underscored: false, // set to true if you prefer created_at
//   }
// );

// export default User;
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
  createdAt?: Date;
  updatedAt?: Date;
}

type UserCreation = Optional<UserAttributes, "id">;

class User
  extends Model<UserAttributes, UserCreation>
  implements UserAttributes
{
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: UserRole;
  public primaryPhone?: string;
  public secondaryPhone?: string;
  public category?: string;
  public profileImage?: string;

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
      type: DataTypes.STRING(200), // store URL or filename
      allowNull: true,
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
