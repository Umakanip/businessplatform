import User from "./user";
import ConnectionRequest from "./connectionrequests";
import Connection from "./connection";
// ConnectionRequest → User
ConnectionRequest.belongsTo(User, { foreignKey: "senderId", as: "sender" });
ConnectionRequest.belongsTo(User, { foreignKey: "receiverId", as: "receiver" });

// User → ConnectionRequest
User.hasMany(ConnectionRequest, { foreignKey: "senderId", as: "requestsSent" });
User.hasMany(ConnectionRequest, { foreignKey: "receiverId", as: "requestsReceived" });


User.hasMany(Connection, { foreignKey: "user1Id", as: "connectionsAsUser1" });
User.hasMany(Connection, { foreignKey: "user2Id", as: "connectionsAsUser2" });
Connection.belongsTo(User, { foreignKey: "user1Id", as: "user1" });
Connection.belongsTo(User, { foreignKey: "user2Id", as: "user2" });