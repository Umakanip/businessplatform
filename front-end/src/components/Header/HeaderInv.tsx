import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faHome,
  faLightbulb,
  faLink,
  faSignOutAlt,
  faCreditCard,
  faEye, // 👁️ Added for views
} from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../utils/axiosInstance";

const HeaderInv: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [inviteCount, setInviteCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [userProfileData, setUserProfileData] = useState<{
    profileImage: string | null;
    name: string;
  } | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // ✅ Fetch Profile Views
  const fetchViewCount = async () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (!token || !storedUser) return;
    const parsed = JSON.parse(storedUser);

    try {
      const res = await axiosInstance.get(`/profile-views/${parsed.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setViewCount(res.data.viewCount);
    } catch (error) {
      console.error("Failed to fetch view count:", error);
    }
  };

  // ✅ Fetch Invites
  const fetchInviteCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axiosInstance.get("/connections/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const count = Array.isArray(res.data)
        ? res.data.length
        : res.data.requests?.length || 0;
      setInviteCount(count);
    } catch (error) {
      console.error("Error fetching invite count:", error);
    }
  };

  // ✅ Fetch User Profile
  const fetchUserProfile = async () => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!storedUser || !token) {
      setUserProfileData(null);
      return;
    }
    const parsed = JSON.parse(storedUser);
    try {
      const res = await axiosInstance.get(
        `http://localhost:5000/api/auth/profile/${parsed.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserProfileData({
        profileImage: res.data.profileImage
          ? `http://localhost:5000/uploads/${res.data.profileImage}`
          : null,
        name: res.data.name || "",
      });
    } catch (err) {
      console.error("Profile fetch failed:", err);
      setUserProfileData(null);
    }
  };

 useEffect(() => {
  fetchInviteCount();
  fetchUserProfile();
  fetchViewCount();

  const interval = setInterval(() => {
    fetchInviteCount();
    fetchUserProfile();
    fetchViewCount();
  }, 1000);

  // 🔹 Handle manual refresh events
  const handleRefreshInvites = () => {
    fetchInviteCount();
    fetchUserProfile();
    fetchViewCount();
  };
  const handleRefreshViews = () => {
    fetchViewCount();
  };

  window.addEventListener("refreshInvites", handleRefreshInvites);
  window.addEventListener("refreshViews", handleRefreshViews);

  return () => {
    clearInterval(interval);
    window.removeEventListener("refreshInvites", handleRefreshInvites);
    window.removeEventListener("refreshViews", handleRefreshViews);
  };
}, []);


  // ✅ Menu
  const investorMenu = [
    { name: "Home", path: "/", icon: faHome },
    { name: "Ideas Hub", path: "/inv/approach", icon: faLightbulb },
    { name: "My Connections", path: "/inv/connections", icon: faLink },
    { name: "Subscription", path: "plan/subscription", icon: faCreditCard },
    { name: "Notifications", path: "/inv/notifications", icon: faBell },
  ];

  const handleLogout = () => setShowLogoutModal(true);
  const confirmLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ✅ Avatar
  const AvatarWithFirstLetter = () => {
    const getFirstLetter = (name: string) =>
      name ? name.charAt(0).toUpperCase() : "U";

    if (userProfileData?.profileImage) {
      return (
        <img
          src={userProfileData.profileImage}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-sm"
        />
      );
    }
    return (
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-700 text-white font-semibold shadow-sm">
        {getFirstLetter(userProfileData?.name || "")}
      </div>
    );
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="text-xl font-bold text-gray-800">Investor</div>

        {/* Menu */}
        <nav className="flex items-center gap-6">
          {investorMenu.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`relative flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition
                ${location.pathname === item.path ? "text-indigo-600" : ""}`}
            >
              <FontAwesomeIcon icon={item.icon} className="text-lg" />
              {item.name !== "Notifications" && <span>{item.name}</span>}
              {item.name === "Notifications" && inviteCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow">
                  {inviteCount}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Profile + Views + Logout */}
        <div className="flex items-center gap-4">
          {/* 👁️ Separate view count with icon */}
          <div className="flex items-center gap-1 text-gray-600">
            <FontAwesomeIcon icon={faEye} className="text-lg" />
            <span className="text-sm font-medium">{viewCount}</span>
          </div>

          {/* Profile */}
          <Link to="/inv/profile" className="relative">
            <AvatarWithFirstLetter />
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-red-500 hover:text-white rounded-lg transition"
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Are you sure?
            </h4>
            <p className="text-sm text-gray-500 mb-6">
              You will be logged out of your account.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderInv;
