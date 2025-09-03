import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faChartLine,
  faBell,
  faUser,
  faCog,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const SidebarInv: React.FC = () => {
  const location = useLocation();

  const investorMenu = [
    { name: "Dashboard", path: "/inv/dashboard", icon: faHome },
    { name: "My Investments", path: "/inv/investments", icon: faChartLine },
    { name: "Notifications", path: "/inv/notifications", icon: faBell },
    { name: "Profile", path: "/inv/profile", icon: faUser },
    { name: "Settings", path: "/inv/settings", icon: faCog },
    { name: "Logout", path: "/logout", icon: faSignOutAlt },
  ];

  return (
    <aside className="h-screen w-64 bg-gradient-to-b from-purple-900 via-slate-900 to-purple-800 text-white fixed left-0 top-0 shadow-xl flex flex-col">
      {/* Sidebar Title */}
      <div className="p-6 font-extrabold text-2xl text-center border-b border-white/20 tracking-wide">
        Investor
      </div>

      {/* Menu Items */}
      <nav className="flex-1 mt-4">
        {investorMenu.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-4 px-6 py-3 rounded-lg mx-3 mb-2 transition-all ${
              location.pathname === item.path
                ? "bg-white/20 text-yellow-300 shadow-md"
                : "hover:bg-white/10"
            }`}
          >
            <FontAwesomeIcon icon={item.icon} />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 text-xs text-center text-gray-400">
        © 2025 Startup Hub
      </div>
    </aside>
  );
};

export default SidebarInv;
