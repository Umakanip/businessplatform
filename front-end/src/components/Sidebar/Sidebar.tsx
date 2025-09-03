import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faLink,
  faCreditCard,
  faBell,
  faUser,
  faCog,
  faSignOutAlt,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

type SidebarProps = {
  role: "idea-holder" | "investor";
};

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const location = useLocation();

  const ideaHolderMenu = [
    { name: "Dashboard", path: "/ih/dashboard", icon: faHome },
    { name: "My Connections", path: "/ih/connections", icon: faLink },
    { name: "Subscription / Plans", path: "/ih/subscription", icon: faCreditCard },
    { name: "Notifications", path: "/ih/notifications", icon: faBell },
    { name: "Profile", path: "/ih/profile", icon: faUser },
    { name: "Settings", path: "/ih/settings", icon: faCog },
    { name: "Logout", path: "/logout", icon: faSignOutAlt },
  ];

  const investorMenu = [
    { name: "Dashboard", path: "/inv/dashboard", icon: faHome },
    { name: "My Investments", path: "/inv/investments", icon: faChartLine },
    { name: "Notifications", path: "/inv/notifications", icon: faBell },
    { name: "Profile", path: "/inv/profile", icon: faUser },
    { name: "Settings", path: "/inv/settings", icon: faCog },
    { name: "Logout", path: "/logout", icon: faSignOutAlt },
  ];

  const menu = role === "idea-holder" ? ideaHolderMenu : investorMenu;

  return (
    <aside className="h-screen w-64 bg-gradient-to-b from-purple-900 via-slate-900 to-purple-800 text-white fixed left-0 top-0 shadow-xl flex flex-col">
      <div className="p-6 font-extrabold text-2xl text-center border-b border-white/20 tracking-wide">
        {role === "idea-holder" ? "💡 Idea Holder" : "📈 Investor"}
      </div>
      <nav className="flex-1 mt-4">
        {menu.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-6 py-3 rounded-lg mx-3 mb-2 transition-all ${
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
      <div className="p-4 border-t border-white/10 text-xs text-center text-gray-400">
        © 2025 Startup Hub
      </div>
    </aside>
  );
};

export default Sidebar;
