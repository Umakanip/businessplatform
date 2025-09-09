import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const Hero: React.FC = () => {
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const response = await axiosInstance.get("/subscriptions/status");
        setSubscription(response.data);
      } catch (err) {
        console.error("Error fetching subscription:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubscriptionStatus();
  }, []);

  // ✅ Loading placeholder
  if (isLoading) {
    return (
      <section
        id="hero"
        className="relative py-20 px-4 sm:px-6 lg:px-8 text-center"
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-300 animate-pulse">
            Loading...
          </h1>
        </div>
      </section>
    );
  }

  const isActive = subscription && subscription.active;

  return (
    <section id="hero" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-8">
          {/* ✅ Show different heading/paragraph based on subscription */}
          {isActive ? (
            <>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                You're a{" "}
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  Subscription Member!
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Thank you for being a valued member! Enjoy all the exclusive
                features crafted just for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
              </div>
            </>
          ) : (
            <>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Where{" "}
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Idea Holders
                </span>{" "}
                Meet{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Investors
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                A platform built to foster genuine collaborations — where{" "}
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-semibold">
                  Idea Holders
                </span>{" "}
                connect exclusively with{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                  Investors
                </span>
                , ensuring focused and meaningful partnerships.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
                  Subscribe & Connect
                </button>
              </div>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <div className="text-3xl font-bold text-white mb-2">500+</div>
            <div className="text-gray-300">Active Idea Holders</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <div className="text-3xl font-bold text-white mb-2">200+</div>
            <div className="text-gray-300">Verified Investors</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 border border-white/10">
            <div className="text-3xl font-bold text-white mb-2">50+</div>
            <div className="text-gray-300">Successful Matches</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
