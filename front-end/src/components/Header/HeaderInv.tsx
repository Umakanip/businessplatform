import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser, faCog, faHome, faLightbulb, faLink } from "@fortawesome/free-solid-svg-icons";
import ProfileDrawer from "../Pages/ProfileDrawer";

const HeaderInv: React.FC = () => {
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);

  const investorMenu = [
    { name: "Home", path: "/", icon: faHome },
    { name: "Our Approach", path: "/inv/approach", icon: faLightbulb },
    { name: "My Connections", path: "/inv/connections", icon: faLink },
    { name: "Notifications", path: "/inv/notifications", icon: faBell },
    { name: "Profile", path: "#", icon: faUser, action: () => setShowProfile(true) },
  ];

  return (
    <header className="w-full bg-gradient-to-r from-purple-900 via-slate-900 to-purple-800 text-white shadow-lg flex items-center justify-between px-8 py-4 fixed top-0 left-0 z-50">
      <div className="font-extrabold text-2xl tracking-wide">Investor</div>
      <nav className="flex items-center gap-6">
        {investorMenu.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            onClick={(e) => {
              if (item.action) {
                e.preventDefault();
                item.action();
              }
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
            ${location.pathname === item.path
              ? "bg-gradient-to-r from-indigo-500/30 to-pink-500/30 text-pink-300 shadow"
              : ""}
            ${item.name === "Profile" ? "profile-trigger" : ""}`}
          >
            <FontAwesomeIcon icon={item.icon} />
            <span className="hidden md:inline">{item.name}</span>
          </Link>
        ))}
      </nav>
      <ProfileDrawer
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        showLogout={true} // To show Logout inside drawer
      />
    </header>
  );
};

export default HeaderInv;
