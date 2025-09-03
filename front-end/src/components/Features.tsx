import React from 'react';

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Our unique platform ensures meaningful connections between Idea Holders and investors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg p-6 border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Choose Your Role</h3>
            <p className="text-gray-300">Select either Idea Holder or Investor during signup</p>
          </div>

          {/* Step 2 */}
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg p-6 border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Subscribe & Access</h3>
            <p className="text-gray-300">Get access to verified profiles after subscription</p>
          </div>

          {/* Step 3 */}
          <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg p-6 border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Swipe & Match</h3>
            <p className="text-gray-300">Tinder-style interface for discovering connections</p>
          </div>

          {/* Step 4 */}
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg p-6 border border-white/10">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4">
              4
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Connect & Chat</h3>
            <p className="text-gray-300">Start conversations after mutual interest</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features; 