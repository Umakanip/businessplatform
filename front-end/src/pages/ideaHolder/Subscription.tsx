import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  faCrown,
  faWallet,
  faCalendarAlt,
  faExclamationTriangle,
  faCheckCircle,
  faTimesCircle,
  faCreditCard,
  faChartLine,
  faStar,
  faMoneyBillWave,
  faUserShield,
  faReceipt,
  faLock,
  faGift,
  faTags,
} from "@fortawesome/free-solid-svg-icons";

// SVG Icons for the background
const SubscriptionIcons = () => (
  <div className="absolute inset-0 z-0 overflow-hidden opacity-20">
    {/* Existing */}
    <div className="absolute top-1/4 left-1/5 transform -translate-x-1/2 -translate-y-1/2 text-gray-800">
      <FontAwesomeIcon icon={faCreditCard} className="text-9xl" />
    </div>
    <div className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2 text-gray-700">
      <FontAwesomeIcon icon={faChartLine} className="text-9xl" />
    </div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-900">
      <FontAwesomeIcon icon={faStar} className="text-9xl" />
    </div>
    <div className="absolute top-1/3 right-1/4 text-gray-800">
      <FontAwesomeIcon icon={faTags} className="text-9xl" />
    </div>
    <div className="absolute bottom-1/3 left-1/4 text-gray-700">
      <FontAwesomeIcon icon={faCrown} className="text-9xl" />
    </div>

    {/* New */}
    <div className="absolute top-1/2 right-1/4 text-gray-800">
      <FontAwesomeIcon icon={faWallet} className="text-8xl" />
    </div>
    <div className="absolute bottom-1/6 left-1/6 text-gray-900">
      <FontAwesomeIcon icon={faMoneyBillWave} className="text-8xl" />
    </div>
    <div className="absolute top-2/3 right-1/3 text-gray-700">
      <FontAwesomeIcon icon={faReceipt} className="text-8xl" />
    </div>
    <div className="absolute top-1/5 left-1/3 text-gray-800">
      <FontAwesomeIcon icon={faGift} className="text-8xl" />
    </div>
    <div className="absolute bottom-1/5 right-1/5 text-gray-900">
      <FontAwesomeIcon icon={faLock} className="text-8xl" />
    </div>
    <div className="absolute top-1/2 left-1/5 text-gray-700">
      <FontAwesomeIcon icon={faUserShield} className="text-8xl" />
    </div>
  </div>
);

const SubscriptionStatus: React.FC = () => {
   const navigate = useNavigate();
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const response = await axiosInstance.get("/subscriptions/status");
        setSubscription(response.data);
      } catch (err: any) {
        setError("Failed to fetch subscription status.");
        console.error("Subscription status error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubscriptionStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold text-gray-700 animate-pulse bg-gray-100">
        Checking your subscription...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 relative p-4">
        <SubscriptionIcons />
        <div className="max-w-lg w-full bg-red-500/10 border border-red-500 text-red-700 rounded-2xl shadow-xl p-8 text-center backdrop-blur-lg z-10">
          <FontAwesomeIcon icon={faTimesCircle} className="text-4xl mb-3" />
          <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!subscription || !subscription.active) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 relative p-4">
        <SubscriptionIcons />
        <div className="max-w-7xl mx-auto text-center z-10">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Unlock Your <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent"> SubscriptionPlan</span> Today
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 mb-8 max-w-3xl mx-auto">
              Access exclusive features, advanced analytics, and priority support with a  Subscriptionsubscription.
            </p>
          </div>
          <div className="max-w-lg mx-auto bg-gray-200/50 border border-gray-300 text-gray-800 rounded-2xl shadow-2xl p-10 text-center backdrop-blur-lg z-10">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-5xl text-yellow-500 mb-4"
            />
            <h2 className="text-3xl font-bold mb-4">No Active Subscription</h2>
            <p className="text-gray-600 mb-6">
              You don’t have an active plan right now. Subscribe today to unlock
               Subscriptionfeatures.
            </p>
            <button 
            onClick={() => navigate("/subscription")}
            className="px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-white">
              View Plans
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative p-4">
      <SubscriptionIcons />
      <div className="max-w-7xl mx-auto text-center z-10">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            You're a <span className="bg-gradient-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent"> Subscription Member!</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 mb-8 max-w-3xl mx-auto">
            Thank you for being a valued member! Enjoy all the exclusive features crafted just for you.
          </p>
        </div>
        <div className="max-w-lg mx-auto relative bg-gray-200/50 rounded-2xl shadow-2xl pt-10 px-10 pb-10 border border-gray-300 backdrop-blur-md z-10">
          {/* Crown Badge */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-full p-5 shadow-lg">
              <FontAwesomeIcon icon={faCrown} className="text-3xl" />
            </div>
          </div>

          <h2 className="mt-0 text-3xl font-extrabold text-center">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Your Plan
            </span>
          </h2>

          {/* Subscription Details */}
          <div className="bg-gray-300/30 rounded-xl p-6 border border-gray-400 mt-6">
            <p className="flex items-center text-lg text-green-600 font-bold mb-4">
              <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
              Status: <span className="ml-2">Active</span>
            </p>
            <p className="flex items-center text-gray-700 mb-3">
              <FontAwesomeIcon icon={faCrown} className="mr-2 text-yellow-500" />
              Current Plan:{" "}
              <span className="ml-2 font-semibold text-purple-700">
                {subscription.plan}
              </span>
            </p>
            <p className="flex items-center text-gray-700">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="mr-2 text-blue-500"
              />
              Expires on:{" "}
              <span className="ml-2 font-semibold">
                {new Date(subscription.endDate).toLocaleDateString()}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionStatus;