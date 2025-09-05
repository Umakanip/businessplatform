import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
const [showSuccess, setShowSuccess] = useState(false);

  // ✅ Fetch user profile
  useEffect(() => {
    if (!isOpen) return;

    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/login");
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
        navigate("/login");
      });
  }, [isOpen, navigate]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    setUser({ ...user, [e.target.name]: e.target.value });
  };

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

  // ✅ Show success popup
  setShowSuccess(true);
  setTimeout(() => setShowSuccess(false), 2500);
};


   if (!isOpen) return null;

  return (
    <div className="fixed top-16 right-0 bottom-0 z-40 flex">
      {/* Overlay (drawerக்கு பின்புறம் semi-transparent bg) */}
      <div
        className="absolute inset-0 bg-black/30 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer (Swiggy style, header கீழே மட்டும் slide ஆகும்) */}
      <div
        className={`relative ml-auto w-96 bg-white h-full shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <div className="p-6 overflow-y-auto h-full flex flex-col items-center">
          {!user ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <>
              {/* Avatar */}
           {/* Avatar with camera icon overlay */}
<div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-pink-400 shadow mb-4">
  {/* Profile Picture */}
  <img
    src={
      user.profileImage
        ? `http://localhost:5000/uploads/${user.profileImage}`
        : "https://images.unsplash.com/photo-1544005313-94ddf0286df2"
    }
    alt="Profile"
    className="w-full h-full object-cover"
  />

  {/* Hidden File Input */}
  <input
    type="file"
    id="profilePicInput"
    accept="image/*"
    onChange={(e) =>
      e.target.files && setSelectedFile(e.target.files[0])
    }
    className="hidden"
  />

  {/* Camera Icon Overlay (bottom-right of circle) */}
  {editing && (
    <label
      htmlFor="profilePicInput"
      className="absolute bottom-2 right-2 bg-pink-500 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-pink-600 transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 7h4l2-3h6l2 3h4v13H3V7z"
        />
        <circle cx="12" cy="13" r="4" />
      </svg>
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
                <h2 className="text-xl font-semibold">{user.name}</h2>
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
{/* ✅ Success Popup */}
{showSuccess && (
  <div className="fixed top-20 right-5 bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce z-50">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
    <span>Profile updated successfully!</span>
  </div>
)}

              {/* Buttons */}
              <div className="mt-6 flex gap-3">
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDrawer;
