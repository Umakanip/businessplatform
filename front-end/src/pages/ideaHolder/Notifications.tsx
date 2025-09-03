import React from "react";

const Notifications: React.FC = () => {
  const notifications = [
    "Your subscription will expire in 5 days.",
    "Investor A has accepted your connection request.",
    "New plan available: Premium Pro.",
  ];

  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">Notifications</h1>
      <ul className="space-y-2">
        {notifications.map((note, i) => (
          <li key={i} className="p-3 border rounded bg-gray-50">
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
