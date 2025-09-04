import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Where <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Idea Holders</span> Meet <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Investors</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            The only platform that enforces strict Idea Holders-investor connections. 
            No Idea Holders-to-Idea Holders or investor-to-investor connections allowed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
              Subscribe & Connect
            </button>
            <button className="border border-white/20 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-all duration-300">
              Learn More
            </button>
          </div>
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