

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faSave,
  faCamera,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

// Define the UserProfile interface
interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  primaryPhone: string;
  secondaryPhone?: string;
  category: string[];
  profileImage?: string;
   bio?: string;  // ✅ New field
}

const ProfileInv: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categoriesList = [
    "IT & Technology",
    "Business & Finance",
    "Healthcare & Medicine",
    "Education & Training",
    "Real Estate",
    "Manufacturing",
    "Retail & E-commerce",
    "Entertainment & Media",
    "Food & Beverage",
    "Transportation & Logistics",
    "Energy & Environment",
    "Other",
  ];

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!storedUser || !token) {
        navigate("/auth");
        return;
      }

      const parsed = JSON.parse(storedUser);

      try {
        const res = await axios.get(
  `http://localhost:5000/api/auth/profile/${parsed.id}`,
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);

const data = res.data;
setUser({ ...data, category: Array.isArray(data.category) ? data.category : [] });

        setUser(res.data);
      } catch (err) {
        console.error("Profile fetch failed:", err);
        navigate("/auth");
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Handle outside click for categories dropdown
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoriesDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // File preview
  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  // Handle input changes
const handleEditChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  if (!user) return;
  setUser({ ...user, [e.target.name]: e.target.value });
};


  // Toggle category selection
// Safe join for categories
const getSelectedCategoriesText = () => {
  if (!user || !Array.isArray(user.category) || user.category.length === 0)
    return "Select categories...";
  return user.category.join(", ");
};

