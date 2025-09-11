import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const InvPricing = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Fixed Pro plan for investors
  const investorPlan = {
    name: "Pro",
    price: "₹708",      // GST included
    period: "/3 months", // fixed 3 months
    description: "Full access for investors",
    features: [
      "All Standard features",
      "Priority support",
      "Advanced analytics",
      "Featured profile badge",
    ],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
   const response = await axiosInstance.post(
  "subscriptions/subscribe-public",
  {
    email,
    password,
    role: "investor",   // 👈 add this
    // plan optional, backend auto "lite" save pannum investor ku
  }
);


      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Subscription Successful! 🎉",
          text: `You are subscribed to Pro plan for 3 months.`,
          timer: 2000,
          showConfirmButton: false,
          position: "center",
        });

        navigate("/payment", {
          state: {
            subscriptionId: response.data.subscriptionId,
            amount: response.data.amount,
            redirectTo: "/inv/approach"
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

  const openSubscriptionModal = () => {
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto rounded-xl shadow-2xl bg-gray-800 p-8">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-2">
          Investor Subscription
        </h1>
        <p className="text-center text-gray-400 mb-10">
          Subscribe to Pro plan for 3 months and unlock full access.
        </p>

        {/* Single Card */}
        <div className="w-full max-w-md mx-auto p-8 rounded-2xl shadow-lg border-2 border-purple-500">
          <h2 className="text-3xl font-extrabold text-white mb-2">{investorPlan.name}</h2>
          <p className="text-gray-400 mb-4">{investorPlan.description}</p>
          <div className="text-white text-5xl font-bold">
            {investorPlan.price}
            <span className="text-xl font-normal text-gray-400">{investorPlan.period}</span>
          </div>
          <ul className="mt-6 space-y-3 text-gray-300">
            {investorPlan.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <svg
                  className="h-5 w-5 text-green-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={openSubscriptionModal}
              className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              Subscribe Now
            </button>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 p-4">
            <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-sm relative">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors duration-200"
              >
                ×
              </button>
              <h3 className="text-2xl font-bold text-center text-white mb-6">
                Subscribe to {investorPlan.name}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
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
                  <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
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


export default InvPricing;
