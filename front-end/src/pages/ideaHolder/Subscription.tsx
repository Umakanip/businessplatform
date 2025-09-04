import React from "react";

const Subscription: React.FC = () => {
  const plans = [
    { name: "Basic", price: "₹499/mo", features: ["5 Connections", "Email Support"] },
    { name: "Pro", price: "₹999/mo", features: ["Unlimited Connections", "Priority Support"] },
    { name: "Premium", price: "₹1999/mo", features: ["Everything in Pro", "Dedicated Manager"] },
  ];

  return (
    <div className="bg-white p-6 shadow rounded-lg">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">Subscription Plans</h1>
      <div className="grid grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <div key={i} className="border rounded-lg p-4 shadow hover:shadow-lg">
            <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
            <p className="text-lg text-purple-600 font-semibold">{plan.price}</p>
            <ul className="mt-2 space-y-1 text-gray-600">
              {plan.features.map((f, j) => (
                <li key={j}>✅ {f}</li>
              ))}
            </ul>
            <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Subscription;
