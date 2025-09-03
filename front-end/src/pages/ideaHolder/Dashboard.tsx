import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">Idea Holder Dashboard</h1>
      <p className="text-gray-600">Welcome! Here’s an overview of your ideas and connections.</p>
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-purple-100 p-4 rounded-lg shadow text-center">
          <h2 className="font-semibold text-purple-800">Connections</h2>
          <p className="text-2xl font-bold">15</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow text-center">
          <h2 className="font-semibold text-green-800">Active Plans</h2>
          <p className="text-2xl font-bold">2</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow text-center">
          <h2 className="font-semibold text-yellow-800">Notifications</h2>
          <p className="text-2xl font-bold">7</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
