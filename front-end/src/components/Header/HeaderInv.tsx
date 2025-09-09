import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUser,
  faHome,
  faLightbulb,
  faLink,
} from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../utils/axiosInstance";

const HeaderInv: React.FC = () => {
  const location = useLocation();
  const [inviteCount, setInviteCount] = useState(0);

  // 🔹 Fetch invites count
  const fetchInviteCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axiosInstance.get("/connections/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const count =
        Array.isArray(res.data) ? res.data.length : res.data.requests?.length || 0;

      setInviteCount(count);
    } catch (error) {
      console.error("Error fetching invite count:", error);
    }
  };

  useEffect(() => {
    fetchInviteCount();

    const interval = setInterval(fetchInviteCount, 20000);

    const handleRefresh = () => {
      fetchInviteCount();
    };
    window.addEventListener("refreshInvites", handleRefresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener("refreshInvites", handleRefresh);
    };
  }, []);

  // ✅ Direct profile page instead of drawer
  const investorMenu = [
    { name: "Home", path: "/", icon: faHome },
    { name: "Ideas Hub", path: "/inv/approach", icon: faLightbulb },
    { name: "My Connections", path: "/inv/connections", icon: faLink },
    { name: "Notifications", path: "/inv/notifications", icon: faBell },
    { name: "Profile", path: "/inv/profile", icon: faUser },
  ];

  return (
    <header className="w-full bg-gradient-to-r from-purple-900 via-slate-900 to-purple-800 text-white shadow-lg flex items-center justify-between px-8 py-4 fixed top-0 left-0 z-50">
      <div className="font-extrabold text-2xl tracking-wide">Investor</div>
      <nav className="flex items-center gap-6">
        {investorMenu.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`relative flex items-center justify-center px-3 py-2 rounded-lg font-medium transition-all
              ${location.pathname === item.path
                ? "bg-gradient-to-r from-indigo-500/30 to-pink-500/30 text-pink-300 shadow"
                : ""}`}
          >
            <div className="relative">
              <FontAwesomeIcon icon={item.icon} className="text-lg" />

              {/* 🔹 Badge only for Notifications */}
              {item.name === "Notifications" && inviteCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                  {inviteCount}
                </span>
              )}
            </div>

            {item.name !== "Notifications" && (
              <span className="hidden md:inline">{item.name}</span>
            )}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default HeaderInv;
