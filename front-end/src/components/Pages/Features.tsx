import React from 'react';

const Features: React.FC = () => {
  return (
    <section
      id="features"
      className="py-24 px-6 sm:px-12 lg:px-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-extrabold text-white mb-5 tracking-wide drop-shadow-lg">
            How It Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Our platform makes it simple for <span className="text-yellow-300 font-semibold">Idea Holders</span> 
            and <span className="text-green-400 font-semibold">Investors</span> to connect, collaborate, and grow together.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Step 1 */}
          <div className="bg-gradient-to-br from-purple-700 to-indigo-700 rounded-xl p-8 border border-indigo-600 shadow-lg hover:shadow-indigo-500 transition-shadow duration-300">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 rounded-full text-white font-extrabold text-2xl mb-6 shadow-md">
              1
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">
              Connect Freely
            </h3>
            <p className="text-gray-300 leading-relaxed">
              <span className="text-yellow-300 font-semibold">Investors</span> can connect with multiple Idea Holders, 
              and <span className="text-pink-400 font-semibold">Idea Holders</span> can connect with many Investors.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-gradient-to-br from-indigo-700 to-purple-700 rounded-xl p-8 border border-purple-600 shadow-lg hover:shadow-purple-500 transition-shadow duration-300">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-full text-white font-extrabold text-2xl mb-6 shadow-md">
              2
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">
              Subscribe & Unlock
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Only <span className="text-pink-400 font-semibold">Idea Holders</span> with an active subscription 
              can log in and view verified Investor profiles.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-gradient-to-br from-purple-700 to-indigo-700 rounded-xl p-8 border border-indigo-600 shadow-lg hover:shadow-indigo-500 transition-shadow duration-300">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 rounded-full text-white font-extrabold text-2xl mb-6 shadow-md">
              3
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">
              Explore Categories
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Both sides can explore across multiple categories, making it easy to find the 
              <span className="text-green-400 font-semibold"> right match</span> for your needs.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-gradient-to-br from-indigo-700 to-purple-700 rounded-xl p-8 border border-purple-600 shadow-lg hover:shadow-purple-500 transition-shadow duration-300">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-full text-white font-extrabold text-2xl mb-6 shadow-md">
              4
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">
              Smart Filtering
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Our system filters and shows you <span className="text-yellow-300 font-semibold">profiles</span> 
              that match your chosen categories, saving your time and effort.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
