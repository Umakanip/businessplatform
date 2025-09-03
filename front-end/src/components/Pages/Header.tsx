import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
   const navigate = useNavigate();
  return (
    <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-white hover:text-purple-300 transition-colors">
              StartupConnect
            </a>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a 
              href="#features" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Features
            </a>
            <a 
              href="#roles" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Roles
            </a>
            <a 
              href="#pricing" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Pricing
            </a>
          </nav>
          <div className="flex items-center space-x-4">
           <button 
              className="text-gray-300 hover:text-white transition-colors"
              onClick={() => navigate("/auth")} // 👈 navigate to auth page
            >
              Sign In
            </button>
            <button 
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              Subscribe & Connect
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 