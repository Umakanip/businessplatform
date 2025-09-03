import React from 'react';

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 px-6 sm:px-12 lg:px-20 bg-gradient-to-tr from-gray-900 via-purple-900 to-indigo-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-extrabold text-white mb-5 tracking-wide drop-shadow-lg">
            How It Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Our unique platform ensures meaningful connections between Idea Holders and Investors, driving innovation forward with ease and confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Step 1 */}
          <div className="bg-gradient-to-br from-purple-700 to-indigo-700 rounded-xl p-8 border border-indigo-600 shadow-lg hover:shadow-indigo-500 transition-shadow duration-300">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 rounded-full text-white font-extrabold text-2xl mb-6 shadow-md">
              1
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">
              Choose Your Role
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Select either <span className="font-semibold text-pink-400">Idea Holder</span> or <span className="font-semibold text-yellow-400">Investor</span> during signup.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-gradient-to-br from-indigo-700 to-purple-700 rounded-xl p-8 border border-purple-600 shadow-lg hover:shadow-purple-500 transition-shadow duration-300">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-full text-white font-extrabold text-2xl mb-6 shadow-md">
              2
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">
              Subscribe & Access
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Gain access to <span className="">verified profiles</span> after subscription.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-gradient-to-br from-purple-700 to-indigo-700 rounded-xl p-8 border border-indigo-600 shadow-lg hover:shadow-indigo-500 transition-shadow duration-300">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 rounded-full text-white font-extrabold text-2xl mb-6 shadow-md">
              3
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">
              Swipe & Match
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Explore connections using a smooth, <span className="italic text-yellow-400">Tinder-style interface</span> designed for discovery.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-gradient-to-br from-indigo-700 to-purple-700 rounded-xl p-8 border border-purple-600 shadow-lg hover:shadow-purple-500 transition-shadow duration-300">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-full text-white font-extrabold text-2xl mb-6 shadow-md">
              4
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">
              Connect & Chat
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Start meaningful conversations after a mutual interest is established, using our secure chat platform.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
