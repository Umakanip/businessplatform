import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBell,
  faUser,
  faCog,
  faSignOutAlt,
  faLink,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";

const HeaderInv: React.FC = () => {
  const location = useLocation();

  const investorMenu = [
    { name: "Home", path: "/inv/home", icon: faHome },
    { name: "Our Approach", path: "/inv/approach", icon: faLightbulb },
    { name: "My Connections", path: "/inv/connections", icon: faLink },
    { name: "Notifications", path: "/inv/notifications", icon: faBell },
    { name: "Profile", path: "/inv/profile", icon: faUser },
    { name: "Settings", path: "/inv/settings", icon: faCog },
    { name: "Logout", path: "/logout", icon: faSignOutAlt },
  ];

  return (
    <header className="w-full bg-gradient-to-r from-purple-900 via-slate-900 to-purple-800 text-white shadow-md flex items-center justify-between px-8 py-3 fixed top-0 left-0 z-50">
      {/* Logo / Title */}
      <div className="font-extrabold text-2xl tracking-wide">Investor</div>

      {/* Navigation */}
      <nav className="flex items-center gap-6">
        {investorMenu.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-300
              ${
                location.pathname === item.path
                  ? "bg-purple-700/50 text-white shadow-md"
                  : "hover:bg-purple-600/30"
              }`}
          >
            <FontAwesomeIcon icon={item.icon} />
            <span className="hidden md:inline font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default HeaderInv;