// Toggle category selection safely
const handleCategorySelection = (category: string) => {
  if (!user) return;

  // ensure it's an array
  const currentCategories = Array.isArray(user.category) ? user.category : [];
  
  const isSelected = currentCategories.includes(category);
  const newCategories = isSelected
    ? currentCategories.filter((c) => c !== category)
    : [...currentCategories, category];

  setUser({ ...user, category: newCategories });
};


  const handleSave = async () => {
    if (!user) return;
    const token = localStorage.getItem("token");

    const form = new FormData();
    form.append("name", user.name);
    form.append("primaryPhone", user.primaryPhone);
    if (user.secondaryPhone) form.append("secondaryPhone", user.secondaryPhone);
    form.append("category", JSON.stringify(user.category));
    form.append("email", user.email);
    form.append("role", user.role); // Role is part of the API, so include it
    if (newPassword) form.append("password", newPassword);
    if (selectedFile) form.append("profileImage", selectedFile);
    if (user.bio) form.append("bio", user.bio); // ✅ Add bio
    try {
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

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
      
      // Re-fetch profile to get updated data
      const res = await axios.get(
        `http://localhost:5000/api/auth/profile/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(res.data);
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center text-[#c0c0c0]">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-4 text-[#c0c0c0] md:p-8">
      <div className="flex flex-col gap-5 md:flex-row md:gap-8 max-w-7xl mx-auto">
        {/* Left Panel */}
        <div className="flex-grow md:flex-grow-0 md:basis-1/3 bg-[#2a2a2a] p-6 rounded-xl shadow-xl flex flex-col items-center text-center">
          <div className="relative w-48 h-48 md:w-52 md:h-52 rounded-full border-4 border-[#3c3c3c] p-1 bg-[#2a2a2a] flex items-center justify-center">
            <img
              src={
                preview
                  ? preview
                  : user.profileImage
                  ? `http://localhost:5000/uploads/${user.profileImage}`
                  : "https://i.ibb.co/L5r6N1X/profile-pic.png"
              }
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
            {editing && (
              <>
                <input
                  type="file"
                  id="profilePicInput"
                  accept="image/*"
                  onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
                  className="hidden"
                />
                <label
                  htmlFor="profilePicInput"
                  className="absolute bottom-2 right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white p-3 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform duration-200"
                >
                  <FontAwesomeIcon icon={faCamera} />
                </label>
              </>
            )}
          </div>
          {editing ? (
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleEditChange}
              className="text-2xl font-bold text-white mt-5 bg-[#3a3a3a] text-center rounded px-2"
            />
          ) : (
            <h2 className="text-2xl font-bold text-white mt-5">{user.name}</h2>
          )}
          <p className="text-sm text-[#a0a0a0] mt-1">{user.role}</p>
        </div>

        {/* Right Panel */}
        <div className="flex-grow md:basis-2/3 bg-[#2a2a2a] p-6 rounded-xl shadow-xl">
          <div className="flex justify-between items-center mb-5 pb-2 border-b border-[#444]">
            <h3 className="text-lg font-semibold text-white">
              Profile Details
            </h3>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_5px_rgba(40,167,69,1)]"></span>
              {editing ? (
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-green-600 transition"
                >
                  <FontAwesomeIcon icon={faSave} /> Save
                </button>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-pink-600 transition"
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
           <div className="flex flex-col">
  <span className="text-xs text-[#808080]">Email</span>
  {editing ? (
    <input
      type="email"
      name="email"
      value={user.email}
      onChange={handleEditChange}
      className="text-base text-[#e0e0e0] bg-[#3a3a3a] rounded px-2 py-1"
    />
  ) : (
    <span className="text-base text-[#e0e0e0]">{user.email}</span>
  )}
</div>

 <div className="relative flex flex-col col-span-1 md:col-span-2" ref={dropdownRef}>
              <span className="text-xs text-[#808080]">Categories</span>
              <div
                onClick={() => editing && setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)}
                className="w-full text-left px-4 py-2 bg-[#3a3a3a] rounded-lg border border-[#444] cursor-pointer"
              >
                <span className={`${user.category.length === 0 ? "text-gray-500" : "text-[#e0e0e0]"}`}>
                  {getSelectedCategoriesText()}
                </span>
              </div>
              {editing && isCategoriesDropdownOpen && (
                <div className="absolute top-full z-10 w-full mt-1 bg-[#3a3a3a] border border-[#444] rounded-lg shadow-xl max-h-48 overflow-y-auto">
                  {categoriesList.map((c) => (
                    <div
                      key={c}
                      onClick={() => handleCategorySelection(c)}
                      className="flex items-center px-4 py-3 cursor-pointer hover:bg-[#444]"
                    >
                      <input
                        type="checkbox"
                        checked={user.category.includes(c)}
                        readOnly
                        className="mr-3 w-4 h-4 rounded accent-pink-500"
                      />
                      <span className="text-gray-300">{c}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
           

            <div className="flex flex-col">
              <span className="text-xs text-[#808080]">Secondary Phone</span>
              {editing ? (
                <input
                  type="text"
                  name="secondaryPhone"
                  value={user.secondaryPhone || ""}
                  onChange={handleEditChange}
                  className="text-base text-[#e0e0e0] bg-[#3a3a3a] rounded px-2 py-1"
                />
              ) : (
                <span className="text-base text-[#e0e0e0]">{user.secondaryPhone || "-"}</span>
              )}
            </div>

 <div className="flex flex-col">
              <span className="text-xs text-[#808080]">Primary Phone</span>
              {editing ? (
                <input
                  type="text"
                  name="primaryPhone"
                  value={user.primaryPhone}
                  onChange={handleEditChange}
                  className="text-base text-[#e0e0e0] bg-[#3a3a3a] rounded px-2 py-1"
                />
              ) : (
                <span className="text-base text-[#e0e0e0]">{user.primaryPhone}</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#808080]">Role</span>
              <span className="text-base text-[#e0e0e0] capitalize">{user.role}</span>
            </div>

            {editing && (
              <div className="flex flex-col">
                <span className="text-xs text-[#808080]">New Password</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="text-base text-[#e0e0e0] bg-[#3a3a3a] rounded px-2 py-1"
                  placeholder="Leave blank to keep current password"
                />
              </div>
            )}
<div className="flex flex-col col-span-1 md:col-span-2">
  <span className="text-xs text-[#808080]">Bio</span>
  {editing ? (
 <textarea
  name="bio"
  value={user.bio || ""}
  onChange={handleEditChange}
  maxLength={250}
  rows={3}
  className="text-base text-[#e0e0e0] bg-[#3a3a3a] rounded px-2 py-1 resize-none"
  placeholder="Write something about yourself (max 250 characters)..."
/>

  ) : (
    <span className="text-base text-[#e0e0e0] whitespace-pre-line">
      {user.bio || "—"}
    </span>
  )}
</div>

           
          </div>
        </div>
      </div>
      {showSuccess && (
        <div className="fixed top-20 right-5 bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce z-50">
          <FontAwesomeIcon icon={faCheckCircle} />
          <span>Profile updated successfully!</span>
        </div>
      )}
    </div>
  );
};

export default ProfileInv;