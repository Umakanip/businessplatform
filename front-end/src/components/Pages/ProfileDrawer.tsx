import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  primaryPhone: string;
  secondaryPhone?: string;
  category: string[];
  profileImage?: string;
}

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/auth");
      return;
    }

    const parsed = JSON.parse(storedUser);

    axios
      .get(`http://localhost:5000/api/auth/profile/${parsed.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("Profile fetch failed:", err);
        navigate("/auth");
      });
  }, [isOpen, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/auth");
  };

  // ✅ First-letter Avatar Component
  const AvatarWithFirstLetter = () => {
    const profileSizeClasses = "w-28 h-28";

    const imgClasses = `${profileSizeClasses} rounded-full object-cover border-4 border-pink-400 shadow-lg mb-4`;
    const divClasses = `${profileSizeClasses} rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white text-4xl font-bold border-4 border-white shadow-lg mb-4`;

    const getFirstLetter = (name: string) => {
      return name ? name.charAt(0).toUpperCase() : "U";
    };

    if (user?.profileImage) {
      return (
        <img
          src={`http://localhost:5000/uploads/${user.profileImage}`}
          alt="Profile"
          className={imgClasses}
        />
      );
    }

    return (
      <div className={divClasses}>
        {getFirstLetter(user?.name || "")}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-16 right-0 bottom-0 z-40 flex">
      <div
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
      />
      <div
        className={`relative ml-auto w-96 bg-white h-full shadow-2xl rounded-l-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>

        <div className="p-6 overflow-y-auto h-full flex flex-col items-center">
          {!user ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <>
              <AvatarWithFirstLetter />

              <h2 className="text-xl font-semibold text-gray-600">{user.name}</h2>
              <p className="text-pink-500">{user.role}</p>

              <div className="w-full mt-4">
                <label className="block font-semibold text-gray-700 mb-1">
                  Categories
                </label>
                <div className="w-full text-left px-4 py-2 bg-gray-100 rounded border border-gray-300">
                  <span
                    className={`${
                      user.category.length === 0 ? "text-gray-400" : "text-gray-800"
                    }`}
                  >
                    {user.category.length > 0
                      ? user.category.join(", ")
                      : "No categories"}
                  </span>
                </div>
              </div>

              <div className="mt-6 w-full space-y-4 text-sm text-gray-700">
                <div>
                  <span className="font-semibold">Email:</span>
                  <p>{user.email}</p>
                </div>

                <div>
                  <span className="font-semibold">Primary Phone:</span>
                  <p>{user.primaryPhone}</p>
                </div>

                <div>
                  <span className="font-semibold">Secondary Phone:</span>
                  <p>{user.secondaryPhone || "-"}</p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowConfirm(true)}
                  className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded shadow hover:opacity-90 flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to logout?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDrawer;
