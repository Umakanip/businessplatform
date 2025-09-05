import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faUserTag,
  faLayerGroup,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

type Profile = {
  id: number;
  name: string;
  email: string;
  category: string;
  profileImage: string | null;
  status?: "pending" | "accepted" | "rejected" | "none";
};
type ProfileDetail = Profile & {
  primaryPhone?: string;
  secondaryPhone?: string;
  role?: string;
};

const IhApproch: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
 // modal state
  const [selectedProfile, setSelectedProfile] = useState<ProfileDetail | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

   useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get("/investors/matching-idealogists", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("API Response:", res.data); // 🔍 debug
        setProfiles(res.data.idealogists || []);
      } catch (error) {
        console.error("Error fetching investors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestors();
  }, []);
 const handleViewProfile = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(`/auth/profile/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedProfile(res.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
  if (loading) {
    return <p className="text-center py-10">Loading suggestions...</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
          {/* Header Section */}
<div className="max-w-7xl mx-auto mb-8 pt-8">
  <h1 className="text-2xl font-bold text-gray-800">
    More suggestions for you
  </h1>
</div>

      {/* Card Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="relative bg-white rounded-2xl shadow-lg px-6 py-6 overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl w-[240px] h-[320px] mx-auto"
          >
            {/* Background Gradient Circle */}
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 transform translate-x-1/3 -translate-y-1/3 opacity-50"></div>

            <div className="flex flex-col items-center z-10 relative h-full justify-between">
              <div className="flex flex-col items-center">
                <img
                  src={
                    profile.profileImage
                      ? `http://localhost:5000/uploads/${profile.profileImage}`
                      : "https://via.placeholder.com/100"
                  }
                  alt={profile.name}
                  className="w-20 h-20 rounded-full object-cover mb-4 ring-2 ring-white shadow-lg"
                />
                <h3 className="text-md font-semibold text-gray-900 text-center">
                  {profile.name}
                </h3>
                <p className="text-sm text-gray-500 text-center">
                  {profile.category}
                </p>
              </div>
            <div className="space-y-2 mt-4 w-full">
              <button
                onClick={() => handleViewProfile(profile.id)}
                className="w-full font-semibold py-2 rounded-full shadow text-sm bg-gray-200 hover:bg-gray-300"
              >
                View Profile
              </button>
              </div>
              {/* ✅ Button section based on status */}
              {profile.status === "accepted" ? (
                <button
                  disabled
                className="w-full font-semibold py-2 rounded-full shadow text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white "
                >
                  Connected
                </button>
              ) : profile.status === "pending" ? (
                <button
                  disabled
                className="w-full font-semibold py-2 rounded-full shadow text-sm bg-yellow-300 "

                >
                  Pending...
                </button>
              ) : (
                <button
                  onClick={async () => {
                    try {
                      await axiosInstance.post(
                        "/connections/send",
                        { receiverId: profile.id },
                        {
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                              "token"
                            )}`,
                          },
                        }
                      );
                      alert("Request sent. Status: pending");

                      // ✅ Update local state → mark this profile as pending
                      setProfiles((prev) =>
                        prev.map((p) =>
                          p.id === profile.id ? { ...p, status: "pending" } : p
                        )
                      );
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                className="w-full font-semibold py-2 rounded-full shadow text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white "
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
         {/* Modal */}
            {showModal && selectedProfile && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative">
                  {/* Header with gradient */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center relative">
                    <button
                      onClick={() => setShowModal(false)}
                      className="absolute top-4 right-4 text-white hover:text-gray-200 text-lg"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <img
                      src={
                        selectedProfile.profileImage
                          ? `http://localhost:5000/uploads/${selectedProfile.profileImage}`
                          : "https://via.placeholder.com/100"
                      }
                      alt={selectedProfile.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white mx-auto shadow-lg"
                    />
                    <h2 className="text-2xl font-bold text-white mt-4">
                      {selectedProfile.name}
                    </h2>
                    <p className="text-indigo-100">{selectedProfile.role}</p>
                    <p className="text-indigo-200 text-sm">
                      {selectedProfile.category}
                    </p>
                  </div>
      
                  {/* Body */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center space-x-3 text-gray-700">
                      <FontAwesomeIcon icon={faEnvelope} className="text-blue-600" />
                      <span className="font-medium">Email:</span>
                      <span>{selectedProfile.email}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-700">
                      <FontAwesomeIcon icon={faPhone} className="text-green-600" />
                      <span className="font-medium">Primary Phone:</span>
                      <span>{selectedProfile.primaryPhone || "-"}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-700">
                      <FontAwesomeIcon icon={faPhone} className="text-purple-600" />
                      <span className="font-medium">Secondary Phone:</span>
                      <span>{selectedProfile.secondaryPhone || "-"}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-700">
                      <FontAwesomeIcon icon={faUserTag} className="text-orange-600" />
                      <span className="font-medium">Role:</span>
                      <span>{selectedProfile.role || "-"}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-700">
                      <FontAwesomeIcon
                        icon={faLayerGroup}
                        className="text-pink-600"
                      />
                      <span className="font-medium">Category:</span>
                      <span>{selectedProfile.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
    </div>
  );
};

export default IhApproch;
