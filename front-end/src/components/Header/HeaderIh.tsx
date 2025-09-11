import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLink,
  faCreditCard,
  faBell,
  faHome,
  faLightbulb,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "../../utils/axiosInstance";

const HeaderIh: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [inviteCount, setInviteCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [userProfileData, setUserProfileData] = useState<{
    profileImage: string | null;
    name: string;
  } | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
const fetchViewCount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    const parsed = JSON.parse(storedUser); // Add this line to get the user info

    try {
        const res = await axiosInstance.get(`/profile-views/${parsed.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setViewCount(res.data.viewCount);
    } catch (err) {
        console.error("Failed to fetch view count", err);
    }
};


useEffect(() => {
    fetchViewCount();

    const handleRefresh = () => {
        fetchInviteCount();
        fetchUserProfile();
        fetchViewCount();
    };

    window.addEventListener("refreshViews", handleRefresh);

    return () => {
        window.removeEventListener("refreshViews", handleRefresh);
    };
}, []);
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

  // ✅ Fetch user profile data including name and image
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
    }, 20000);

    const handleRefresh = () => {
      fetchInviteCount();
      fetchUserProfile();
      fetchViewCount();
    };
    window.addEventListener("refreshInvites", handleRefresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener("refreshInvites", handleRefresh);
    };
  }, []);

  const ideaHolderMenu = [
    { name: "Home", path: "/", icon: faHome },
    { name: "Investers Hub", path: "/ih/approach", icon: faLightbulb },
    { name: "My Connections", path: "/ih/connections", icon: faLink },
    { name: "Subscription", path: "/ih/subscription", icon: faCreditCard },
    { name: "Notifications", path: "/ih/notifications", icon: faBell },
  ];

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // 🔹 ஒரு எழுத்து கொண்ட அவதார்-ஐ ரெண்டர் செய்யும் காம்போனென்ட்
  const AvatarWithFirstLetter = () => {
    // நீங்கள் அனுப்பிய கோடில் உள்ள கிளாஸ்நேம்கள்
    const baseClasses = "w-10 h-10 rounded-full object-cover cursor-pointer";
    const commonStyles = "ring-2 ring-white shadow-lg transition-all duration-500";
    const getFirstLetter = (name: string) => {
      return name ? name.charAt(0).toUpperCase() : "";
    };

    if (userProfileData?.profileImage) {
      return (
        <img
          src={userProfileData.profileImage}
          alt="Profile"
          className={`${baseClasses} ${commonStyles}`}
        />
      );
    }

    // `w-10 h-10` என்ற அளவு மாறாமல், உங்கள் ஸ்டைல்கள்
    return (
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ring-2 ring-white shadow-lg transition-all duration-500 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-[Pacifico]`}>
        {getFirstLetter(userProfileData?.name || "")}
      </div>
    );
  };

  return (
    <header className="w-full bg-gradient-to-r from-purple-900 via-slate-900 to-purple-800 text-white shadow-lg flex items-center justify-between px-8 py-4 fixed top-0 left-0 z-50">
      <div className="font-extrabold text-2xl tracking-wide">Idea Holder</div>
      <nav className="flex items-center gap-6">
        {ideaHolderMenu.map((item) => (
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
       <Link to="/ih/profile" className="relative flex items-center ...">
    <AvatarWithFirstLetter />
    {viewCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-md">
            {viewCount}
        </span>
    )}
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

export default HeaderIh;