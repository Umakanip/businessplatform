import React from "react";

const Connections: React.FC = () => {
  const connections = [
    { id: 1, name: "Investor A", status: "Connected" },
    { id: 2, name: "Investor B", status: "Pending" },
    { id: 3, name: "Investor C", status: "Connected" },
  ];

  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">My Connections</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {connections.map((c) => (
            <tr key={c.id} className="text-center">
              <td className="p-2 border">{c.name}</td>
              <td className="p-2 border">{c.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Connections;
