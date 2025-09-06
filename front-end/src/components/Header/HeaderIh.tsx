
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLink,
  faCreditCard,
  faBell,
  faUser,
  faHome,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";
import ProfileDrawer from "../Pages/ProfileDrawer";
import axiosInstance from "../../utils/axiosInstance";

const HeaderIh: React.FC = () => {
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  const [inviteCount, setInviteCount] = useState(0);

  // 🔹 Fetch invites count
  const fetchInviteCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axiosInstance.get("/connections/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInviteCount(res.data.length);
    } catch (error) {
      console.error("Error fetching invite count:", error);
    }
  };

  useEffect(() => {
    fetchInviteCount();

    // 🔄 Poll every 20s
    const interval = setInterval(fetchInviteCount, 20000);

    // 🔹 Listen for custom event from Notifications
    const handleRefresh = () => {
      fetchInviteCount();
    };
    window.addEventListener("refreshInvites", handleRefresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener("refreshInvites", handleRefresh);
    };
  }, []);

  const ideaHolderMenu = [
    { name: "Home", path: "/", icon: faHome },
    { name: "Our Approach", path: "/ih/approach", icon: faLightbulb },
    { name: "My Connections", path: "/ih/connections", icon: faLink },
    { name: "Subscription", path: "/ih/subscription", icon: faCreditCard },
    { name: "Notifications", path: "/ih/notifications", icon: faBell },
    { name: "Profile", path: "#", icon: faUser, action: () => setShowProfile(true) },
  ];

  return (
    <header className="w-full bg-gradient-to-r from-purple-900 via-slate-900 to-purple-800 text-white shadow-lg flex items-center justify-between px-8 py-4 fixed top-0 left-0 z-50">
      <div className="font-extrabold text-2xl tracking-wide">Idea Holder</div>
      <nav className="flex items-center gap-6">
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
            className={`relative flex items-center justify-center px-3 py-2 rounded-lg font-medium transition-all
              ${location.pathname === item.path
                ? "bg-gradient-to-r from-indigo-500/30 to-pink-500/30 text-pink-300 shadow"
                : ""}`}
          >
            {/* Icon */}
            <div className="relative">
              <FontAwesomeIcon icon={item.icon} className="text-lg" />

              {/* 🔹 Badge only for Notifications */}
              {item.name === "Notifications" && inviteCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                  {inviteCount}
                </span>
              )}
            </div>

            {/* Text → hide for Notifications */}
            {item.name !== "Notifications" && (
              <span className="hidden md:inline">{item.name}</span>
            )}
          </Link>
        ))}
      </nav>

      <ProfileDrawer
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        showLogout={true}
      />
    </header>
  );
};

export default HeaderIh;

