import User from "./user";
import Subscription from "./subscription";
import ConnectionRequest from "./connectionrequests";
import Connection from "./connection";

// 🔹 User ↔ Subscription
User.hasOne(Subscription, { foreignKey: "userId", as: "subscription" });
Subscription.belongsTo(User, { foreignKey: "userId", as: "user" });

// 🔹 User ↔ ConnectionRequest
User.hasMany(ConnectionRequest, { foreignKey: "senderId", as: "requestsSent" });
User.hasMany(ConnectionRequest, { foreignKey: "receiverId", as: "requestsReceived" });
ConnectionRequest.belongsTo(User, { foreignKey: "senderId", as: "sender" });
ConnectionRequest.belongsTo(User, { foreignKey: "receiverId", as: "receiver" });

// 🔹 User ↔ Connection
User.hasMany(Connection, { foreignKey: "user1Id", as: "connectionsAsUser1" });
User.hasMany(Connection, { foreignKey: "user2Id", as: "connectionsAsUser2" });
Connection.belongsTo(User, { foreignKey: "user1Id", as: "user1" });
Connection.belongsTo(User, { foreignKey: "user2Id", as: "user2" });

export { User, Subscription, ConnectionRequest, Connection };
