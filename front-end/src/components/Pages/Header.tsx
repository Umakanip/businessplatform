import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
   const navigate = useNavigate();
 return (
   <header className="w-full bg-gradient-to-r from-purple-1000 via-slate-1000 to-purple-800 text-white shadow-md">
     <div className="max-w-7xl mx-auto px-8">
       <div className="flex justify-between items-center py-4">
         <div className="flex items-center">
           <a href="/" className="font-extrabold text-2xl tracking-wide bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
             StartupConnect
           </a>
         </div>
         <nav className="hidden md:flex space-x-8">
           <a 
             href="#features" 
             className="text-1xl font-bold text-gray-600"
           >
             Features
           </a>
           <a  
             href="#roles" 
             className="text-1xl font-bold text-gray-600"
           >
             Roles
           </a>
           <a 
             href="#pricing" 
             className="text-1xl font-bold text-gray-600"
           >
             Pricing
           </a>
         </nav>
         <div className="flex items-center space-x-4">
           <button 
             className="text-1xl font-bold text-gray-600"
             onClick={() => navigate("/auth")}
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