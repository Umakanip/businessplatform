import React from "react";
import gift from "../../assest/animation-people-012221-2.gif";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faUser,
  faShieldAlt,
  faHandshake,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

const plansData = [
  {
    name: "Lite",
    price: "₹730 + 18% GST /month",
    description: "Basic features to get started",
    icon: faUser,
    features: [
      "Limited profile views",
      "Basic matching",
      "Community support",
      "Limited access to contacts",
    ],
  },
  {
    name: "Standard",
    price: "₹1000 + 18% GST /month",
    description: "More profile views and contacts",
    icon: faHandshake,
    features: [
      "More profile views (not unlimited)",
      "Basic matching",
      "Access to contacts",
      "KYC verification",
    ],
  },
  {
    name: "Premium",
    price: "₹1300 + 18% GST /month",
    description: "Full access for power users",
    icon: faStar,
    features: [
      "Unlimited profile views",
      "Access to all contacts",
      "Priority support",
      "Featured profile badge",
    ],
  },
  {
    name: "Investor",
    price: "₹600 + 18% GST /3 months",
    description: "Investor subscription plan",
    icon: faShieldAlt,
    features: [
      "Access to all idea holders",
      "Investor verification badge",
      "Direct connect with idea holders",
    ],
  },
];

const Subscription: React.FC = () => {
  return (
    <section className="w-full min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left: Plans */}
      <div className="lg:flex-[1.2] py-16 px-6 sm:px-12 lg:px-20">
        <h2 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
          Subscription Plans
        </h2>
        <p className="text-xl lg:text-2xl text-gray-700 mb-12">
          Choose a plan that fits your role.{" "}
          <span className="font-semibold text-blue-700">Idea Holders</span> must
          subscribe to <span className="font-semibold text-blue-700">log in</span>{" "}
          and <span className="font-semibold text-blue-700">connect with Investors</span>.
        </p>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {plansData.map((plan) => (
            <div
              key={plan.name}
              className="bg-white border rounded-xl shadow hover:shadow-lg transition p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <FontAwesomeIcon
                    icon={plan.icon}
                    className="text-blue-600 text-2xl"
                  />
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                </div>
                <p className="text-gray-600 font-semibold mb-2">{plan.price}</p>
                <p className="text-gray-700 mb-3">{plan.description}</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 text-base">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 flex justify-end">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: GIF */}
      <div className="hidden lg:flex lg:flex-1 items-center justify-center sticky top-0 h-screen">
        <img
          src={gift}
          alt="Subscription Animation"
          className="w-[400px] h-[400px] max-w-full max-h-full object-contain"
        />
      </div>
    </section>
  );
};

export default Subscription;
