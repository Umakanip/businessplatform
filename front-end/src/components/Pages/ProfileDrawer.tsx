import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faCamera,
  faEdit,
  faSave,
  faSignOutAlt,
  faCheckCircle,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  primaryPhone: string;
  secondaryPhone?: string;
  category: string;
  profileImage?: string;
}

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  showLogout?: boolean;  // 👈 add this line
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // ✅ Fetch user profile
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

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // ✅ Preview when file selected
  useEffect(() => {
    if (!selectedFile) return;
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const handleSave = async () => {
    if (!user) return;
    const token = localStorage.getItem("token");

    const form = new FormData();
    form.append("name", user.name);
    form.append("primaryPhone", user.primaryPhone);
    if (user.secondaryPhone) form.append("secondaryPhone", user.secondaryPhone);
    form.append("category", user.category);
    form.append("email", user.email);
    if (newPassword) form.append("password", newPassword);
    if (selectedFile) form.append("profileImage", selectedFile);

    await axios.put(
      `http://localhost:5000/api/auth/profile/${user.id}`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setEditing(false);
    setNewPassword("");
    setSelectedFile(null);

    // ✅ Success popup
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/auth");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-16 right-0 bottom-0 z-40 flex">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`relative ml-auto w-96 bg-white h-full shadow-2xl rounded-l-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close */}
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
              {/* Avatar */}
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-pink-400 shadow-lg mb-4">
                <img
                  src={
                    preview
                      ? preview
                      : user.profileImage
                      ? `http://localhost:5000/uploads/${user.profileImage}`
                      : "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />

                {/* Hidden input */}
                <input
                  type="file"
                  id="profilePicInput"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files && setSelectedFile(e.target.files[0])
                  }
                  className="hidden"
                />

                {/* Camera overlay */}
                {editing && (
                  <label
                    htmlFor="profilePicInput"
                    className="absolute bottom-2 right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-gray-700 p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 transition"
                  >
                    <FontAwesomeIcon icon={faCamera} />
                  </label>
                )}
              </div>

              {/* Name + Role */}
              {editing ? (
                <input
                  name="name"
                  value={user.name}
                  onChange={handleEditChange}
                  className="px-3 py-1 rounded bg-gray-100 text-gray-800 text-center"
                />
              ) : (
                <h2 className="text-xl font-semibold text-gray-600">{user.name}</h2>
              )}
              <p className="text-pink-500">{user.role}</p>
              <p className="text-gray-500">{user.category}</p>

              {/* Details */}
              <div className="mt-6 w-full space-y-4 text-sm text-gray-700">
                <div>
                  <span className="font-semibold">Email:</span>
                  {editing ? (
                    <input
                      name="email"
                      value={user.email}
                      onChange={handleEditChange}
                      className="w-full mt-1 px-2 py-1 rounded bg-gray-100"
                    />
                  ) : (
                    <p>{user.email}</p>
                  )}
                </div>

                <div>
                  <span className="font-semibold">Primary Phone:</span>
                  {editing ? (
                    <input
                      name="primaryPhone"
                      value={user.primaryPhone}
                      onChange={handleEditChange}
                      className="w-full mt-1 px-2 py-1 rounded bg-gray-100"
                    />
                  ) : (
                    <p>{user.primaryPhone}</p>
                  )}
                </div>

                <div>
                  <span className="font-semibold">Secondary Phone:</span>
                  {editing ? (
                    <input
                      name="secondaryPhone"
                      value={user.secondaryPhone || ""}
                      onChange={handleEditChange}
                      className="w-full mt-1 px-2 py-1 rounded bg-gray-100"
                    />
                  ) : (
                    <p>{user.secondaryPhone || "-"}</p>
                  )}
                </div>

                {editing && (
                  <div>
                    <span className="font-semibold">New Password:</span>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full mt-1 px-2 py-1 rounded bg-gray-100"
                      placeholder="Enter new password"
                    />
                  </div>
                )}
              </div>

              {/* Success Popup */}
              {showSuccess && (
                <div className="fixed top-20 right-5 bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce z-50">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              {/* Buttons */}
              <div className="mt-6 flex gap-3">
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded shadow hover:opacity-90 flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded shadow hover:opacity-90 flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faSave} /> Save
                  </button>
                )}

                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded shadow hover:opacity-90 flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white text-gray-60 p-6 rounded-lg shadow-xl text-center">
            <h3 className="text-lg  text-gray-600 font-semibold mb-4">
              Are you sure you want to logout?
            </h3>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDrawer;
