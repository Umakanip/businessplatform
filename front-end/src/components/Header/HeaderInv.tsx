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

const HeaderInv: React.FC = () => {
  const location = useLocation();

  const investorMenu = [
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
      <nav className="flex items-center gap-8">
        {investorMenu.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
              location.pathname === item.path
                ? "bg-white/20 text-yellow-300 shadow-md"
                : "hover:bg-white/10"
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
