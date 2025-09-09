import React from "react";

const Subscription: React.FC = () => {
  const plans = [
    {
      name: "Lite",
      price: "$19",
      period: "/month",
      description: "Basic features to get started",
      features: [
        "Limited profile views",
        "Basic matching",
        "Community support",
        "Limited Access to contacts",

      ],
    },
    {
      name: "Standard",
      price: "$49",
      period: "/month",
      description: "More profile views and contacts",
      features: [
        "More profile views (not unlimited)",
        "Basic matching",
        "Access to contacts",
        "KYC verification",
      ],
    },
    {
      name: "Premium",
      price: "$99",
      period: "/month",
      description: "Full access for power users",
      features: [
        "Unlimited profile views",
        "Access to all contacts",
        "Priority support",
        "Featured profile badge",
      ],
    },
  ];

  return (
    <section id="Subscription" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-extrabold text-white mb-5 tracking-wide drop-shadow-lg">
            Subscription Required
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Idea Holders{" "}
            <span className="text-yellow-300 font-semibold">must subscribe</span>{" "}
            to <span className="text-green-400 font-semibold">log in</span> and{" "}
            <span className="text-blue-400 font-semibold">
              connect with Investors
            </span>
            .
          </p>
        </div>

        {/* Subscription Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl p-8 border border-white/10 flex flex-col"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-white mb-2">
                  {plan.price}
                  <span className="text-lg text-gray-300">{plan.period}</span>
                </div>
                <p className="text-gray-300">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-400 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
                Choose {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Subscription;
