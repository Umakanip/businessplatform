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

// Utility: Calculate GST and total
const calculateWithGST = (priceStr: string) => {
  // Extract number from string (₹730 + 18% GST /month)
  const numMatch = priceStr.match(/\d+/g);
  if (!numMatch) return { base: 0, gst: 0, total: 0 };
  const base = parseInt(numMatch[0]);
  const gst = Math.round((base * 18) / 100);
  return { base, gst, total: base + gst };
};

const plansData = [
  {
    name: "Lite",
    price: "₹730 + 18% GST /month",
    description: "Basic features to get started",
    icon: faUser,
    type: "Idea Holder",
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
    type: "Idea Holder",
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
    type: "Idea Holder",
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
    type: "Investor",
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {plansData.map((plan) => {
            const { base, gst, total } = calculateWithGST(plan.price);
            return (
              <div
                key={plan.name}
                className="group [perspective:1000px] h-[360px]"
              >
                {/* Card wrapper */}
                <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* Front Side */}
                  <div className="absolute w-full h-full bg-white border rounded-xl shadow hover:shadow-lg p-6 flex flex-col justify-between [backface-visibility:hidden]">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <FontAwesomeIcon
                          icon={plan.icon}
                          className="text-blue-600 text-2xl"
                        />
                        <h3 className="text-2xl font-bold text-gray-900">
                          {plan.name}
                        </h3>
                      </div>
                      <p className="text-gray-600 font-semibold mb-2">
                        {plan.price}
                      </p>
                      <p className="text-gray-700 mb-3">{plan.description}</p>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700 text-base">
                        {plan.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-600"
                      />
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="absolute w-full h-full bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-xl shadow-lg p-6 flex flex-col justify-center items-center text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <h3 className="text-2xl font-bold mb-2">{plan.name} Plan</h3>
                    <p className="text-lg mb-2">
                      <span className="font-semibold">{plan.type}</span> Subscription
                    </p>
                    <p className="mb-2">Base Price: ₹{base}</p>
                    <p className="mb-2">GST (18%): ₹{gst}</p>
                    <p className="text-xl font-bold">
                      Total Payable: ₹{total}
                    </p>
                    
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: GIF */}
      <div className="hidden lg:flex lg:flex-1 items-center justify-center sticky top-0 h-screen bg-white">
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
