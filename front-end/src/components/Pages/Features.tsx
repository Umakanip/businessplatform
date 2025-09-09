import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandshake,
  faKey,
  faLayerGroup,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 px-6 sm:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-extrabold text-white mb-5 tracking-wide drop-shadow-lg">
            How It Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Both <span className="text-yellow-300 font-semibold">Idea Holders </span> 
            and <span className="text-green-400 font-semibold">Investors</span> need an active{" "}
            <span className="text-pink-400 font-semibold">Subscription</span> to connect, collaborate, and grow together.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Step 1 */}
          <div className="bg-gradient-to-br from-purple-700 to-indigo-700 rounded-xl p-8 border border-indigo-600 shadow-lg hover:shadow-indigo-500 transition-shadow duration-300 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 rounded-full text-white text-3xl mb-6 shadow-md mx-auto">
              <FontAwesomeIcon icon={faHandshake} />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">
              Mutual Connection
            </h3>
            <p className="text-gray-300 leading-relaxed">
              <span className="text-yellow-300 font-semibold">Investors</span> must subscribe 
              to connect with Idea Holders, and{" "}
              <span className="text-pink-400 font-semibold">Idea Holders</span> must subscribe 
              to connect with Investors.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-gradient-to-br from-indigo-700 to-purple-700 rounded-xl p-8 border border-purple-600 shadow-lg hover:shadow-purple-500 transition-shadow duration-300 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-full text-white text-3xl mb-6 shadow-md mx-auto">
              <FontAwesomeIcon icon={faKey} />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">
              Subscription Unlock
            </h3>
            <p className="text-gray-300 leading-relaxed">
              With an active subscription,{" "}
              <span className="text-pink-400 font-semibold">Idea Holders </span> can view verified{" "}
              <span className="text-green-400 font-semibold">Investor profiles</span>, 
              and Investors can access Idea Holders’ details.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-gradient-to-br from-purple-700 to-indigo-700 rounded-xl p-8 border border-indigo-600 shadow-lg hover:shadow-indigo-500 transition-shadow duration-300 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 rounded-full text-white text-3xl mb-6 shadow-md mx-auto">
              <FontAwesomeIcon icon={faLayerGroup} />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">
              Explore Categories
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Both sides can explore across{" "}
              <span className="text-green-400 font-semibold">Multiple Categories </span> 
               to discover the perfect match for collaboration.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-gradient-to-br from-indigo-700 to-purple-700 rounded-xl p-8 border border-purple-600 shadow-lg hover:shadow-purple-500 transition-shadow duration-300 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-full text-white text-3xl mb-6 shadow-md mx-auto">
              <FontAwesomeIcon icon={faFilter} />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">
              Smart Filtering
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Our system highlights{" "}
              <span className="text-yellow-300 font-semibold">Matching Profiles </span> 
              from your chosen categories to save time and effort.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
