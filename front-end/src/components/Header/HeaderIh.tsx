import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faCreditCard, faBell, faUser, faCog, faSignOutAlt,faHome,faLightbulb } from "@fortawesome/free-solid-svg-icons";
import ProfileDrawer from "../Pages/ProfileDrawer";
import ProfileIH from "../../pages/ideaHolder/Profile"; // 👈 உங்கள் ProfileIH import

const HeaderIh: React.FC = () => {
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);

 
const ideaHolderMenu = [
    { name: "Home", path: "/", icon: faHome },
    { name: "Our Approach", path: "/ih/approach", icon: faLightbulb },
    { name: "My Connections", path: "/ih/connections", icon: faLink },
    { name: "Subscription", path: "/ih/subscription", icon: faCreditCard },
    { name: "Notifications", path: "/ih/notifications", icon: faBell },
    { name: "Profile", path: "#", icon: faUser, action: () => setShowProfile(true) }, // 👈 Drawer open
    { name: "Settings", path: "/ih/settings", icon: faCog },
    { name: "Logout", path: "/logout", icon: faSignOutAlt },
  ];
  return (
    <header className="w-full bg-gradient-to-r from-purple-900 via-slate-900 to-purple-800 text-white shadow-md flex items-center justify-between px-8 py-3 fixed top-0 left-0 z-50">
      <div className="font-extrabold text-2xl tracking-wide">Idea Holder</div>

      <nav className="flex items-center gap-8">
        {ideaHolderMenu.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={(e) => {
              if (item.action) {
                e.preventDefault();
                item.action();
              }
            }}
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

<ProfileDrawer
  isOpen={showProfile}
  onClose={() => setShowProfile(false)}
/>


    </header>
  );
};

export default HeaderIh;
