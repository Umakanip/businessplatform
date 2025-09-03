import React from "react";

const Investments: React.FC = () => {
  const investments = [
    { id: 1, project: "Startup A", amount: "₹50,000", status: "Ongoing" },
    { id: 2, project: "Startup B", amount: "₹1,20,000", status: "Completed" },
  ];

  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <h1 className="text-2xl font-bold text-green-700 mb-4">My Investments</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Project</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {investments.map((inv) => (
            <tr key={inv.id} className="text-center">
              <td className="p-2 border">{inv.project}</td>
              <td className="p-2 border">{inv.amount}</td>
              <td className="p-2 border">{inv.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Investments;
