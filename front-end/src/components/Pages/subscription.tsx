import React from "react";
import gift from "../../assest/animation-people-012221-2.gif";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faUser,
  faGlobe,
  faHandshake,
  faGem,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";

// Utility: Calculate GST and total
const calculateWithGST = (priceStr: string) => {
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
    backDetails: [
      "Limited profile views",
      "Limited suggestions",
      "Basic community connect",
    ],
    extra: "Perfect for beginners who want to explore and test the platform.",
  },
  {
    name: "Standard",
    price: "₹1000 + 18% GST /month",
    description: "More profile views and contacts",
    icon: faGem,
    type: "Idea Holder",
    features: [
      "More profile views (not unlimited)",
      "Basic matching",
      "Access to contacts",
      "KYC verification",
    ],
    backDetails: [
      "More profile views (not unlimited)",
      "More suggestions",
      "Verified profile option",
    ],
    extra:
      "Good choice for active idea holders to reach more investors and connections.",
  },
  {
    name: "Premium",
    price: "₹1300 + 18% GST /month",
    description: "Full access for power users",
    icon: faCrown,
    type: "Idea Holder",
    features: [
      "Unlimited profile views",
      "Access to all contacts",
      "Priority support",
      "Featured profile badge",
    ],
    backDetails: [
      "Unlimited profile views",
      "Unlimited suggestions",
      "Unlimited connections",
      "Priority support",
    ],
    extra:
      "Best for serious entrepreneurs looking for maximum visibility and fast investor reach.",
  },
  {
    name: "Enterprise",
    price: "₹600 + 18% GST /3 months",
    description: "Investor subscription plan",
    icon: faGlobe,
    type: "Investor",
    features: [
      "Access to all idea holders",
      "Investor verification badge",
      "Direct connect with idea holders",
    ],
    backDetails: [
      "Unlimited access to idea holders",
      "Unlimited profile views",
      "Unlimited connections",
      "Verified investor badge",
    ],
    extra:
      "Tailored for investors to explore, verify, and connect directly with idea holders.",
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
              <div key={plan.name} className="group [perspective:1000px] h-[420px]">
                {/* Card wrapper */}
                <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                  {/* Front Side */}
                  <div className="absolute w-full h-full bg-white border rounded-xl shadow-md hover:shadow-xl p-6 flex flex-col justify-between [backface-visibility:hidden]">
                    <div className="space-y-4">
                      {/* Header with badge */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FontAwesomeIcon
                            icon={plan.icon}
                            className="text-blue-600 text-2xl"
                          />
                          <h3 className="text-2xl font-bold text-gray-900">
                            {plan.name}
                          </h3>
                        </div>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                          {plan.type}
                        </span>
                      </div>

                      <p className="text-lg font-bold text-gray-800">{plan.price}</p>
                      <p className="text-gray-600 text-sm">{plan.description}</p>

                      {/* Features with icons */}
                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 text-gray-700 text-sm"
                          >
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              className="text-green-600 text-sm"
                            />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom Tick */}
                    <div className="flex justify-end pt-3">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="text-green-600 text-lg"
                      />
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="absolute w-full h-full bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-xl shadow-lg p-6 flex flex-col justify-between items-center text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <div>
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <FontAwesomeIcon
                          icon={plan.icon}
                          className="text-white text-3xl"
                        />
                        <h3 className="text-2xl font-bold">{plan.name} Plan</h3>
                      </div>
                      <p className="text-lg mb-2">
                        <span className="font-semibold">{plan.type}</span> Subscription
                      </p>
                      <p className="mb-1">Base Price: ₹{base}</p>
                      <p className="mb-1">GST (18%): ₹{gst}</p>
                      <p className="text-xl font-bold mb-3">
                        Total Payable: ₹{total}
                      </p>
                      {/* Back details */}
                      <ul className="list-disc pl-5 text-left space-y-1 text-sm mb-3">
                        {plan.backDetails.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-sm opacity-90">{plan.extra}</p>
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
