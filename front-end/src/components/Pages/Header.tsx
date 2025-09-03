import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
   const navigate = useNavigate();
  return (
    <header className="bg-gray-900 shadow-md py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              StartupConnect
            </a>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a 
              href="#features" 
              className="text-1xl font-bold text-white"
            >
              Features
            </a>
            <a 
              href="#roles" 
              className="text-1xl font-bold text-white"
            >
              Roles
            </a>
            <a 
              href="#pricing" 
              className="text-1xl font-bold text-white"
            >
              Pricing
            </a>
          </nav>
          <div className="flex items-center space-x-4">
           <button 
              className="text-1xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
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