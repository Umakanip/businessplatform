import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import axiosInstance from "../../utils/axiosInstance";

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
}

const Pricing = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const plans: Plan[] = [
    {
      name: "Lite",
      price: "$19",
      period: "/month",
      description: "Basic features to get started",
      features: [
        "Limited profile views",
        "Basic matching",
        "Community support",
      ],
    },
    {
      name: "Standard",
      price: "$49",
      period: "/month",
      description: "Most popular plan for individuals",
      features: [
        "Unlimited profile views",
        "Tinder-style matching",
        "Direct messaging",
        "KYC verification",
      ],
    },
    {
      name: "Premium",
      price: "$99",
      period: "/month",
      description: "Full access for power users",
      features: [
        "All Standard features",
        "Priority support",
        "Advanced analytics",
        "Featured profile badge",
      ],
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedPlan) {
      Swal.fire({
        icon: "error",
        title: "Please select a plan 💡",
        text: "Choose one plan to continue.",
        confirmButtonText: "Ok",
        position: "center",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(
        "subscriptions/subscribe-public",
        {
          email,
          password,
          plan: selectedPlan.name.toLowerCase(),
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Subscription Successful! 🎉",
          text: `You are subscribed to ${selectedPlan.name} plan.`,
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });

        navigate("/payment", {
          state: {
            subscriptionId: response.data.subscriptionId,
            amount: response.data.amount,
            redirectTo: "/ih/approach"
          },
        });
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text:
          error.response?.data?.message ||
          "An error occurred during subscription.",
        confirmButtonText: "Close",
        position: "center",
      });
    } finally {
      setLoading(false);
    }
  };

  const openSubscriptionModal = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto rounded-xl shadow-2xl bg-gray-800 p-8">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-2">
          Pricing Plans
        </h1>
        <p className="text-center text-gray-400 mb-10">
          Choose the right plan for you and start connecting with idealogists today.
        </p>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl shadow-lg border-2 transform hover:scale-105 transition-transform duration-300 cursor-pointer
                ${
                  selectedPlan?.name === plan.name
                    ? "border-purple-500 ring-4 ring-purple-500"
                    : "border-gray-700 hover:border-purple-500"
                }`}
              onClick={() => openSubscriptionModal(plan)}
            >
              <h2 className="text-3xl font-extrabold text-white mb-2">{plan.name}</h2>
              <p className="text-gray-400 mb-4">{plan.description}</p>
              <div className="text-white text-5xl font-bold">
                {plan.price}
                <span className="text-xl font-normal text-gray-400">{plan.period}</span>
              </div>
              <ul className="mt-6 space-y-3 text-gray-300">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-400 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => openSubscriptionModal(plan)}
                  className={`w-full py-3 rounded-lg font-semibold
                    ${
                      selectedPlan?.name === plan.name
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600"
                    }
                    transition-all duration-300`}
                >
                  Select Plan
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 p-4">
            <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-sm relative">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h3 className="text-2xl font-bold text-center text-white mb-6">
                Subscribe to {selectedPlan.name}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                >
                  {loading ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pricing;
