import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faHome,
  faLightbulb,
  faLink,
  faSignOutAlt, // ✅ Added for the logout icon
} from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../utils/axiosInstance";

const HeaderInv: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ Hook for navigation
  const [inviteCount, setInviteCount] = useState(0);
  const [userProfileData, setUserProfileData] = useState<{
    profileImage: string | null;
    name: string;
  } | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  // ✅ Fetch user profile image and name
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
    fetchUserProfile(); // ✅ Fetch profile image on mount

    // 🔄 Poll every 20s
    const interval = setInterval(() => {
      fetchInviteCount();
      fetchUserProfile();
    }, 20000);

    // 🔹 Listen for custom event from Notifications
    const handleRefresh = () => {
      fetchInviteCount();
      fetchUserProfile();
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
  ];

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  
  // 🔹 முதல் எழுத்து கொண்ட அவதார்-ஐ ரெண்டர் செய்யும் காம்போனென்ட்
  const AvatarWithFirstLetter = () => {
    const profileSizeClasses = "w-10 h-10"; // நீங்கள் கேட்டபடி பழைய அளவு
    
    // நீங்கள் கொடுத்த கோடிலிருந்து பெறப்பட்ட கிளாஸ்நேம்கள்
    const imgClasses = `${profileSizeClasses} rounded-full object-cover border-2 border-white cursor-pointer`;
    const divClasses = `${profileSizeClasses} rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-[Pacifico] border-2 border-white cursor-pointer`;

    const getFirstLetter = (name: string) => {
      return name ? name.charAt(0).toUpperCase() : "U";
    };

    if (userProfileData?.profileImage) {
      return (
        <img
          src={userProfileData.profileImage}
          alt="Profile"
          className={imgClasses}
        />
      );
    }

    return (
      <div className={divClasses}>
        {getFirstLetter(userProfileData?.name || "")}
      </div>
    );
  };

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
        {/* ✅ Profile Image Link */}
        <Link
          to="/inv/profile"
          className={`relative flex items-center justify-center px-3 py-2 rounded-lg font-medium transition-all
          ${location.pathname === "/inv/profile"
              ? "bg-gradient-to-r from-indigo-500/30 to-pink-500/30 text-pink-300 shadow"
              : ""}`}
        >
          <AvatarWithFirstLetter />
        </Link>
        {/* ✅ Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-red-600 transition"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
      </nav>
      {/* ✅ Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2a2a2a] p-8 rounded-xl shadow-2xl text-center">
            <h4 className="text-xl text-white mb-4">Are you sure?</h4>
            <p className="text-[#c0c0c0] mb-6">
              You will be logged out of your account.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
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